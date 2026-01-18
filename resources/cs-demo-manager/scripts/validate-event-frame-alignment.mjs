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

async function validateEventFrameAlignment(checksum, playerSteamId, roundNumber) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('🎯 验证事件与图片帧对齐\n');
  console.log('=' .repeat(80));

  try {
    const query = `
      SELECT
        window_idx,
        start_tick,
        end_tick,
        start_frame_path,
        middle_frame_paths,
        end_frame_path,
        events_json,
        situation_text
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      ORDER BY window_idx
    `;

    const result = await client.query(query, [checksum, playerSteamId, roundNumber]);
    const windows = result.rows;

    if (windows.length === 0) {
      console.log('❌ 未找到任何数据');
      return;
    }

    console.log(`📊 总共 ${windows.length} 个时间窗口\n`);

    const FRAMES_PER_WINDOW = 10;
    const TICK_RATE = 64;
    let alignmentIssues = [];
    let eventWithFrames = [];

    for (const window of windows) {
      const events = JSON.parse(window.events_json);

      if (events.length === 0) continue;

      // 构建帧列表（包含路径和对应的tick）
      const middlePaths = window.middle_frame_paths ? JSON.parse(window.middle_frame_paths) : [];
      const allFramePaths = [
        window.start_frame_path,
        ...middlePaths,
        window.end_frame_path
      ];

      // 计算每帧对应的 tick
      const ticksPerFrame = (window.end_tick - window.start_tick) / (FRAMES_PER_WINDOW - 1);
      const frameTicks = [];
      for (let i = 0; i < FRAMES_PER_WINDOW; i++) {
        const frameTick = Math.round(window.start_tick + i * ticksPerFrame);
        frameTicks.push(frameTick);
      }

      // 检查每个事件对应到哪一帧
      for (const event of events) {
        // 找到最接近的帧
        let closestFrameIdx = 0;
        let minTickDiff = Math.abs(frameTicks[0] - event.tick);

        for (let i = 1; i < frameTicks.length; i++) {
          const diff = Math.abs(frameTicks[i] - event.tick);
          if (diff < minTickDiff) {
            minTickDiff = diff;
            closestFrameIdx = i;
          }
        }

        const closestFrameTick = frameTicks[closestFrameIdx];
        const framePath = allFramePaths[closestFrameIdx];
        const frameExists = fs.existsSync(framePath);

        // 计算时间差（毫秒）
        const timeDiffMs = (Math.abs(event.tick - closestFrameTick) / TICK_RATE * 1000).toFixed(1);

        eventWithFrames.push({
          windowIdx: window.window_idx,
          event,
          frameIdx: closestFrameIdx,
          framePath,
          frameExists,
          eventTick: event.tick,
          frameTick: closestFrameTick,
          tickDiff: event.tick - closestFrameTick,
          timeDiffMs: parseFloat(timeDiffMs),
          windowStartTick: window.start_tick,
          windowEndTick: window.end_tick
        });

        // 检查对齐问题
        if (!frameExists) {
          alignmentIssues.push(
            `窗口 ${window.window_idx} 事件 ${event.type}: 对应帧文件不存在 ${framePath}`
          );
        }

        // 如果时间差超过一帧的时间（约40ms @ 25fps），可能有问题
        if (parseFloat(timeDiffMs) > 40) {
          alignmentIssues.push(
            `窗口 ${window.window_idx} 事件 ${event.type}: 与最近帧时间差过大 (${timeDiffMs}ms)`
          );
        }
      }
    }

    // 显示所有事件与帧的对应关系
    console.log('📋 事件与图片帧对应关系:\n');

    if (eventWithFrames.length === 0) {
      console.log('  ℹ️  没有找到任何事件');
    } else {
      for (const item of eventWithFrames) {
        const eventIcon = {
          'kill': '💀',
          'death': '☠️',
          'damage_dealt': '⚔️',
          'damage_taken': '🩹',
          'shot': '🔫',
          'flash': '💥',
          'plant': '💣',
          'defuse': '🔧'
        }[item.event.type] || '•';

        const alignmentStatus = item.frameExists ? '✅' : '❌';
        const frameName = path.basename(item.framePath);

        console.log(`${alignmentStatus} 窗口 ${item.windowIdx.toString().padStart(2, '0')} | ${eventIcon} ${item.event.type.padEnd(14)}`);
        console.log(`   事件 Tick: ${item.eventTick} | 对应帧: ${frameName} (第${item.frameIdx + 1}/10帧)`);
        console.log(`   帧 Tick:   ${item.frameTick} | 时间差: ${item.timeDiffMs}ms`);

        if (item.tickDiff !== 0) {
          const direction = item.tickDiff > 0 ? '事件晚于帧' : '事件早于帧';
          console.log(`   偏移: ${Math.abs(item.tickDiff)} ticks (${direction})`);
        }

        console.log();
      }
    }

    // 统计信息
    console.log('=' .repeat(80));
    console.log('📊 对齐统计:\n');

    const maxTimeDiff = Math.max(...eventWithFrames.map(e => e.timeDiffMs), 0);
    const avgTimeDiff = eventWithFrames.length > 0
      ? (eventWithFrames.reduce((sum, e) => sum + e.timeDiffMs, 0) / eventWithFrames.length).toFixed(1)
      : 0;

    console.log(`✅ 事件总数: ${eventWithFrames.length}`);
    console.log(`✅ 平均时间差: ${avgTimeDiff}ms`);
    console.log(`✅ 最大时间差: ${maxTimeDiff.toFixed(1)}ms`);

    // 时间差分布
    const timeDiffRanges = {
      '0-10ms': 0,
      '10-20ms': 0,
      '20-40ms': 0,
      '>40ms': 0
    };

    eventWithFrames.forEach(e => {
      if (e.timeDiffMs <= 10) timeDiffRanges['0-10ms']++;
      else if (e.timeDiffMs <= 20) timeDiffRanges['10-20ms']++;
      else if (e.timeDiffMs <= 40) timeDiffRanges['20-40ms']++;
      else timeDiffRanges['>40ms']++;
    });

    console.log('\n时间差分布:');
    Object.entries(timeDiffRanges).forEach(([range, count]) => {
      const percentage = eventWithFrames.length > 0
        ? ((count / eventWithFrames.length) * 100).toFixed(1)
        : 0;
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`  ${range.padEnd(10)}: ${count.toString().padStart(2)} (${percentage}%) ${bar}`);
    });

    // 帧分布统计
    console.log('\n事件在窗口中的帧位置分布:');
    const frameDistribution = new Array(FRAMES_PER_WINDOW).fill(0);
    eventWithFrames.forEach(e => frameDistribution[e.frameIdx]++);

    frameDistribution.forEach((count, idx) => {
      const bar = '█'.repeat(count);
      console.log(`  第 ${(idx + 1).toString().padStart(2)} 帧: ${count.toString().padStart(2)} 个事件 ${bar}`);
    });

    // 最终判定
    console.log('\n' + '=' .repeat(80));

    if (alignmentIssues.length > 0) {
      console.log('⚠️  发现对齐问题:\n');
      alignmentIssues.forEach(issue => console.log(`  ${issue}`));
    } else {
      console.log('🎉 所有事件与图片帧对齐正确！');
      console.log(`   • ${eventWithFrames.length} 个事件都有对应的图片帧`);
      console.log(`   • 平均时间差仅 ${avgTimeDiff}ms (少于1帧)`);
      console.log(`   • 所有帧文件都存在`);
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
  console.log('用法: node validate-event-frame-alignment.mjs <checksum> <player_steam_id> <round_number>');
  console.log('');
  console.log('示例:');
  console.log('  node validate-event-frame-alignment.mjs c6c0a055158ff5fe 76561199138765870 1');
  process.exit(1);
}

validateEventFrameAlignment(checksum, playerSteamId, roundNumber);
