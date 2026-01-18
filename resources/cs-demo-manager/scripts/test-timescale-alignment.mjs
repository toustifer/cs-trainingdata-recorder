#!/usr/bin/env node

/**
 * 测试不同 demo_timescale 下的时间戳对齐
 * 用法: node test-timescale-alignment.mjs <demo_path> <player_steam_id> <round_number> <timescale>
 */

import pkg from 'pg';
const { Client } = pkg;
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';

const execAsync = promisify(exec);

const args = process.argv.slice(2);
const [demoPath, playerSteamId, roundNumber, timescale] = args;

if (!demoPath || !playerSteamId || !roundNumber || !timescale) {
  console.error('用法: node test-timescale-alignment.mjs <demo_path> <player_steam_id> <round_number> <timescale>');
  console.error('示例: node test-timescale-alignment.mjs "demo.dem" 76561199138765870 1 4');
  process.exit(1);
}

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

console.log('='.repeat(80));
console.log(`测试 demo_timescale = ${timescale}`);
console.log('='.repeat(80));
console.log(`Demo: ${demoPath}`);
console.log(`玩家: ${playerSteamId}`);
console.log(`回合: ${roundNumber}`);
console.log('');

// 1. 导出元数据
console.log('[1/4] 导出训练数据元数据...');
const exportCmd = `node out/cli.js training-data "${demoPath}" --players ${playerSteamId} --rounds ${roundNumber}`;
console.log(`执行: ${exportCmd}`);

try {
  const { stdout } = await execAsync(exportCmd, { cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager' });
  console.log(stdout);
} catch (error) {
  console.error('导出失败:', error.message);
  process.exit(1);
}

// 2. 获取 checksum
console.log('\n[2/4] 查询 checksum...');
const client = new Client(DB_CONFIG);
await client.connect();

const checksumQuery = `
  SELECT DISTINCT match_checksum
  FROM training_windows
  WHERE player_steam_id = $1 AND round_number = $2
  ORDER BY match_checksum DESC
  LIMIT 1
`;
const checksumResult = await client.query(checksumQuery, [playerSteamId, roundNumber]);

if (checksumResult.rows.length === 0) {
  console.error('未找到训练数据，请先运行导出命令');
  await client.end();
  process.exit(1);
}

const checksum = checksumResult.rows[0].match_checksum;
console.log(`✓ Checksum: ${checksum}`);

// 3. 记录开始时间
const startTime = Date.now();

// 4. 录制帧（使用指定的 timescale）
console.log(`\n[3/4] 录制帧 (timescale=${timescale})...`);

// 临时修改 cli-generate-frames.mjs 中的 timescale
const scriptPath = 'D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/cli-generate-frames.mjs';
const scriptContent = await fs.readFile(scriptPath, 'utf-8');
const originalContent = scriptContent;

// 替换 timescale 值
const modifiedContent = scriptContent.replace(
  /demo_timescale \d+/,
  `demo_timescale ${timescale}`
);

await fs.writeFile(scriptPath, modifiedContent, 'utf-8');

try {
  const recordCmd = `node scripts/cli-generate-frames.mjs --checksum ${checksum} --player ${playerSteamId} --round ${roundNumber} --demo "${demoPath}"`;
  console.log(`执行: ${recordCmd}`);

  const { stdout } = await execAsync(recordCmd, {
    cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
    timeout: 600000 // 10分钟超时
  });
  console.log(stdout);
} catch (error) {
  console.error('录制失败:', error.message);
} finally {
  // 恢复原始内容
  await fs.writeFile(scriptPath, originalContent, 'utf-8');
}

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(1);

// 5. 验证时间戳对齐
console.log(`\n[4/4] 验证时间戳对齐...`);

const validationQuery = `
WITH event_windows AS (
  SELECT
    window_idx,
    start_tick,
    end_tick,
    events_json,
    jsonb_array_length(events_json::jsonb) as event_count
  FROM training_windows
  WHERE match_checksum = $1
    AND player_steam_id = $2
    AND round_number = $3
    AND jsonb_array_length(events_json::jsonb) > 0
)
SELECT
  COUNT(*) as total_windows_with_events,
  COUNT(*) FILTER (
    WHERE (events_json::jsonb->0->>'tick')::int BETWEEN start_tick AND end_tick
  ) as aligned_events
FROM event_windows;
`;

const validationResult = await client.query(validationQuery, [checksum, playerSteamId, roundNumber]);
const { total_windows_with_events, aligned_events } = validationResult.rows[0];

await client.end();

// 结果
console.log('\n' + '='.repeat(80));
console.log('测试结果');
console.log('='.repeat(80));
console.log(`Timescale: ${timescale}x`);
console.log(`录制耗时: ${duration} 秒`);
console.log(`有事件的窗口数: ${total_windows_with_events}`);
console.log(`时间戳对齐的窗口数: ${aligned_events}`);
console.log(`对齐率: ${total_windows_with_events > 0 ? ((aligned_events / total_windows_with_events) * 100).toFixed(1) : 0}%`);

if (aligned_events === total_windows_with_events) {
  console.log('\n✅ 时间戳完全对齐！');
} else {
  console.log('\n❌ 存在时间戳不对齐问题！');
}

console.log('='.repeat(80));
