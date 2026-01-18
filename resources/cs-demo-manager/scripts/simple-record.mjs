#!/usr/bin/env node

/**
 * 简化的录制脚本 - 直接启动 CS2 播放 demo 并使用 startmovie 命令录制帧
 */

import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CS2_EXE = "D:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64\\cs2.exe";
const DEMO_PATH = process.argv[2];
const START_TICK = parseInt(process.argv[3]);
const END_TICK = parseInt(process.argv[4]);
const OUTPUT_DIR = process.argv[5];

if (!DEMO_PATH || !START_TICK || !END_TICK || !OUTPUT_DIR) {
  console.error('Usage: node simple-record.mjs <demo_path> <start_tick> <end_tick> <output_dir>');
  process.exit(1);
}

console.log('简化录制工具');
console.log(`Demo: ${DEMO_PATH}`);
console.log(`Tick range: ${START_TICK} - ${END_TICK}`);
console.log(`Output: ${OUTPUT_DIR}`);
console.log('');

// 创建输出目录
await fs.mkdir(OUTPUT_DIR, { recursive: true });

// 创建 autoexec.cfg
const csgoDir = path.join(path.dirname(CS2_EXE), '../../game/csgo');
const cfgPath = path.join(csgoDir, 'cfg/autoexec.cfg');

const config = `
// CS:DM Training Data Recording
echo "Loading CS:DM training data recording config..."

// 跳转到起始 tick
demo_goto ${START_TICK}

// 等待加载
wait 300

// 开始录制 25fps 帧
host_framerate 25
startmovie "${OUTPUT_DIR}/frame" jpg

// 等待录制完成（根据 tick 差计算等待时间）
// ${END_TICK - START_TICK} ticks ≈ ${Math.ceil((END_TICK - START_TICK) / 64)} seconds

echo "Recording started at tick ${START_TICK}"
echo "Will stop at tick ${END_TICK}"
`;

try {
  await fs.writeFile(cfgPath, config, 'utf-8');
  console.log(`✓ Config written to: ${cfgPath}`);
} catch (error) {
  console.error('✗ Failed to write config:', error.message);
  process.exit(1);
}

// 启动 CS2
console.log('Starting CS2...');
const cs2Args = [
  '-novid',
  '-insecure',
  '+exec', 'autoexec',
  '+playdemo', DEMO_PATH,
  '-width', '1920',
  '-height', '1080',
  '-sw'
];

const cs2Process = spawn(CS2_EXE, cs2Args, {
  stdio: 'inherit',
  shell: true
});

// 计算预期录制时间（tick差 / 64 tickrate + 额外缓冲）
const estimatedSeconds = Math.ceil((END_TICK - START_TICK) / 64) + 10;

console.log(`Estimated recording time: ${estimatedSeconds} seconds`);
console.log('');
console.log('⚠️  重要提示:');
console.log('1. CS2 窗口会自动打开并播放 demo');
console.log('2. 请不要关闭或操作 CS2 窗口');
console.log('3. 录制完成后需要手动在控制台输入: endmovie');
console.log('4. 然后输入: quit 关闭游戏');
console.log('');
console.log('等待 CS2 退出...');

cs2Process.on('exit', (code) => {
  console.log(`CS2 exited with code ${code}`);

  // 检查输出目录中的帧
  fs.readdir(OUTPUT_DIR)
    .then(files => {
      const frames = files.filter(f => f.endsWith('.jpg'));
      console.log(`✓ Found ${frames.length} frames in ${OUTPUT_DIR}`);
    })
    .catch(err => {
      console.error('✗ Failed to check output directory:', err.message);
    });
});
