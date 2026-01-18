#!/usr/bin/env node

/**
 * 完整的训练数据流水线
 * 1. 导出训练数据到数据库
 * 2. 录制视频帧图片
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '../out/cli.js');

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> Running: ${command} ${args.join(' ')}\n`);

    const child = spawn('node', [cliPath, command, ...args], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help')) {
    console.log('完整的训练数据流水线');
    console.log('');
    console.log('用法: node full-training-pipeline.mjs <demo路径> [选项]');
    console.log('');
    console.log('选项:');
    console.log('  --players <ids>     逗号分隔的 Steam ID');
    console.log('  --rounds <numbers>  逗号分隔的回合号');
    console.log('  --skip-export       跳过训练数据导出（如果已导出）');
    console.log('  --skip-recording    跳过视频录制');
    console.log('');
    console.log('示例:');
    console.log('');
    console.log('  # 完整流程：导出 + 录制');
    console.log('  node full-training-pipeline.mjs demo.dem --players 76561198000000001 --rounds 1');
    console.log('');
    console.log('  # 只导出训练数据');
    console.log('  node full-training-pipeline.mjs demo.dem --skip-recording');
    console.log('');
    console.log('  # 只录制视频（需先导出）');
    console.log('  node full-training-pipeline.mjs demo.dem --skip-export');
    process.exit(0);
  }

  const demoPath = args[0];
  const skipExport = args.includes('--skip-export');
  const skipRecording = args.includes('--skip-recording');

  // 提取选项
  const trainingDataArgs = [demoPath];
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--players' || arg === '--rounds') {
      trainingDataArgs.push(arg, args[i + 1]);
      i++;
    }
  }

  let checksum = null;

  try {
    // 步骤1：导出训练数据
    if (!skipExport) {
      console.log('='.repeat(60));
      console.log('步骤 1/2: 导出训练数据到数据库');
      console.log('='.repeat(60));

      await runCommand('training-data', trainingDataArgs);

      console.log('\n✓ 训练数据导出完成\n');
    }

    // 获取 checksum（从数据库或文件）
    console.log('获取 demo checksum...');
    const { getDemoChecksumFromDemoPath } = await import('./src/node/demo/get-demo-checksum-from-demo-path.js');
    checksum = await getDemoChecksumFromDemoPath(demoPath);
    console.log(`Checksum: ${checksum}\n`);

    // 步骤2：录制视频帧
    if (!skipRecording) {
      console.log('='.repeat(60));
      console.log('步骤 2/2: 录制视频帧图片');
      console.log('='.repeat(60));

      const generateFramesArgs = ['--checksum', checksum];
      for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--players' || arg === '--rounds') {
          generateFramesArgs.push(arg, args[i + 1]);
          i++;
        }
      }

      await runCommand('generate-frames', generateFramesArgs);

      console.log('\n✓ 视频帧录制完成\n');
    }

    console.log('='.repeat(60));
    console.log('✓ 完整流水线执行成功！');
    console.log('='.repeat(60));
    console.log('');
    console.log('你现在可以：');
    console.log(`  1. 查询训练数据: node out/cli.js query-training`);
    console.log(`  2. 查看图片帧: 在输出目录中`);

  } catch (error) {
    console.error('\n✗ 流水线执行失败:', error.message);
    process.exit(1);
  }
}

main();
