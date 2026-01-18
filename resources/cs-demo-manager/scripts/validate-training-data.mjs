#!/usr/bin/env node
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

async function validateTrainingData(checksum, playerSteamId, roundNumber) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('🔍 开始验证训练数据...\n');

  try {
    // 1. 检查数据库中的窗口记录
    console.log('📊 [1/6] 检查数据库记录...');
    const windowsQuery = `
      SELECT
        id, window_idx, match_checksum, player_steam_id, round_number,
        start_frame_path, middle_frame_paths, end_frame_path,
        situation_text, events_json,
        health, armor, weapon, is_moving, move_direction,
        start_tick, end_tick, time_ms
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      ORDER BY window_idx
    `;

    const result = await client.query(windowsQuery, [checksum, playerSteamId, roundNumber]);
    const windows = result.rows;

    if (windows.length === 0) {
      console.log('❌ 未找到任何训练窗口记录！');
      await client.end();
      return;
    }

    console.log(`✅ 找到 ${windows.length} 个时间窗口\n`);

    // 2. 检查窗口索引连续性
    console.log('📈 [2/6] 检查窗口索引连续性...');
    let indexIssues = [];
    for (let i = 0; i < windows.length; i++) {
      if (windows[i].window_idx !== i) {
        indexIssues.push(`窗口 ${i}: 期望索引 ${i}, 实际索引 ${windows[i].window_idx}`);
      }
    }

    if (indexIssues.length > 0) {
      console.log(`⚠️  发现 ${indexIssues.length} 个索引问题:`);
      indexIssues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log(`✅ 窗口索引连续（0 到 ${windows.length - 1}）\n`);
    }

    // 3. 检查所有图片文件是否存在
    console.log('🖼️  [3/6] 检查图片文件完整性...');
    let missingFiles = [];
    let totalFrames = 0;

    for (const window of windows) {
      // 检查起始帧
      if (window.start_frame_path) {
        totalFrames++;
        if (!fs.existsSync(window.start_frame_path)) {
          missingFiles.push(`窗口 ${window.window_idx}: 起始帧 ${window.start_frame_path}`);
        }
      }

      // 检查中间帧
      if (window.middle_frame_paths) {
        const middlePaths = JSON.parse(window.middle_frame_paths);
        totalFrames += middlePaths.length;
        middlePaths.forEach((framePath, idx) => {
          if (!fs.existsSync(framePath)) {
            missingFiles.push(`窗口 ${window.window_idx}: 中间帧 ${idx + 1} ${framePath}`);
          }
        });
      }

      // 检查结束帧
      if (window.end_frame_path) {
        totalFrames++;
        if (!fs.existsSync(window.end_frame_path)) {
          missingFiles.push(`窗口 ${window.window_idx}: 结束帧 ${window.end_frame_path}`);
        }
      }
    }

    if (missingFiles.length > 0) {
      console.log(`❌ 发现 ${missingFiles.length} 个缺失的图片文件:`);
      missingFiles.slice(0, 10).forEach(file => console.log(`   ${file}`));
      if (missingFiles.length > 10) {
        console.log(`   ... 还有 ${missingFiles.length - 10} 个文件\n`);
      }
    } else {
      console.log(`✅ 所有 ${totalFrames} 个图片文件都存在\n`);
    }

    // 4. 检查图片文件大小（检测损坏文件）
    console.log('📏 [4/6] 检查图片文件大小...');
    let corruptedFiles = [];
    let totalSize = 0;

    for (const window of windows) {
      const allPaths = [
        window.start_frame_path,
        ...(window.middle_frame_paths ? JSON.parse(window.middle_frame_paths) : []),
        window.end_frame_path
      ].filter(p => p && fs.existsSync(p));

      for (const framePath of allPaths) {
        try {
          const stats = fs.statSync(framePath);
          totalSize += stats.size;

          // 检查文件大小是否异常（小于 1KB 可能是损坏文件）
          if (stats.size < 1024) {
            corruptedFiles.push(`${framePath} (${stats.size} bytes)`);
          }
        } catch (err) {
          corruptedFiles.push(`${framePath} (无法读取)`);
        }
      }
    }

    const avgSizeMB = (totalSize / totalFrames / 1024 / 1024).toFixed(2);
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

    if (corruptedFiles.length > 0) {
      console.log(`⚠️  发现 ${corruptedFiles.length} 个可能损坏的文件:`);
      corruptedFiles.slice(0, 5).forEach(file => console.log(`   ${file}`));
    } else {
      console.log(`✅ 所有图片文件大小正常`);
    }
    console.log(`   总大小: ${totalSizeMB} MB`);
    console.log(`   平均大小: ${avgSizeMB} MB/帧\n`);

    // 5. 检查元数据完整性
    console.log('📋 [5/6] 检查元数据完整性...');
    let metadataIssues = [];

    for (const window of windows) {
      const issues = [];

      if (!window.situation_text) issues.push('缺少 situation_text');
      if (window.health === null) issues.push('缺少 health');
      if (window.armor === null) issues.push('缺少 armor');
      if (!window.weapon) issues.push('缺少 weapon');
      if (window.is_moving === null) issues.push('缺少 is_moving');

      if (issues.length > 0) {
        metadataIssues.push(`窗口 ${window.window_idx}: ${issues.join(', ')}`);
      }
    }

    if (metadataIssues.length > 0) {
      console.log(`⚠️  发现 ${metadataIssues.length} 个元数据问题:`);
      metadataIssues.slice(0, 10).forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log(`✅ 所有窗口的元数据完整\n`);
    }

    // 6. 统计游戏事件
    console.log('🎮 [6/8] 统计游戏事件...');
    let eventCounts = {};
    let totalEvents = 0;

    for (const window of windows) {
      if (window.events_json) {
        const events = JSON.parse(window.events_json);
        totalEvents += events.length;

        events.forEach(event => {
          eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
        });
      }
    }

    console.log(`✅ 共记录 ${totalEvents} 个游戏事件:`);
    Object.entries(eventCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log();

    // 7. 检查时间窗口对齐
    console.log('⏱️  [7/8] 检查时间窗口对齐...');
    let timeIssues = [];
    const EXPECTED_WINDOW_MS = 400;  // 每个窗口应该是 400ms
    const TICK_RATE = 64;  // CS2 的 tick rate
    const EXPECTED_TICKS = Math.round((EXPECTED_WINDOW_MS / 1000) * TICK_RATE);  // 400ms ≈ 25.6 ticks

    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      const tickDuration = window.end_tick - window.start_tick;

      // 计算实际的窗口持续时间（毫秒）
      const actualDurationMs = (tickDuration / TICK_RATE) * 1000;

      // 检查 tick 范围是否合理（允许一些误差）
      if (Math.abs(tickDuration - EXPECTED_TICKS) > 5) {
        timeIssues.push(
          `窗口 ${window.window_idx}: tick 长度异常 (${tickDuration} ticks, 期望约 ${EXPECTED_TICKS})`
        );
      }

      // 检查时间长度是否正确（基于 tick 计算）
      if (Math.abs(actualDurationMs - EXPECTED_WINDOW_MS) > 50) {
        timeIssues.push(
          `窗口 ${window.window_idx}: 时间长度异常 (${actualDurationMs.toFixed(1)}ms, 期望 ${EXPECTED_WINDOW_MS}ms)`
        );
      }

      // 检查相邻窗口是否连续（不重叠也不间隙）
      if (i > 0) {
        const prevWindow = windows[i - 1];
        const gap = window.start_tick - prevWindow.end_tick;

        if (gap < 0) {
          timeIssues.push(
            `窗口 ${window.window_idx}: 与前一个窗口重叠 ${Math.abs(gap)} ticks`
          );
        } else if (gap > 5) {  // 允许小间隙
          timeIssues.push(
            `窗口 ${window.window_idx}: 与前一个窗口间隙 ${gap} ticks`
          );
        }
      }
    }

    if (timeIssues.length > 0) {
      console.log(`⚠️  发现 ${timeIssues.length} 个时间对齐问题:`);
      timeIssues.slice(0, 10).forEach(issue => console.log(`   ${issue}`));
      if (timeIssues.length > 10) {
        console.log(`   ... 还有 ${timeIssues.length - 10} 个问题`);
      }
    } else {
      console.log(`✅ 所有窗口时间对齐正确`);
      console.log(`   窗口持续时间: ${((windows[0].end_tick - windows[0].start_tick) / TICK_RATE * 1000).toFixed(1)}ms`);
      console.log(`   总时间跨度: ${((windows[windows.length-1].end_tick - windows[0].start_tick) / TICK_RATE).toFixed(1)} 秒`);
    }
    console.log();

    // 8. 检查事件时间戳是否在窗口范围内
    console.log('🎯 [8/8] 检查事件时间戳对齐...');
    let eventTimeIssues = [];

    for (const window of windows) {
      if (window.events_json) {
        const events = JSON.parse(window.events_json);

        events.forEach((event, idx) => {
          // 检查事件的 tick 是否在窗口范围内
          if (event.tick < window.start_tick || event.tick > window.end_tick) {
            eventTimeIssues.push(
              `窗口 ${window.window_idx} 事件 ${idx} (${event.type}): tick ${event.tick} 不在范围 [${window.start_tick}, ${window.end_tick}]`
            );
          }
        });
      }
    }

    if (eventTimeIssues.length > 0) {
      console.log(`❌ 发现 ${eventTimeIssues.length} 个事件时间戳问题:`);
      eventTimeIssues.slice(0, 10).forEach(issue => console.log(`   ${issue}`));
      if (eventTimeIssues.length > 10) {
        console.log(`   ... 还有 ${eventTimeIssues.length - 10} 个问题`);
      }
    } else {
      console.log(`✅ 所有事件时间戳都在窗口范围内`);
    }
    console.log();

    // 9. 最终总结
    console.log('=' .repeat(60));
    console.log('📊 验证总结\n');
    console.log(`✅ 时间窗口: ${windows.length} 个`);
    console.log(`✅ 图片文件: ${totalFrames} 个 (${totalSizeMB} MB)`);
    console.log(`${missingFiles.length > 0 ? '❌' : '✅'} 缺失文件: ${missingFiles.length} 个`);
    console.log(`${corruptedFiles.length > 0 ? '⚠️' : '✅'} 可疑文件: ${corruptedFiles.length} 个`);
    console.log(`${metadataIssues.length > 0 ? '⚠️' : '✅'} 元数据问题: ${metadataIssues.length} 个`);
    console.log(`✅ 游戏事件: ${totalEvents} 个`);
    console.log(`${timeIssues.length > 0 ? '⚠️' : '✅'} 时间对齐问题: ${timeIssues.length} 个`);
    console.log(`${eventTimeIssues.length > 0 ? '❌' : '✅'} 事件时间戳问题: ${eventTimeIssues.length} 个`);
    console.log('=' .repeat(60));

    if (missingFiles.length === 0 && corruptedFiles.length === 0 &&
        metadataIssues.length === 0 && timeIssues.length === 0 &&
        eventTimeIssues.length === 0) {
      console.log('\n🎉 数据验证通过！所有数据完整且正确。');
    } else {
      console.log('\n⚠️  数据存在一些问题，请检查上述错误。');
    }

  } catch (error) {
    console.error('❌ 验证过程出错:', error);
  } finally {
    await client.end();
  }
}

// 命令行参数
const checksum = process.argv[2];
const playerSteamId = process.argv[3];
const roundNumber = parseInt(process.argv[4]);

if (!checksum || !playerSteamId || !roundNumber) {
  console.log('用法: node validate-training-data.mjs <checksum> <player_steam_id> <round_number>');
  console.log('');
  console.log('示例:');
  console.log('  node validate-training-data.mjs c6c0a055158ff5fe 76561199138765870 1');
  console.log('');
  console.log('提示: 使用 "node out/cli.js query-training --limit 1" 查看 checksum');
  process.exit(1);
}

validateTrainingData(checksum, playerSteamId, roundNumber);
