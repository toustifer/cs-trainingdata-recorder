#!/usr/bin/env node

/**
 * 批量训练数据生成 - 输出到F盘
 *
 * 用法：
 *   node batch-to-f-disk.mjs "demo.dem" --batch-size 30
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const OUTPUT_PATH = 'F:\\cs_data\\traindata';

const args = process.argv.slice(2);
const demoPath = args[0];

if (!demoPath) {
  console.error('用法: node batch-to-f-disk.mjs <demo路径> [--batch-size <N>]');
  process.exit(1);
}

let batchSize = 30;
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--batch-size' && i + 1 < args.length) {
    batchSize = parseInt(args[i + 1]);
    i++;
  }
}

console.log('');
console.log('='.repeat(80));
console.log('批量训练数据生成 - 输出到F盘');
console.log('='.repeat(80));
console.log(`Demo: ${demoPath}`);
console.log(`输出路径: ${OUTPUT_PATH}`);
console.log(`批量大小: ${batchSize}`);
console.log('');

// 调用原始脚本，传递 --output 参数
const command = `node scripts/smart-batch-pipeline.mjs "${demoPath}" --batch-size ${batchSize} --output "${OUTPUT_PATH}"`;

console.log(`执行命令: ${command}`);
console.log('');

try {
  const { stdout, stderr } = await execAsync(command, {
    cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
} catch (error) {
  console.error('执行失败:', error.message);
  process.exit(1);
}
