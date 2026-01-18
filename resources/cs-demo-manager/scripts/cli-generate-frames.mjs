#!/usr/bin/env node

/**
 * CLI 版本的帧生成命令
 * 输出结构：
 * F:\cs_data\traindata\
 *   ├── <player_name>_<steam_id>_round<N>\
 *   │   ├── frames\
 *   │   │   ├── frame_0001.jpg
 *   │   │   ├── frame_0002.jpg
 *   │   │   └── ...
 *   │   └── data.json  (包含所有窗口信息和图片相对路径)
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
let checksum, playerSteamId, roundNumber, demoPath;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum' && i + 1 < args.length) {
    checksum = args[i + 1];
    i++;
  } else if (args[i] === '--player' && i + 1 < args.length) {
    playerSteamId = args[i + 1];
    i++;
  } else if (args[i] === '--round' && i + 1 < args.length) {
    roundNumber = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--demo' && i + 1 < args.length) {
    demoPath = args[i + 1];
    i++;
  }
}

if (!checksum || !playerSteamId || !roundNumber || !demoPath) {
  console.error('用法: node cli-generate-frames.mjs --checksum <checksum> --player <steam_id> --round <number> --demo <path>');
  process.exit(1);
}

console.log('='.repeat(80));
console.log('CLI 帧生成器（简化版）');
console.log('='.repeat(80));
console.log(`Checksum: ${checksum}`);
console.log(`Player: ${playerSteamId}`);
console.log(`Round: ${roundNumber}`);
console.log('');

async function main() {
  let client;

  try {
    // 1. 从数据库查询录制任务和所有窗口数据
    console.log('查询数据库...');
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

    // 查询任务信息
    const taskQuery = `
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
        AND round_number = $3
      GROUP BY round_number, player_steam_id, player_name
    `;

    const taskResult = await client.query(taskQuery, [checksum, playerSteamId, roundNumber]);

    if (taskResult.rows.length === 0) {
      console.error('错误：未找到录制任务');
      await client.end();
      process.exit(1);
    }

    const task = taskResult.rows[0];
    console.log(`找到任务: Round ${task.round_number}, ${task.player_name}`);
    console.log(`  Tick 范围: ${task.video_start_tick}-${task.video_end_tick}`);
    console.log(`  总窗口数: ${task.total_windows}`);

    // 查询所有窗口的详细信息
    console.log('查询窗口详细信息...');
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

    const windowsResult = await client.query(windowsQuery, [checksum, playerSteamId, roundNumber]);
    const windows = windowsResult.rows;
    console.log(`✓ 查询到 ${windows.length} 个窗口`);

    // 获取 tickrate
    const demoQuery = await client.query(
      'SELECT tickrate FROM demos WHERE checksum = $1',
      [checksum]
    );

    if (demoQuery.rows.length === 0) {
      console.error('错误：未找到 demo');
      await client.end();
      process.exit(1);
    }

    const demo = demoQuery.rows[0];
    const tickrate = demo.tickrate;

    console.log(`Demo 路径: ${demoPath}`);
    console.log(`Tickrate: ${tickrate}`);

    // 2. 设置输出路径（F:\cs_data\traindata\<player>_<steam_id>_round<N>）
    const outputRoot = 'F:/cs_data/traindata';
    const outputFolder = `${task.player_name}_${playerSteamId}_round${roundNumber}`;
    const outputPath = path.join(outputRoot, outputFolder);
    const framesPath = path.join(outputPath, 'frames');

    console.log(`输出目录: ${outputPath}`);
    await fs.mkdirp(framesPath);

    // 3. 创建 JSON actions 文件
    console.log('\n创建 JSON actions 文件...');
    const jsonPath = demoPath + '.json';

    const startTick = Number(task.video_start_tick);
    const endTick = Number(task.video_end_tick);
    const roundedTickrate = Math.round(tickrate);
    const setupTick = startTick - roundedTickrate > 0 ? startTick - roundedTickrate : 1;
    const gotoTick = Math.max(1, setupTick - roundedTickrate * 2);
    const jsonContent = [
      {
        actions: [
          { tick: 1, cmd: 'sv_cheats 1' },
          { tick: 1, cmd: 'volume 1' },
          { tick: 1, cmd: 'cl_draw_only_deathnotices 0' },
          { tick: 1, cmd: 'spec_show_xray 0' },  // 关闭X光
          { tick: 1, cmd: `demo_gototick ${gotoTick} 1` },  // 直接跳转到目标回合
          { tick: gotoTick + 5, cmd: 'demo_timescale 1' },
          // 观察玩家：先设置模式，再选择玩家（使用 Steam ID）
          { tick: gotoTick + 5, cmd: 'spec_mode 10' },
          { tick: gotoTick + 10, cmd: `spec_player x${task.player_steam_id}` },
          // 设置帧率和开始录制
          { tick: setupTick, cmd: 'host_framerate 25' },
          { tick: setupTick, cmd: `startmovie "frames" jpg` },
          // 结束录制
          { tick: endTick, cmd: 'endmovie' },
          { tick: endTick + 10, cmd: 'quit' },
        ]
      }
    ];

    await fs.writeJSON(jsonPath, jsonContent, { spaces: 2 });
    console.log(`✓ JSON 文件已创建: ${jsonPath}`);

    // 4. 启动 CS2
    console.log('\n启动 CS2...');
    console.log('⚠ 请不要操作游戏窗口，录制会自动完成');
    console.log('');

    const cs2Path = 'D:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/bin/win64/cs2.exe';
    const launchArgs = [
      '-insecure',
      '-novid',
      '-sw', // Windowed mode
      '-width 640',
      '-height 480',
      `+playdemo "${demoPath}"`,
    ].join(' ');

    const command = `"${cs2Path}" ${launchArgs}`;
    console.log(`执行: ${command}`);

    // 记录开始时间，用于查找CS2生成的图片目录
    const recordStartTime = new Date();

    // 启动 CS2 并等待它退出
    const cs2Process = exec(command, { windowsHide: false });

    cs2Process.stdout?.on('data', (data) => {
      console.log('[CS2]', data.toString().trim());
    });

    cs2Process.stderr?.on('data', (data) => {
      console.error('[CS2 Error]', data.toString().trim());
    });

    await new Promise((resolve, reject) => {
      cs2Process.on('exit', (code) => {
        console.log(`\nCS2 退出，退出码: ${code}`);
        resolve();
      });

      cs2Process.on('error', (error) => {
        console.error('\nCS2 启动失败:', error.message);
        reject(error);
      });
    });

    // 5. 清理 JSON 文件
    await fs.remove(jsonPath);

    // 6. 查找并移动CS2生成的图片
    console.log('\n查找CS2生成的图片...');
    const cs2MoviePath = 'D:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/csdm/movie';

    // 查找最新创建的目录（按修改时间排序）
    const movieDirs = await fs.readdir(cs2MoviePath);
    let latestDir = null;
    let latestTime = 0;

    for (const dir of movieDirs) {
      const dirPath = path.join(cs2MoviePath, dir);
      try {
        const stat = await fs.stat(dirPath);
        if (stat.isDirectory() && stat.mtime.getTime() > latestTime) {
          latestTime = stat.mtime.getTime();
          latestDir = dirPath;
        }
      } catch (err) {
        // 忽略访问错误
      }
    }

    if (!latestDir) {
      console.error('错误：未找到CS2生成的图片目录');
      await client.end();
      process.exit(1);
    }

    console.log(`找到CS2图片目录: ${latestDir}`);

    // 移动图片文件
    console.log('移动图片文件...');
    const cs2Files = await fs.readdir(latestDir);
    const jpgFiles = cs2Files.filter(f => f.endsWith('.jpg')).sort();

    if (jpgFiles.length === 0) {
      console.error('错误：CS2目录中没有图片文件');
      await client.end();
      process.exit(1);
    }

    console.log(`找到 ${jpgFiles.length} 个图片文件`);

    // 移动并重命名图片
    for (let i = 0; i < jpgFiles.length; i++) {
      const srcFile = path.join(latestDir, jpgFiles[i]);
      const dstFile = path.join(framesPath, `frame_${String(i + 1).padStart(4, '0')}.jpg`);
      await fs.move(srcFile, dstFile, { overwrite: true });
    }

    console.log(`✓ 图片已移动到: ${framesPath}`);

    // 删除CS2的临时目录
    await fs.remove(latestDir);

    // 7. 生成 data.json 文件
    console.log('\n生成 data.json...');

    const dataJson = {
      demo_checksum: checksum,
      player_name: task.player_name,
      player_steam_id: playerSteamId,
      round_number: roundNumber,
      tickrate: tickrate,
      total_windows: windows.length,
      total_frames: jpgFiles.length,
      windows: windows.map((w, idx) => {
        // 计算这个窗口对应的10帧图片（每个窗口10帧）
        const startFrameIdx = idx * 10 + 1;
        const frameIndices = Array.from({length: 10}, (_, i) => startFrameIdx + i);

        return {
          window_index: w.window_idx,
          start_tick: w.start_tick,
          end_tick: w.end_tick,

          // 帧路径（相对于traindata目录）
          start_frame: `${outputFolder}/frames/frame_${String(frameIndices[0]).padStart(4, '0')}.jpg`,
          middle_frames: frameIndices.slice(1, 9).map(i =>
            `${outputFolder}/frames/frame_${String(i).padStart(4, '0')}.jpg`
          ),
          end_frame: `${outputFolder}/frames/frame_${String(frameIndices[9]).padStart(4, '0')}.jpg`,

          // 情况描述
          situation: w.situation_text,

          // 事件
          events: w.events_json || [],

          // 玩家状态
          player_state: {
            position: {
              x: w.pos_x,
              y: w.pos_y,
              z: w.pos_z
            },
            health: w.health,
            armor: w.armor,
            weapon: w.weapon,
            is_moving: w.is_moving,
            move_direction: w.move_direction,
            move_speed: w.move_speed
          }
        };
      })
    };

    const dataJsonPath = path.join(outputPath, 'data.json');
    await fs.writeJSON(dataJsonPath, dataJson, { spaces: 2 });
    console.log(`✓ data.json 已生成: ${dataJsonPath}`);

    await client.end();

    console.log('\n' + '='.repeat(80));
    console.log('✓ 录制完成');
    console.log('='.repeat(80));
    console.log(`输出目录: ${outputPath}`);
    console.log(`  - 图片数量: ${jpgFiles.length}`);
    console.log(`  - 窗口数量: ${windows.length}`);
    console.log(`  - data.json: ${dataJsonPath}`);
    console.log('');

  } catch (error) {
    console.error('\n错误:', error.message);
    console.error(error.stack);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

main();
