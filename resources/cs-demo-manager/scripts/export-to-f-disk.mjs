#!/usr/bin/env node
/**
 * 训练数据导出到F盘 - 实验版本
 * 自动将训练数据输出到 F:/cs_training_data/
 */

import { parseArgs } from 'node:util';
import { exportTrainingDataCommand } from '../out/cli/commands/training-data-command.js';

const { values } = parseArgs({
  options: {
    demo: { type: 'string' },
    player: { type: 'string' },
    round: { type: 'string' },
  },
});

const demoPath = values.demo;
const playerSteamId = values.player;
const roundNumber = parseInt(values.round, 10);

if (!demoPath || !playerSteamId || !roundNumber) {
  console.log('用法: node export-to-f-disk.mjs --demo <path> --player <steam_id> --round <number>');
  console.log('');
  console.log('示例:');
  console.log('  node export-to-f-disk.mjs --demo "D:/demo.dem" --player 76561199138765870 --round 5');
  process.exit(1);
}

// 设置输出目录到F盘
const outputBase = 'F:/cs_training_data';

console.log('🚀 开始导出训练数据到F盘...\n');
console.log(`Demo: ${demoPath}`);
console.log(`玩家: ${playerSteamId}`);
console.log(`回合: ${roundNumber}`);
console.log(`输出目录: ${outputBase}\n`);

try {
  await exportTrainingDataCommand(demoPath, playerSteamId, roundNumber, outputBase);
  console.log('\n✅ 数据已导出到F盘！');
} catch (error) {
  console.error('\n❌ 导出失败:', error.message);
  process.exit(1);
}
