#!/usr/bin/env node

/**
 * 批量帧生成脚本
 * 一次启动 CS2，连续录制同一玩家的多个回合
 *
 * 用法：
 *   node cli-generate-frames-batch.mjs \
 *     --checksum <checksum> \
 *     --player <steam_id> \
 *     --rounds 1,2,3,4,5 \
 *     --demo <path>
 *
 * 或者指定范围：
 *   --rounds 1-23
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析参数
const args = process.argv.slice(2);
let checksum, playerSteamId, roundsSpec, demoPath;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum' && i + 1 < args.length) {
    checksum = args[i + 1];
    i++;
  } else if (args[i] === '--player' && i + 1 < args.length) {
    playerSteamId = args[i + 1];
    i++;
  } else if (args[i] === '--rounds' && i + 1 < args.length) {
    roundsSpec = args[i + 1];
    i++;
  } else if (args[i] === '--demo' && i + 1 < args.length) {
    demoPath = args[i + 1];
    i++;
  }
}

if (!checksum || !playerSteamId || !roundsSpec || !demoPath) {
  console.error('用法: node cli-generate-frames-batch.mjs --checksum <checksum> --player <steam_id> --rounds <1,2,3 或 1-23> --demo <path>');
  process.exit(1);
}

// 解析回合号列表
function parseRounds(spec) {
  const rounds = [];
  const parts = spec.split(',');

  for (const part of parts) {
    if (part.includes('-')) {
      // 范围：1-23
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        rounds.push(i);
      }
    } else {
      // 单个：1,2,3
      rounds.push(Number(part));
    }
  }

  return rounds.sort((a, b) => a - b);
}

const rounds = parseRounds(roundsSpec);

console.log('='.repeat(80));
console.log('批量帧生成器');
console.log('='.repeat(80));
console.log(`Checksum: ${checksum}`);
console.log(`Player: ${playerSteamId}`);
console.log(`Rounds: ${rounds.join(', ')} (共 ${rounds.length} 个回合)`);
console.log('');

async function main() {
  let client;

  try {
    // 1. 连接数据库
    console.log('连接数据库...');
    const { default: pg } = await import('pg');
    const { Client } = pg;

    client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    // 2. 查询所有回合的录制任务
    console.log('查询录制任务...');
    const tasksQuery = `
      SELECT
        round_number,
        player_steam_id,
        player_name,
        MIN(start_tick) as video_start_tick,
        MAX(end_tick) as video_end_tick,
        COUNT(id) as total_windows
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = ANY($3)
      GROUP BY round_number, player_steam_id, player_name
      ORDER BY round_number ASC
    `;

    const tasksResult = await client.query(tasksQuery, [checksum, playerSteamId, rounds]);
    const tasks = tasksResult.rows;

    if (tasks.length === 0) {
      console.error('错误：未找到任何录制任务');
      await client.end();
      process.exit(1);
    }

    console.log(`✓ 找到 ${tasks.length} 个录制任务:`);
    for (const task of tasks) {
      console.log(`  - Round ${task.round_number}: ${task.player_name}, Tick ${task.video_start_tick}-${task.video_end_tick}, ${task.total_windows} 窗口`);
    }

    // 3. 查询所有回合的窗口信息
    console.log('\n查询窗口详细信息...');
    const allWindows = new Map(); // round_number -> windows[]

    for (const round of rounds) {
      const windowsQuery = `
        SELECT
          id,
          window_idx,
          start_tick,
          end_tick,
          situation_text,
          events_json,
          pos_x, pos_y, pos_z,
          health, armor, weapon,
          is_moving, move_direction, move_speed
        FROM training_windows
        WHERE match_checksum = $1
          AND player_steam_id = $2
          AND round_number = $3
        ORDER BY window_idx ASC
      `;

      const windowsResult = await client.query(windowsQuery, [checksum, playerSteamId, round]);
      allWindows.set(round, windowsResult.rows);
      console.log(`  - Round ${round}: ${windowsResult.rows.length} 个窗口`);
    }

    // 4. 获取 tickrate
    const demoQuery = await client.query(
      'SELECT tickrate FROM demos WHERE checksum = $1',
      [checksum]
    );

    if (demoQuery.rows.length === 0) {
      console.error('错误：未找到 demo');
      await client.end();
      process.exit(1);
    }

    const tickrate = demoQuery.rows[0].tickrate;
    console.log(`\n✓ Tickrate: ${tickrate}`);

    await client.end();

    // 5. 创建输出目录
    const outputRoot = 'F:/cs_data/traindata';
    const playerName = tasks[0].player_name;
    console.log(`\n创建输出目录...`);

    for (const round of rounds) {
      const outputFolder = `${playerName}_${playerSteamId}_round${round}`;
      const outputPath = path.join(outputRoot, outputFolder);
      const framesPath = path.join(outputPath, 'frames');
      await fs.mkdirp(framesPath);
      console.log(`  ✓ ${outputPath}`);
    }

    // 6. 生成批量录制 JSON 文件
    console.log('\n生成批量录制 JSON 文件...');
    const jsonPath = demoPath + '.batch.json';
    const roundedTickrate = Math.round(tickrate);

    // 构建所有回合的录制命令
    const actions = [
      // 全局设置（只需一次）
      { tick: 1, cmd: 'sv_cheats 1' },
      { tick: 1, cmd: 'volume 0' },  // 静音，提升性能
      { tick: 1, cmd: 'cl_draw_only_deathnotices 0' },
      { tick: 1, cmd: 'spec_show_xray 0' },
      { tick: 1, cmd: 'demo_timescale 1' },  // 4倍速
      { tick: 1, cmd: 'spec_mode 1' },  // 第一人称
      { tick: 5, cmd: `spec_player x${playerSteamId}` },  // 锁定玩家
    ];

    // 为每个回合添加录制命令
    for (const task of tasks) {
      const startTick = Number(task.video_start_tick);
      const endTick = Number(task.video_end_tick);
      const setupTick = startTick - roundedTickrate > 0 ? startTick - roundedTickrate : startTick - 10;

      // 准备录制
      actions.push({ tick: setupTick, cmd: 'host_framerate 25' });
      actions.push({ tick: setupTick, cmd: `spec_player x${playerSteamId}` });  // 重新锁定（保险）

      // 开始录制（使用回合号作为文件名前缀）
      actions.push({ tick: startTick, cmd: `startmovie "round${task.round_number}_frames" jpg` });

      // 结束录制
      actions.push({ tick: endTick, cmd: 'endmovie' });
    }

    // 所有回合录制完成后退出
    const lastTask = tasks[tasks.length - 1];
    const quitTick = Number(lastTask.video_end_tick) + 50;
    actions.push({ tick: quitTick, cmd: 'quit' });

    // 按 tick 排序
    actions.sort((a, b) => a.tick - b.tick);

    const jsonContent = [{ actions }];
    await fs.writeJSON(jsonPath, jsonContent, { spaces: 2 });
    console.log(`✓ JSON 文件已创建: ${jsonPath}`);
    console.log(`✓ 总命令数: ${actions.length}`);

    // 7. 启动 CS2
    console.log('\n启动 CS2 并开始批量录制...');
    console.log(`⏱️  预估时间: ${tasks.length * 30} 秒（40x 倍速）`);
    console.log('⚠️  请不要操作游戏窗口，录制会自动完成');
    console.log('');

    const cs2Path = 'D:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/bin/win64/cs2.exe';
    const launchArgs = [
      '-insecure',
      '-novid',
      '-sw',
      '-width 640',
      '-height 480',
      `+playdemo "${demoPath}"`,
    ].join(' ');

    const command = `"${cs2Path}" ${launchArgs}`;

    // 更新 JSON 路径为批量版本
    const originalJsonPath = demoPath + '.json';
    await fs.copy(jsonPath, originalJsonPath, { overwrite: true });
    console.log(`✓ 已将批量 JSON 复制为主 JSON: ${originalJsonPath}`);

    // 记录开始时间
    const recordStartTime = new Date();
    console.log(`开始时间: ${recordStartTime.toLocaleTimeString()}`);

    // 启动 CS2（等待进程结束）
    try {
      await execAsync(command, {
        cwd: path.dirname(cs2Path),
        timeout: 3600000, // 1小时超时（批量录制可能很长）
      });
    } catch (error) {
      // CS2 正常退出会抛出错误（quit命令），这是预期行为
      if (!error.message.includes('quit') && error.code !== 0) {
        console.error('CS2 异常退出:', error.message);
      }
    }

    console.log('\n✓ CS2 已退出');
    console.log('等待 3 秒让文件系统同步...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 8. 查找并移动图片文件
    console.log('\n移动图片文件...');
    const cs2MovieDir = 'D:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/csdm/movie';

    if (!await fs.pathExists(cs2MovieDir)) {
      console.error(`错误：CS2 movie 目录不存在: ${cs2MovieDir}`);
      process.exit(1);
    }

    // 查找最新的录制目录
    const movieFolders = await fs.readdir(cs2MovieDir);
    const recentFolders = movieFolders
      .map(name => {
        const fullPath = path.join(cs2MovieDir, name);
        const stat = fs.statSync(fullPath);
        return { name, path: fullPath, mtime: stat.mtime };
      })
      .filter(f => f.mtime >= recordStartTime)
      .sort((a, b) => b.mtime - a.mtime);

    if (recentFolders.length === 0) {
      console.error('错误：未找到录制生成的图片目录');
      console.error(`搜索范围: ${cs2MovieDir}`);
      console.error(`开始时间: ${recordStartTime.toISOString()}`);
      process.exit(1);
    }

    const latestFolder = recentFolders[0];
    console.log(`找到图片目录: ${latestFolder.name}`);

    // 移动每个回合的图片
    for (const task of tasks) {
      const roundNumber = task.round_number;
      const outputFolder = `${playerName}_${playerSteamId}_round${roundNumber}`;
      const outputPath = path.join(outputRoot, outputFolder, 'frames');

      // 查找以 round<N>_frames 开头的图片
      const prefix = `round${roundNumber}_frames`;
      const allFiles = await fs.readdir(latestFolder.path);
      const roundFiles = allFiles.filter(f => f.startsWith(prefix) && f.endsWith('.jpg'));

      if (roundFiles.length === 0) {
        console.warn(`  ⚠️  Round ${roundNumber}: 未找到图片文件（前缀: ${prefix}）`);
        continue;
      }

      console.log(`  Round ${roundNumber}: 移动 ${roundFiles.length} 个图片...`);

      // 重命名并移动（去掉前缀）
      let fileIndex = 1;
      for (const file of roundFiles.sort()) {
        const sourcePath = path.join(latestFolder.path, file);
        const newFileName = `frame_${String(fileIndex).padStart(4, '0')}.jpg`;
        const destPath = path.join(outputPath, newFileName);
        await fs.move(sourcePath, destPath, { overwrite: true });
        fileIndex++;
      }

      console.log(`    ✓ 移动完成: ${outputPath}`);

      // 验证图片数量
      const windows = allWindows.get(roundNumber);
      const expectedFrames = windows.length * 10;
      const actualFrames = roundFiles.length;

      if (actualFrames !== expectedFrames) {
        console.warn(`    ⚠️  图片数量不匹配: 预期 ${expectedFrames}, 实际 ${actualFrames}`);
      } else {
        console.log(`    ✓ 图片数量正确: ${actualFrames}`);
      }
    }

    // 9. 更新数据库中的图片路径
    console.log('\n更新数据库中的图片路径...');
    const { default: pg2 } = await import('pg');
    const { Client: Client2 } = pg2;

    const client2 = new Client2({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client2.connect();

    for (const round of rounds) {
      const windows = allWindows.get(round);
      const outputFolder = `${playerName}_${playerSteamId}_round${round}`;
      const framesPath = path.join(outputRoot, outputFolder, 'frames');

      for (let i = 0; i < windows.length; i++) {
        const window = windows[i];
        const startFrameNum = i * 10 + 1;
        const endFrameNum = i * 10 + 10;

        const startFramePath = path.join(framesPath, `frame_${String(startFrameNum).padStart(4, '0')}.jpg`);
        const endFramePath = path.join(framesPath, `frame_${String(endFrameNum).padStart(4, '0')}.jpg`);

        const middleFramePaths = [];
        for (let j = startFrameNum + 1; j < endFrameNum; j++) {
          middleFramePaths.push(path.join(framesPath, `frame_${String(j).padStart(4, '0')}.jpg`));
        }

        await client2.query(
          `UPDATE training_windows
           SET start_frame_path = $1,
               middle_frame_paths = $2,
               end_frame_path = $3
           WHERE id = $4`,
          [startFramePath, JSON.stringify(middleFramePaths), endFramePath, window.id]
        );
      }

      console.log(`  ✓ Round ${round}: 更新了 ${windows.length} 个窗口`);
    }

    await client2.end();

    // 10. 清理临时文件
    console.log('\n清理临时文件...');
    await fs.remove(latestFolder.path);
    await fs.remove(jsonPath);
    await fs.remove(originalJsonPath);
    console.log('✓ 清理完成');

    console.log('\n' + '='.repeat(80));
    console.log('✓ 批量录制完成！');
    console.log('='.repeat(80));
    console.log(`录制回合: ${rounds.join(', ')}`);
    console.log(`总窗口数: ${Array.from(allWindows.values()).reduce((sum, w) => sum + w.length, 0)}`);
    console.log(`总图片数: ${Array.from(allWindows.values()).reduce((sum, w) => sum + w.length * 10, 0)}`);
    console.log('');

  } catch (error) {
    console.error('❌ 错误:', error);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

main();
