#!/usr/bin/env node
/**
 * 监控录制进度并移动数据到F盘
 */

import fs from 'fs';
import { spawn } from 'child_process';

const SOURCE_DIR = 'D:/myprogram/cs_learning/dataset/1/training_data/-shNz-_76561199138765870/round_5';
const DEST_DIR = 'F:/cs_training_data/experiment_round5';

console.log('📊 等待录制完成并移动数据到F盘...\n');

let lastFrameCount = 0;
let stableCount = 0;

const checkInterval = setInterval(() => {
  const framesDir = `${SOURCE_DIR}/frames`;

  if (!fs.existsSync(framesDir)) {
    console.log('等待录制开始...');
    return;
  }

  const frames = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
  const currentCount = frames.length;

  console.log(`当前帧数: ${currentCount} (目标: ~2320)`);

  if (currentCount === lastFrameCount && currentCount > 0) {
    stableCount++;
    console.log(`  帧数稳定 ${stableCount}/3...`);

    if (stableCount >= 3) {
      // 录制完成
      clearInterval(checkInterval);
      console.log('\n✅ 录制完成！');

      // 计算大小
      let totalSize = 0;
      frames.forEach(f => {
        totalSize += fs.statSync(`${framesDir}/${f}`).size;
      });

      console.log(`\n📊 统计:`);
      console.log(`  帧数: ${currentCount}`);
      console.log(`  大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

      // 移动到F盘
      console.log(`\n🚀 开始移动数据到F盘...`);
      console.log(`  源: ${SOURCE_DIR}`);
      console.log(`  目标: ${DEST_DIR}\n`);

      const robocopy = spawn('robocopy', [
        SOURCE_DIR,
        DEST_DIR,
        '/E',
        '/MOVE',
        '/NFL',
        '/NDL',
        '/NJH',
        '/NJS'
      ], { shell: true });

      robocopy.stdout.on('data', (data) => {
        process.stdout.write(data);
      });

      robocopy.on('close', (code) => {
        // Robocopy 返回码: 0-7 都是成功
        if (code <= 7) {
          console.log('\n✅ 数据已移动到F盘！');
          console.log(`📁 位置: ${DEST_DIR}`);

          // 验证
          const destFrames = fs.readdirSync(`${DEST_DIR}/frames`).filter(f => f.endsWith('.jpg'));
          console.log(`✅ 验证: ${destFrames.length} 帧已移动`);
        } else {
          console.error(`\n❌ 移动失败，退出码: ${code}`);
        }
      });
    }
  } else {
    stableCount = 0;
    lastFrameCount = currentCount;
  }
}, 10000); // 每10秒检查一次

// 5分钟超时
setTimeout(() => {
  clearInterval(checkInterval);
  console.log('\n⚠️  超时，请手动检查');
}, 300000);
