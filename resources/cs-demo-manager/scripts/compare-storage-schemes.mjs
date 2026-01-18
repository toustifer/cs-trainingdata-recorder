#!/usr/bin/env node

/**
 * 存储方案对比测试脚本
 *
 * 对比：
 * - 方案一：独立 JPG (当前)
 * - 方案三：Video + Cache
 *
 * 测试内容：
 * - 存储空间占用
 * - 录制时间
 * - 数据加载性能
 */

import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);

// 解析参数
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('用法: node compare-storage-schemes.mjs <demo.dem> <steam_id> <round>');
  console.error('');
  console.error('示例:');
  console.error('  node compare-storage-schemes.mjs "demo.dem" 76561199138765870 1');
  process.exit(1);
}

const [demoPath, playerSteamId, roundNumber] = args;

console.log('='.repeat(80));
console.log('存储方案对比测试');
console.log('='.repeat(80));
console.log(`Demo: ${demoPath}`);
console.log(`Player: ${playerSteamId}`);
console.log(`Round: ${roundNumber}`);
console.log('');

/**
 * 获取 checksum
 */
async function getChecksum(demoPath) {
  try {
    const { default: pg } = await import('pg');
    const { Client } = pg;

    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const result = await client.query(
      `SELECT DISTINCT match_checksum FROM training_windows LIMIT 1`
    );

    await client.end();

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].match_checksum;
  } catch (error) {
    return null;
  }
}

/**
 * 获取目录大小
 */
