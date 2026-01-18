#!/usr/bin/env node

/**
 * 批量分析脚本（生成训练窗口数据）
 *
 * 功能：
 * 1. 批量分析 demo 文件
 * 2. 生成训练窗口数据到数据库
 * 3. 后续可以在 exe 中手动录制
 *
 * 用法：
 *   node batch-analyze-harvest.mjs <demo目录> [选项]
 *
 * 选项：
 *   --player <steam_id>  指定玩家Steam ID（可选，默认：所有玩家）
 *   --rounds <1,2,3>     指定回合（可选，默认：所有回合）
 *   --window <ms>        时间窗口（默认：400ms）
 *   --frames <n>         每窗口帧数（默认：10）
 *   --force              强制重新分析
 */

import { spawn } from 'node:child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析参数
const args = process.argv.slice(2);
let demoDir, playerSteamId, rounds, windowMs, framesPerWindow, force;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--player') playerSteamId = args[++i];
  else if (args[i] === '--rounds') rounds = args[++i];
  else if (args[i] === '--window') windowMs = args[++i];
  else if (args[i] === '--frames') framesPerWindow = args[++i];
  else if (args[i] === '--force') force = true;
  else if (!demoDir) demoDir = args[i];
}

if (!demoDir) {
  console.log('批量分析脚本（生成训练窗口数据）');
  console.log('');
  console.log('用法: node batch-analyze-harvest.mjs <demo目录> [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --player <steam_id>  指定玩家Steam ID（可选，默认：所有玩家）');
  console.log('  --rounds <1,2,3>     指定回合（可选，默认：所有回合）');
  console.log('  --window <ms>        时间窗口（默认：400ms）');
  console.log('  --frames <n>         每窗口帧数（默认：10）');
  console.log('  --force              强制重新分析');
  console.log('');
  console.log('示例:');
  console.log('  # 分析所有玩家');
  console.log('  node batch-analyze-harvest.mjs F:/cs/csdata/cs_raw_data/cs/demoall');
  console.log('');
  console.log('  # 分析指定玩家');
  console.log('  node batch-analyze-harvest.mjs F:/cs/csdata/cs_raw_data/cs/demoall --player 76561198838314646');
  console.log('');
  console.log('  # 分析指定玩家的指定回合');
  console.log('  node batch-analyze-harvest.mjs F:/cs/csdata/cs_raw_data/cs/demoall --player 76561198838314646 --rounds 1,2,3');
  console.log('');
  console.log('  # 强制重新分析');
  console.log('  node batch-analyze-harvest.mjs F:/cs/csdata/cs_raw_data/cs/demoall --force');
  process.exit(1);
}

// 运行命令
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> 运行: ${command} ${args.join(' ')}\n`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.warn(`命令退出码: ${code}`);
        resolve(); // 继续处理下一个文件
      }
    });

    child.on('error', (err) => {
      console.error(`命令错误: ${err.message}`);
      resolve(); // 继续处理下一个文件
    });
  });
}

async function main() {
  console.log('='.repeat(80));
  console.log('批量分析脚本（生成训练窗口数据）');
  console.log('='.repeat(80));
  console.log(`Demo 目录: ${demoDir}`);
  if (playerSteamId) console.log(`玩家 Steam ID: ${playerSteamId}`);
  if (rounds) console.log(`指定回合: ${rounds}`);
  console.log('');

  // 查找所有 .dem 文件
  const demoFiles = await glob('**/*.dem', {
    cwd: demoDir,
    absolute: true,
  });

  console.log(`>>> 扫描到 ${demoFiles.length} 个文件，开始分析...\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < demoFiles.length; i++) {
    const demoPath = demoFiles[i];
    const demoName = path.basename(demoPath);

    console.log(`\n[${i + 1}/${demoFiles.length}] 分析: ${demoName}`);

    try {
      // 构建 training-data 命令参数
      const trainingDataArgs = [
        'training-data',
        `"${demoPath}"`,
      ];

      if (playerSteamId) {
        trainingDataArgs.push('--players', playerSteamId);
      }

      if (rounds) {
        trainingDataArgs.push('--rounds', rounds);
      }

      if (windowMs) {
        trainingDataArgs.push('--window', windowMs);
      }

      if (framesPerWindow) {
        trainingDataArgs.push('--frames', framesPerWindow);
      }

      if (force) {
        trainingDataArgs.push('--force');
      }

      await runCommand('node', [
        path.join(__dirname, '../out/cli.js'),
        ...trainingDataArgs,
      ]);

      success++;
    } catch (error) {
      console.error(`  处理失败: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('>>> 任务结束。');
  console.log(`✓ 成功: ${success}`);
  if (failed > 0) console.log(`✗ 失败: ${failed}`);
  if (skipped > 0) console.log(`⊙ 跳过: ${skipped}`);
  console.log('='.repeat(80));
  console.log('');
  console.log('提示: 现在可以在 exe 中手动录制视频了');
}

main().catch((error) => {
  console.error('致命错误:', error);
  process.exit(1);
});
