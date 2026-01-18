#!/usr/bin/env node

/**
 * 智能训练数据生成流水线
 * 特性：
 * 1. 自动解析整个 demo 的所有玩家和回合
 * 2. 检查数据库和图片文件，跳过已完成的数据
 * 3. 支持断点续传
 * 4. 支持停止文件机制
 *
 * 用法：
 * node scripts/smart-training-pipeline.mjs <demo路径> [选项]
 *
 * 选项：
 * --players <steam_ids>  只处理指定玩家（逗号分隔），默认处理所有玩家
 * --rounds <numbers>     只处理指定回合（逗号分隔），默认处理所有回合
 * --force               强制重新生成，即使数据已存在
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;

const execAsync = promisify(exec);

// 数据库配置
const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

// 停止文件路径
const STOP_FILE = '/f/cs_data/batch_process.stop';

// 输出目录
const OUTPUT_BASE = 'F:/cs_data/traindata';

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('用法: node smart-training-pipeline.mjs <demo路径> [选项]');
    console.error('');
    console.error('选项:');
    console.error('  --players <ids>    只处理指定玩家（逗号分隔）');
    console.error('  --rounds <nums>    只处理指定回合（逗号分隔）');
    console.error('  --force            强制重新生成');
    process.exit(1);
  }

  const demoPath = args[0];
  const options = {
    players: null,
    rounds: null,
    force: false,
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--players' && i + 1 < args.length) {
      options.players = args[i + 1].split(',');
      i++;
    } else if (args[i] === '--rounds' && i + 1 < args.length) {
      options.rounds = args[i + 1].split(',').map(Number);
      i++;
    } else if (args[i] === '--force') {
      options.force = true;
    }
  }

  return { demoPath, options };
}

// 检查停止文件
function shouldStop() {
  return fs.existsSync(STOP_FILE);
}

// 获取所有玩家信息
async function getPlayers(demoPath) {
  console.log('🔍 获取 demo 中的玩家信息...');

  const cmd = `node out/cli.js training-data "${demoPath}" --list-players`;
  const { stdout } = await execAsync(cmd, {
    cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
  });

  // 解析输出，提取玩家信息
  const lines = stdout.split('\n');
  const players = [];

  for (const line of lines) {
    // 查找包含 Steam ID 的行
    const match = line.match(/(\d{17})/); // Steam ID 是17位数字
    if (match) {
      const steamId = match[1];
      // 尝试提取玩家名
      const nameMatch = line.match(/Name:\s*(.+?)\s*\|/);
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

      if (!players.find(p => p.steamId === steamId)) {
        players.push({ steamId, name });
      }
    }
  }

  console.log(`✓ 找到 ${players.length} 个玩家`);
  return players;
}

// 获取所有回合信息
async function getRounds(checksum) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  const query = `
    SELECT DISTINCT number
    FROM rounds
    WHERE match_checksum = $1
    ORDER BY number
  `;

  const result = await client.query(query, [checksum]);
  await client.end();

  return result.rows.map(row => row.number);
}

// 获取 demo checksum
async function getChecksum(demoPath) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  const query = `
    SELECT checksum
    FROM matches
    WHERE demo_path LIKE $1
    ORDER BY analyze_date DESC
    LIMIT 1
  `;

  const result = await client.query(query, [`%${path.basename(demoPath)}%`]);
  await client.end();

  if (result.rows.length === 0) {
    throw new Error('Demo 未在数据库中找到，请先运行 analyze 命令');
  }

  return result.rows[0].checksum;
}

// 检查数据是否已存在
async function checkDataExists(checksum, playerSteamId, playerName, roundNumber, force) {
  // 1. 检查数据库记录
  const client = new Client(DB_CONFIG);
  await client.connect();

  const query = `
    SELECT COUNT(*) as count,
           MIN(start_frame_path) as first_frame
    FROM training_windows
    WHERE match_checksum = $1
      AND player_steam_id = $2
      AND round_number = $3
  `;

  const result = await client.query(query, [checksum, playerSteamId, roundNumber]);
  await client.end();

  const windowCount = parseInt(result.rows[0].count);

  if (windowCount === 0) {
    return { exists: false, reason: '数据库无记录' };
  }

  // 2. 检查图片文件
  const frameDir = path.join(OUTPUT_BASE, `${playerName}_${playerSteamId}_round${roundNumber}`, 'frames');

  if (!fs.existsSync(frameDir)) {
    return { exists: false, reason: '图片目录不存在', windowCount };
  }

  const frameFiles = fs.readdirSync(frameDir).filter(f => f.endsWith('.jpg'));
  const expectedFrames = windowCount * 10;

  if (frameFiles.length < expectedFrames * 0.9) { // 容忍10%的误差
    return {
      exists: false,
      reason: `图片不完整 (${frameFiles.length}/${expectedFrames})`,
      windowCount
    };
  }

  if (force) {
    return { exists: false, reason: '强制重新生成', windowCount };
  }

  return {
    exists: true,
    windowCount,
    frameCount: frameFiles.length
  };
}

// 主流程
async function main() {
  const { demoPath, options } = parseArgs();

  if (!fs.existsSync(demoPath)) {
    console.error(`❌ Demo 文件不存在: ${demoPath}`);
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('智能训练数据生成流水线');
  console.log('='.repeat(80));
  console.log(`Demo: ${demoPath}`);
  console.log(`模式: ${options.force ? '强制重新生成' : '智能跳过已有数据'}`);
  console.log('');

  // 1. 获取 checksum
  console.log('[1/5] 获取 demo checksum...');
  let checksum;
  try {
    checksum = await getChecksum(demoPath);
    console.log(`✓ Checksum: ${checksum}`);
  } catch (error) {
    console.log('⚠ Demo 未在数据库中，先导入...');
    const analyzeCmd = `node out/cli.js analyze "${demoPath}"`;
    await execAsync(analyzeCmd, {
      cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
    });
    checksum = await getChecksum(demoPath);
    console.log(`✓ Checksum: ${checksum}`);
  }

  // 2. 获取玩家列表
  console.log('\n[2/5] 获取玩家列表...');
  const allPlayers = await getPlayers(demoPath);

  let players = allPlayers;
  if (options.players) {
    players = allPlayers.filter(p => options.players.includes(p.steamId));
    console.log(`✓ 筛选后: ${players.length} 个玩家`);
  }

  // 3. 获取回合列表
  console.log('\n[3/5] 获取回合列表...');
  const allRounds = await getRounds(checksum);
  console.log(`✓ 找到 ${allRounds.length} 个回合`);

  let rounds = allRounds;
  if (options.rounds) {
    rounds = allRounds.filter(r => options.rounds.includes(r));
    console.log(`✓ 筛选后: ${rounds.length} 个回合`);
  }

  // 4. 计算任务
  const tasks = [];
  for (const player of players) {
    for (const round of rounds) {
      tasks.push({ player, round });
    }
  }

  console.log(`\n[4/5] 总共 ${tasks.length} 个任务 (${players.length} 玩家 × ${rounds.length} 回合)`);

  // 5. 处理任务
  console.log('\n[5/5] 开始处理...\n');

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (shouldStop()) {
      console.log('\n⚠️  检测到停止文件，终止处理');
      break;
    }

    const { player, round } = tasks[i];
    const progress = `[${i + 1}/${tasks.length}]`;

    console.log(`${progress} ${player.name} (${player.steamId}) - Round ${round}`);

    // 检查数据是否已存在
    const check = await checkDataExists(
      checksum,
      player.steamId,
      player.name,
      round,
      options.force
    );

    if (check.exists) {
      console.log(`  ⏭️  跳过 (已有 ${check.windowCount} 个窗口, ${check.frameCount} 帧图片)`);
      skipped++;
      continue;
    } else {
      console.log(`  📝 ${check.reason}`);
    }

    // 运行完整流水线（带重试机制）
    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      attempt++;

      if (attempt > 1) {
        console.log(`  🔄 重试第 ${attempt}/${MAX_RETRIES} 次...`);

        // 清理可能残留的 CS2 进程
        try {
          await execAsync('cmd.exe /c "taskkill /F /IM cs2.exe 2>nul"');
        } catch (e) {
          // 忽略错误（进程可能不存在）
        }

        // 等待3秒，让系统稳定
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      try {
        const cmd = `node scripts/complete-training-pipeline.mjs "${demoPath}" ${player.steamId} ${round}`;
        await execAsync(cmd, {
          cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
          timeout: 600000, // 10分钟超时
        });
        console.log(`  ✅ 完成`);
        processed++;
        success = true;
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          console.log(`  ⚠️  尝试 ${attempt} 失败，准备重试...`);
        } else {
          console.log(`  ❌ 失败（已重试 ${MAX_RETRIES} 次）: ${error.message.split('\n')[0]}`);
          failed++;
        }
      }
    }

    console.log('');
  }

  // 总结
  console.log('='.repeat(80));
  console.log('处理完成');
  console.log('='.repeat(80));
  console.log(`总任务: ${tasks.length}`);
  console.log(`✅ 已处理: ${processed}`);
  console.log(`⏭️  已跳过: ${skipped}`);
  console.log(`❌ 失败: ${failed}`);
  console.log('='.repeat(80));
}

main().catch(error => {
  console.error('发生错误:', error);
  process.exit(1);
});
