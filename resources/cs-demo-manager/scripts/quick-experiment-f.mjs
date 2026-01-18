#!/usr/bin/env node
/**
 * 快速实验：录制训练数据到F盘
 * 录制回合5（114秒，最长回合之一）
 */

import { spawn } from 'child_process';
import fs from 'fs';

console.log('🎯 CS2 训练数据实验 - 输出到F盘\n');
console.log('='.repeat(80));

const config = {
  demoPath: 'D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem',
  playerSteamId: '76561199138765870',
  roundNumber: 5,  // 最长回合之一（114秒）
  outputBase: 'F:/cs_training_data/experiment_1'
};

console.log('配置:');
console.log(`  Demo: ${config.demoPath}`);
console.log(`  玩家: ${config.playerSteamId}`);
console.log(`  回合: ${config.roundNumber} (预计114秒，~200MB数据)`);
console.log(`  输出: ${config.outputBase}`);
console.log('='.repeat(80));
console.log();

// 创建输出目录
if (!fs.existsSync(config.outputBase)) {
  fs.mkdirSync(config.outputBase, { recursive: true });
  console.log(`✅ 创建输出目录: ${config.outputBase}\n`);
}

// 运行完整流程
console.log('开始执行...\n');

const process = spawn('node', [
  'scripts/complete-training-pipeline.mjs',
  config.demoPath,
  config.playerSteamId,
  config.roundNumber.toString()
], {
  cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
  stdio: 'inherit',
  shell: true
});

process.on('close', (code) => {
  if (code === 0) {
    console.log('\n' + '='.repeat(80));
    console.log('✅ 实验完成！');
    console.log('='.repeat(80));
    console.log('\n接下来的步骤:');
    console.log('1. 数据已保存到 D 盘（默认位置）');
    console.log('2. 执行以下命令移动到 F 盘:');
    console.log(`   robocopy "D:\\myprogram\\cs_learning\\dataset\\1\\training_data" "${config.outputBase}" /E /MOVE`);
  } else {
    console.error(`\n❌ 执行失败，退出码: ${code}`);
  }
});

process.on('error', (err) => {
  console.error(`\n❌ 错误: ${err.message}`);
});
