#!/usr/bin/env node
/**
 * 完整训练数据流程 - 输出到F盘
 * 包括：元数据导出 + 帧录制 + 数据验证
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// 配置
const OUTPUT_BASE = 'F:/cs_training_data/demo_1';
const DEMO_PATH = process.argv[2];
const PLAYER_STEAM_ID = process.argv[3];
const ROUND_NUMBER = parseInt(process.argv[4]);

if (!DEMO_PATH || !PLAYER_STEAM_ID || !ROUND_NUMBER) {
  console.log('用法: node run-experiment-to-f.mjs <demo_path> <player_steam_id> <round_number>');
  console.log('');
  console.log('示例:');
  console.log('  node run-experiment-to-f.mjs "D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem" 76561199138765870 5');
  process.exit(1);
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_BASE)) {
  fs.mkdirSync(OUTPUT_BASE, { recursive: true });
}

console.log('🚀 开始完整训练数据录制流程（输出到F盘）\n');
console.log('='.repeat(80));
console.log('配置信息:');
console.log(`  Demo: ${DEMO_PATH}`);
console.log(`  玩家: ${PLAYER_STEAM_ID}`);
console.log(`  回合: ${ROUND_NUMBER}`);
console.log(`  输出: ${OUTPUT_BASE}`);
console.log('='.repeat(80));
console.log();

// 运行命令的辅助函数
function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📌 ${description}...`);
    console.log(`   命令: ${command} ${args.join(' ')}\n`);

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${description} - 完成\n`);
        resolve();
      } else {
        reject(new Error(`${description} 失败，退出码: ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`${description} 错误: ${err.message}`));
    });
  });
}

async function main() {
  try {
    const startTime = Date.now();

    // 步骤1：导出元数据到数据库
    console.log('━'.repeat(80));
    console.log('步骤 1/3: 导出训练数据元数据到数据库');
    console.log('━'.repeat(80));

    await runCommand(
      'node',
      [
        'out/cli.js',
        'export-training',
        `--demo`, DEMO_PATH,
        `--player`, PLAYER_STEAM_ID,
        `--round`, ROUND_NUMBER
      ],
      '导出元数据'
    );

    // 步骤2：录制视频帧到F盘
    console.log('━'.repeat(80));
    console.log('步骤 2/3: 录制视频帧（保存到F盘）');
    console.log('━'.repeat(80));

    await runCommand(
      'node',
      [
        'scripts/cli-generate-frames.mjs',
        DEMO_PATH,
        PLAYER_STEAM_ID,
        ROUND_NUMBER,
        OUTPUT_BASE
      ],
      '录制视频帧'
    );

    // 步骤3：验证数据质量
    console.log('━'.repeat(80));
    console.log('步骤 3/3: 验证数据质量');
    console.log('━'.repeat(80));

    // 获取demo的checksum
    const checksumResult = await new Promise((resolve, reject) => {
      const proc = spawn('node', [
        '-e',
        `import pkg from 'pg'; const {Client} = pkg; const c = new Client({host:'127.0.0.1',port:5432,user:'postgres',password:'88683139',database:'csdm'}); await c.connect(); const r = await c.query('SELECT checksum FROM matches WHERE name = $1', ['${path.basename(DEMO_PATH)}']); console.log(r.rows[0]?.checksum || ''); await c.end();`
      ], { shell: true });

      let output = '';
      proc.stdout.on('data', (data) => { output += data; });
      proc.on('close', () => resolve(output.trim()));
      proc.on('error', reject);
    });

    if (checksumResult) {
      await runCommand(
        'node',
        [
          'scripts/validate-training-data.mjs',
          checksumResult,
          PLAYER_STEAM_ID,
          ROUND_NUMBER
        ],
        '验证数据'
      );
    } else {
      console.log('⚠️  无法获取checksum，跳过验证步骤');
    }

    // 完成统计
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);

    console.log('\n' + '='.repeat(80));
    console.log('🎉 完整流程执行完成！');
    console.log('='.repeat(80));
    console.log(`总耗时: ${duration} 分钟`);
    console.log(`数据位置: ${OUTPUT_BASE}`);
    console.log();

    // 显示数据统计
    console.log('📊 数据统计:');

    // 统计图片数量
    const framesDir = path.join(OUTPUT_BASE, `${path.basename(DEMO_PATH, '.dem')}_${PLAYER_STEAM_ID}`, `round_${ROUND_NUMBER}`, 'frames');
    if (fs.existsSync(framesDir)) {
      const frames = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
      console.log(`  图片数量: ${frames.length} 张`);

      // 计算总大小
      let totalSize = 0;
      frames.forEach(f => {
        totalSize += fs.statSync(path.join(framesDir, f)).size;
      });
      console.log(`  总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    }

    console.log();
    console.log('🔗 查看数据:');
    console.log(`  cd "${OUTPUT_BASE}"`);
    console.log(`  ls -lh`);

  } catch (error) {
    console.error('\n❌ 流程执行失败:', error.message);
    process.exit(1);
  }
}

main();
