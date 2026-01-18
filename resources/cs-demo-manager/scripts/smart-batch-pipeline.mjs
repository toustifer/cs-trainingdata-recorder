#!/usr/bin/env node

/**
 * 智能批量训练数据生成流水线
 *
 * 优化策略：一次启动 CS2，连续录制同一玩家的多个回合
 *
 * 用法：
 *   node smart-batch-pipeline.mjs "demo.dem"
 *   node smart-batch-pipeline.mjs "demo.dem" --players 76561198000000001
 *   node smart-batch-pipeline.mjs "demo.dem" --rounds 1,2,3,4,5
 *   node smart-batch-pipeline.mjs "demo.dem" --batch-size 5  # 每次录制5个回合
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

// 解析参数
const args = process.argv.slice(2);
const demoPath = args[0];

if (!demoPath) {
  console.error('用法: node smart-batch-pipeline.mjs <demo路径> [--players <steam_id,steam_id>] [--rounds <1,2,3>] [--batch-size <N>] [--force]');
  process.exit(1);
}

let filterPlayers = null;
let filterRounds = null;
let batchSize = 1; // 默认每次录制10个回合
let forceRegenerate = false;
let outputPath = null; // 输出路径

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--players' && i + 1 < args.length) {
    filterPlayers = args[i + 1].split(',');
    i++;
  } else if (args[i] === '--rounds' && i + 1 < args.length) {
    filterRounds = args[i + 1].split(',').map(Number);
    i++;
  } else if (args[i] === '--batch-size' && i + 1 < args.length) {
    batchSize = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--output' && i + 1 < args.length) {
    outputPath = args[i + 1];
    i++;
  } else if (args[i] === '--force') {
    forceRegenerate = true;
  }
}

console.log('');
console.log('='.repeat(80));
console.log('智能批量训练数据生成流水线');
console.log('='.repeat(80));
console.log(`Demo: ${demoPath}`);
console.log(`批量大小: 每次录制 ${batchSize} 个回合`);
console.log(`模式: ${forceRegenerate ? '强制重新生成' : '智能跳过已有数据'}`);
console.log('');

const STOP_FILE = '/f/cs_data/batch_process.stop';

// 检查数据是否已存在
async function checkDataExists(checksum, playerSteamId, roundNumber) {
  let client = null;
  try {
    // 检查数据库
    const { default: pg } = await import('pg');
    const { Client } = pg;

    client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const result = await client.query(
      `SELECT COUNT(*) as count,
              player_name,
              MIN(start_tick) as min_tick,
              MAX(end_tick) as max_tick
       FROM training_windows
       WHERE match_checksum = $1
         AND player_steam_id = $2
         AND round_number = $3
       GROUP BY player_name`,
      [checksum, playerSteamId, roundNumber]
    );

    const dbCount = parseInt(result.rows[0]?.count || 0);
    const playerName = result.rows[0]?.player_name;

    if (dbCount === 0) {
      return { exists: false, reason: '数据库无记录' };
    }

    // 检查图片文件
    const outputRoot = 'F:/cs_data/traindata';
    const outputFolder = `${playerName}_${playerSteamId}_round${roundNumber}`;
    const framesPath = path.join(outputRoot, outputFolder, 'frames');

    if (!await fs.pathExists(framesPath)) {
      return { exists: false, reason: '图片目录不存在', dbCount };
    }

    const files = await fs.readdir(framesPath);
    const jpgFiles = files.filter(f => f.endsWith('.jpg'));
    const expectedFiles = dbCount * 10;

    if (jpgFiles.length === 0) {
      return { exists: false, reason: '图片文件缺失', dbCount, actualFiles: 0, expectedFiles };
    }

    if (jpgFiles.length < expectedFiles) {
      return { exists: false, reason: '图片不完整', dbCount, actualFiles: jpgFiles.length, expectedFiles };
    }

    return { exists: true, dbCount, actualFiles: jpgFiles.length };

  } catch (error) {
    return { exists: false, reason: `检查失败: ${error.message}` };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // 忽略关闭错误
      }
    }
  }
}

async function main() {
  try {
    // 检查停止文件
    if (await fs.pathExists(STOP_FILE)) {
      console.log('⚠️  发现停止文件，请先删除: ' + STOP_FILE);
      console.log('   运行: rm ' + STOP_FILE);
      process.exit(1);
    }

    // 1. 从数据库获取 demo checksum
    console.log('[1/6] 获取 demo checksum...');
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

    // 从 training_windows 表查询 checksum（该表一定有数据）
    const checksumResult = await client.query(
      `SELECT DISTINCT match_checksum FROM training_windows LIMIT 1`
    );

    if (checksumResult.rows.length === 0) {
      console.error('错误：数据库中未找到训练数据，请先运行元数据导出');
      console.error(`   node out/cli.js training-data "${demoPath}"`);
      await client.end();
      process.exit(1);
    }

    const checksum = checksumResult.rows[0].match_checksum;
    console.log(`✓ Checksum: ${checksum}`);
    console.log('');

    // 2. 获取玩家列表
    console.log('[2/6] 获取玩家列表...');

    let playersQuery = `
      SELECT DISTINCT player_steam_id, player_name
      FROM training_windows
      WHERE match_checksum = $1
      ORDER BY player_name
    `;

    const playersResult = await client.query(playersQuery, [checksum]);
    let players = playersResult.rows;

    if (filterPlayers) {
      players = players.filter(p => filterPlayers.includes(p.player_steam_id));
    }

    console.log(`✓ 找到 ${players.length} 个玩家`);
    for (const player of players) {
      console.log(`  - ${player.player_name} (${player.player_steam_id})`);
    }
    console.log('');

    // 3. 获取回合列表
    console.log('[3/6] 获取回合列表...');
    let roundsQuery = `
      SELECT DISTINCT round_number
      FROM training_windows
      WHERE match_checksum = $1
      ORDER BY round_number
    `;

    const roundsResult = await client.query(roundsQuery, [checksum]);
    let rounds = roundsResult.rows.map(r => r.round_number);

    if (filterRounds) {
      rounds = rounds.filter(r => filterRounds.includes(r));
    }

    console.log(`✓ 找到 ${rounds.length} 个回合: ${rounds.join(', ')}`);
    console.log('');

    await client.end();

    // 4. 统计总任务数
    const totalTasks = players.length * rounds.length;
    console.log(`[4/6] 总共 ${totalTasks} 个任务 (${players.length} 玩家 × ${rounds.length} 回合)`);
    console.log('');

    // 5. 智能分组处理
    console.log('[5/6] 开始智能批量处理...');
    console.log('');

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    let taskIndex = 0;

    for (const player of players) {
      // 为每个玩家检查哪些回合需要录制
      const roundsToRecord = [];

      console.log(`\n检查玩家 ${player.player_name} (${player.player_steam_id})...`);

      for (const round of rounds) {
        taskIndex++;
        const check = await checkDataExists(checksum, player.player_steam_id, round);

        if (check.exists && !forceRegenerate) {
          console.log(`  [${taskIndex}/${totalTasks}] Round ${round}: ⏭️  已存在 (${check.dbCount} 窗口, ${check.actualFiles} 帧)`);
          skipped++;
        } else {
          console.log(`  [${taskIndex}/${totalTasks}] Round ${round}: 📝 ${check.reason || '需要录制'}`);
          roundsToRecord.push(round);
        }
      }

      if (roundsToRecord.length === 0) {
        console.log(`✓ 该玩家所有回合已完成，跳过`);
        continue;
      }

      console.log(`\n🎬 开始录制 ${player.player_name} 的 ${roundsToRecord.length} 个回合...`);

      // 分批录制
      for (let i = 0; i < roundsToRecord.length; i += batchSize) {
        const batch = roundsToRecord.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(roundsToRecord.length / batchSize);

        console.log(`\n批次 ${batchNum}/${totalBatches}: Round ${batch.join(', ')}`);

        // 检查停止文件
        if (await fs.pathExists(STOP_FILE)) {
          console.log('\n⏸️  检测到停止文件，安全退出...');
          await fs.remove(STOP_FILE);
          console.log('✓ 已删除停止文件');
          break;
        }

        // 1. 确保元数据已导出
        console.log('  📊 导出元数据...');
        try {
          await execAsync(
            `node out/cli.js training-data "${demoPath}" --players ${player.player_steam_id} --rounds ${batch.join(',')}${outputPath ? ` --output "${outputPath}"` : ""}`,
            {
              cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
              timeout: 300000,
            }
          );
          console.log('    ✓ 元数据导出完成');
        } catch (error) {
          console.log('    ⚠️  元数据已存在或导出失败');
        }

        // 2. 逐个录制回合
        console.log('  🎥 录制视频帧...');
        for (const round of batch) {
          try {
            await execAsync(
              `node scripts/cli-generate-frames.mjs --checksum ${checksum} --player ${player.player_steam_id}        
        --round ${round} --demo "${demoPath}"`,
              {
                cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
                timeout: 600000, // 10分钟超时
              }
            );
            console.log(`    ✓ Round ${round} 录制完成`);
            processed++;
          } catch (error) {
            console.log(`    ❌ Round ${round} 录制失败: ${error.message.split('\n')[0]}`);
            failed++;
          }
        }

        // 等待一下，避免过快
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // 检查停止文件（玩家间）
      if (await fs.pathExists(STOP_FILE)) {
        console.log('\n⏸️  检测到停止文件，停止处理更多玩家...');
        await fs.remove(STOP_FILE);
        console.log('✓ 已删除停止文件');
        break;
      }
    }

    // 6. 统计结果
    console.log('');
    console.log('='.repeat(80));
    console.log('[6/6] 批量处理完成');
    console.log('='.repeat(80));
    console.log(`✅ 成功: ${processed} 个回合`);
    console.log(`⏭️  跳过: ${skipped} 个回合`);
    console.log(`❌ 失败: ${failed} 个回合`);
    console.log(`📊 总计: ${totalTasks} 个任务`);
    console.log('');

  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

main();
