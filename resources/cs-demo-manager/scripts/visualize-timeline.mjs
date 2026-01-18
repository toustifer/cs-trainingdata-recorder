#!/usr/bin/env node
import pkg from 'pg';
const { Client } = pkg;

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

async function visualizeTimeline(checksum, playerSteamId, roundNumber, windowCount = 20) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('📊 时间轴可视化\n');
  console.log('=' .repeat(80));

  try {
    const query = `
      SELECT
        window_idx,
        start_tick,
        end_tick,
        situation_text,
        events_json
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      ORDER BY window_idx
      LIMIT $4
    `;

    const result = await client.query(query, [checksum, playerSteamId, roundNumber, windowCount]);
    const windows = result.rows;

    if (windows.length === 0) {
      console.log('❌ 未找到任何数据');
      return;
    }

    const TICK_RATE = 64;
    const firstTick = windows[0].start_tick;

    for (const window of windows) {
      const events = JSON.parse(window.events_json);
      const startTime = ((window.start_tick - firstTick) / TICK_RATE).toFixed(2);
      const endTime = ((window.end_tick - firstTick) / TICK_RATE).toFixed(2);
      const duration = ((window.end_tick - window.start_tick) / TICK_RATE * 1000).toFixed(0);

      // 提取简化的状态信息
      const situationMatch = window.situation_text.match(/HP:(\d+).*武器:([^\s|]+)/);
      const hp = situationMatch ? situationMatch[1] : '?';
      const weapon = situationMatch ? situationMatch[2] : '?';

      // 创建时间轴可视化
      const barLength = 40;
      const bar = '█'.repeat(barLength);

      console.log(`\n窗口 ${window.window_idx.toString().padStart(2, '0')}: ${startTime}s - ${endTime}s (${duration}ms)`);
      console.log(`  状态: HP ${hp.padStart(3)} | ${weapon.padEnd(15)} | Tick ${window.start_tick}-${window.end_tick}`);
      console.log(`  ├─${bar}─┤`);

      if (events.length > 0) {
        events.forEach(event => {
          // 计算事件在窗口中的相对位置
          const relativePos = (event.tick - window.start_tick) / (window.end_tick - window.start_tick);
          const posInBar = Math.floor(relativePos * barLength);
          const spacer = '  │ ' + ' '.repeat(posInBar);

          // 事件类型图标
          const icons = {
            'kill': '💀',
            'death': '☠️',
            'damage_dealt': '⚔️',
            'damage_taken': '🩹',
            'shot': '🔫',
            'flash': '💥',
            'plant': '💣',
            'defuse': '🔧'
          };
          const icon = icons[event.type] || '•';

          // 格式化事件详情
          let details = `${icon} ${event.type}`;
          if (event.type === 'damage_dealt' || event.type === 'damage_taken') {
            details += ` (${event.damage || '?'}HP)`;
          }

          console.log(`${spacer}▼ ${details}`);
        });
      } else {
        console.log(`  │ (无事件)`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n图例: 🔫 射击 | ⚔️  造成伤害 | 🩹 受到伤害 | 💀 击杀 | ☠️  死亡`);
    console.log(`总共显示 ${windows.length} 个时间窗口`);
    console.log(`总时长: ${((windows[windows.length-1].end_tick - windows[0].start_tick) / TICK_RATE).toFixed(1)} 秒`);

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await client.end();
  }
}

// 命令行参数
const checksum = process.argv[2];
const playerSteamId = process.argv[3];
const roundNumber = parseInt(process.argv[4]);
const windowCount = parseInt(process.argv[5]) || 20;

if (!checksum || !playerSteamId || !roundNumber) {
  console.log('用法: node visualize-timeline.mjs <checksum> <player_steam_id> <round_number> [window_count]');
  console.log('');
  console.log('示例:');
  console.log('  node visualize-timeline.mjs c6c0a055158ff5fe 76561199138765870 1 20');
  process.exit(1);
}

visualizeTimeline(checksum, playerSteamId, roundNumber, windowCount);
