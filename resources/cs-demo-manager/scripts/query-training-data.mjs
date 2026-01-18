import Database from 'better-sqlite3';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.homedir(), '.cs-demo-manager', 'database.db');
const db = new Database(dbPath);

// 查询总记录数
const countResult = db.prepare('SELECT COUNT(*) as count FROM training_windows').get();
console.log('总窗口数:', countResult.count);

// 查询统计信息
const stats = db.prepare(`
  SELECT
    COUNT(DISTINCT player_steam_id) as players,
    COUNT(DISTINCT round_number) as rounds,
    MIN(window_idx) as min_window,
    MAX(window_idx) as max_window
  FROM training_windows
`).get();

console.log('\n统计信息:');
console.log('- 玩家数:', stats.players);
console.log('- 回合数:', stats.rounds);
console.log('- 窗口范围:', stats.min_window, '-', stats.max_window);

// 查询前3条记录
const records = db.prepare(`
  SELECT
    window_idx,
    round_number,
    player_name,
    start_tick,
    end_tick,
    time_ms,
    start_frame_path,
    middle_frame_paths,
    end_frame_path,
    situation_text,
    events_zh
  FROM training_windows
  ORDER BY window_idx
  LIMIT 3
`).all();

console.log('\n前3条记录:');
records.forEach((r, i) => {
  console.log(`\n[窗口 ${r.window_idx}] 回合${r.round_number} - ${r.player_name}`);
  console.log('  Tick:', r.start_tick, '-', r.end_tick, '(时间:', r.time_ms, 'ms)');
  console.log('  起始帧:', r.start_frame_path);
  const middleFrames = JSON.parse(r.middle_frame_paths);
  console.log('  中间帧:', middleFrames.length, '个');
  console.log('  结束帧:', r.end_frame_path);
  console.log('  Situation:', r.situation_text);
  console.log('  事件:', r.events_zh || '无');
});

db.close();