async function getDirSize(dirPath) {
  let totalSize = 0;
  let fileCount = 0;

  try {
    if (!await fs.pathExists(dirPath)) {
      return { totalSize: 0, fileCount: 0 };
    }

    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        const subSize = await getDirSize(filePath);
        totalSize += subSize.totalSize;
        fileCount += subSize.fileCount;
      } else {
        const stat = await fs.stat(filePath);
        totalSize += stat.size;
        fileCount++;
      }
    }
  } catch (error) {
    console.error(`⚠️ 获取目录大小失败: ${dirPath}`, error.message);
  }

  return { totalSize, fileCount };
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/**
 * 格式化时间
 */
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}分${remainingSeconds}秒`;
  }
  return `${seconds}秒`;
}

/**
 * 测试方案一：独立 JPG
 */
async function testSchemeJPG(checksum, playerSteamId, roundNumber, demoPath) {
  console.log('测试方案一：独立 JPG 存储');
  console.log('-'.repeat(80));

  const startTime = Date.now();

  try {
    // 运行录制脚本
    await execAsync(
      `node scripts/cli-generate-frames.mjs --checksum ${checksum} --player ${playerSteamId} --round ${roundNumber} --demo "${demoPath}"`,
      {
        cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
        timeout: 600000,
      }
    );

    const recordTime = Date.now() - startTime;

    // 获取输出目录大小
    const { default: pg } = await import('pg');
    const { Client } = pg;

    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const result = await client.query(
      `SELECT player_name FROM training_windows
       WHERE match_checksum = $1
         AND player_steam_id = $2
         AND round_number = $3
       LIMIT 1`,
      [checksum, playerSteamId, roundNumber]
    );

    await client.end();

    const playerName = result.rows[0]?.player_name;
    const outputRoot = 'F:/cs_data/traindata';
    const outputFolder = `${playerName}_${playerSteamId}_round${roundNumber}`;
    const outputPath = path.join(outputRoot, outputFolder);

    const { totalSize, fileCount } = await getDirSize(outputPath);

    return {
      success: true,
      recordTime,
      storageSize: totalSize,
      fileCount,
      outputPath,
    };

  } catch (error) {
    console.error('❌ 录制失败:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 测试方案三：Video + Cache
 */
async function testSchemeVideo(checksum, playerSteamId, roundNumber, demoPath) {
  console.log('测试方案三：Video + Cache 存储');
  console.log('-'.repeat(80));

  const startTime = Date.now();

  try {
    // 运行视频录制脚本
    await execAsync(
      `node scripts/cli-generate-frames-video.mjs --checksum ${checksum} --player ${playerSteamId} --round ${roundNumber} --demo "${demoPath}"`,
      {
        cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
        timeout: 600000,
      }
    );

    const recordTime = Date.now() - startTime;

    // 获取输出目录大小
    const { default: pg } = await import('pg');
    const { Client } = pg;

    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const result = await client.query(
      `SELECT player_name FROM training_windows
       WHERE match_checksum = $1
         AND player_steam_id = $2
         AND round_number = $3
       LIMIT 1`,
      [checksum, playerSteamId, roundNumber]
    );

    await client.end();

    const playerName = result.rows[0]?.player_name;
    const outputRoot = 'F:/cs_data/traindata';
    const outputFolder = `${playerName}_${playerSteamId}_round${roundNumber}`;
    const outputPath = path.join(outputRoot, outputFolder);

    const { totalSize, fileCount } = await getDirSize(outputPath);

    return {
      success: true,
      recordTime,
      storageSize: totalSize,
      fileCount,
      outputPath,
    };

  } catch (error) {
    console.error('❌ 录制失败:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 1. 获取 checksum
    console.log('[1/4] 获取 demo checksum...');
    const checksum = await getChecksum(demoPath);

    if (!checksum) {
      console.error('❌ 未找到 checksum，请先运行元数据导出');
      console.error(`   node out/cli.js training-data "${demoPath}"`);
      process.exit(1);
    }

    console.log(`✓ Checksum: ${checksum}`);
    console.log('');

    // 2. 清理旧数据（如果存在）
    console.log('[2/4] 清理旧测试数据...');
    const { default: pg } = await import('pg');
    const { Client } = pg;

    const client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const playerResult = await client.query(
      `SELECT player_name FROM training_windows
       WHERE match_checksum = $1
         AND player_steam_id = $2
         AND round_number = $3
       LIMIT 1`,
      [checksum, playerSteamId, roundNumber]
    );

    const playerName = playerResult.rows[0]?.player_name;

    await client.end();

    if (playerName) {
      const outputRoot = 'F:/cs_data/traindata';
      const outputFolder = `${playerName}_${playerSteamId}_round${roundNumber}`;
      const outputPath = path.join(outputRoot, outputFolder);

      if (await fs.pathExists(outputPath)) {
        console.log(`  删除旧数据: ${outputPath}`);
        await fs.remove(outputPath);
      }
    }

    console.log('✓ 清理完成');
    console.log('');

    // 3. 测试方案一（JPG）
    console.log('[3/4] 测试方案一...');
    const resultJPG = await testSchemeJPG(checksum, playerSteamId, roundNumber, demoPath);

    if (resultJPG.success) {
      console.log(`✓ 录制完成: ${formatTime(resultJPG.recordTime)}`);
      console.log(`  存储空间: ${formatBytes(resultJPG.storageSize)}`);
      console.log(`  文件数量: ${resultJPG.fileCount}`);
    }

    console.log('');

    // 备份方案一的数据
    if (resultJPG.success && playerName) {
      const backupPath = resultJPG.outputPath + '_jpg_backup';
      await fs.copy(resultJPG.outputPath, backupPath);
      console.log(`  备份到: ${backupPath}`);
      await fs.remove(resultJPG.outputPath);
    }

    console.log('');

    // 4. 测试方案三（Video）
    console.log('[4/4] 测试方案三...');
    const resultVideo = await testSchemeVideo(checksum, playerSteamId, roundNumber, demoPath);

    if (resultVideo.success) {
      console.log(`✓ 录制完成: ${formatTime(resultVideo.recordTime)}`);
      console.log(`  存储空间: ${formatBytes(resultVideo.storageSize)}`);
      console.log(`  文件数量: ${resultVideo.fileCount}`);
    }

    console.log('');

    // 5. 对比结果
    console.log('='.repeat(80));
    console.log('对比结果');
    console.log('='.repeat(80));
    console.log('');

    if (resultJPG.success && resultVideo.success) {
      const timeDiff = resultVideo.recordTime - resultJPG.recordTime;
      const timePercent = ((timeDiff / resultJPG.recordTime) * 100).toFixed(1);

      const sizeSavings = resultJPG.storageSize - resultVideo.storageSize;
      const sizePercent = ((sizeSavings / resultJPG.storageSize) * 100).toFixed(1);

      console.log('| 指标             | 方案一 (JPG)          | 方案三 (Video)         | 差异                |');
      console.log('|-----------------|----------------------|------------------------|---------------------|');
      console.log(`| 录制时间         | ${formatTime(resultJPG.recordTime).padEnd(20)} | ${formatTime(resultVideo.recordTime).padEnd(22)} | ${timePercent > 0 ? '+' : ''}${timePercent}%              |`);
      console.log(`| 存储空间         | ${formatBytes(resultJPG.storageSize).padEnd(20)} | ${formatBytes(resultVideo.storageSize).padEnd(22)} | -${sizePercent}% (节省 ${formatBytes(sizeSavings)}) |`);
      console.log(`| 文件数量         | ${resultJPG.fileCount.toString().padEnd(20)} | ${resultVideo.fileCount.toString().padEnd(22)} | -${resultJPG.fileCount - resultVideo.fileCount}                |`);
      console.log('');

      console.log('总结:');
      console.log(`  - 方案三节省存储空间约 ${sizePercent}%`);
      console.log(`  - 录制时间${timePercent > 0 ? '增加' : '减少'}约 ${Math.abs(timePercent)}%`);
      console.log(`  - 文件数量从 ${resultJPG.fileCount} 减少到 ${resultVideo.fileCount}`);
      console.log('');
    }

    console.log('备份数据位置:');
    if (resultJPG.success && playerName) {
      console.log(`  - JPG 数据: ${resultJPG.outputPath}_jpg_backup`);
    }
    if (resultVideo.success) {
      console.log(`  - Video 数据: ${resultVideo.outputPath}`);
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
