#!/usr/bin/env node

/**
 * 批量完整流水线 - 处理多个demo的所有玩家所有回合
 *
 * 用法：
 *   node batch-complete-pipeline.mjs "demo1.dem" "demo2.dem" ...
 *   node batch-complete-pipeline.mjs "demo.dem" --players 76561198000000001
 *   node batch-complete-pipeline.mjs "demo.dem" --rounds 1,2,3
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

// 解析参数
const args = process.argv.slice(2);
const demoPath = args[0];
let filterPlayers = null;
let filterRounds = null;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--players' && i + 1 < args.length) {
    filterPlayers = args[i + 1].split(',');
    i++;
  } else if (args[i] === '--rounds' && i + 1 < args.length) {
    filterRounds = args[i + 1].split(',').map(Number);
    i++;
  }
}

if (!demoPath || !demoPath.endsWith('.dem')) {
  console.error('用法: node batch-complete-pipeline.mjs <demo.dem> [--players <steam_id,steam_id>] [--rounds <1,2,3>]');
  process.exit(1);
}

console.log('');
console.log('='.repeat(80));
console.log('批量完整流水线 - 单个Demo所有玩家所有回合');
console.log('='.repeat(80));
console.log(`Demo: ${demoPath}`);
console.log('');

// 检查数据是否已存在
async function checkDataExists(checksum, playerSteamId, roundNumber) {
  let client = null;
  try {
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

// 获取demo的checksum
async function getChecksum(demoPath) {
  let client = null;
  try {
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

    // 从 training_windows 表查询该demo的任意记录
    const result = await client.query(
      `SELECT DISTINCT match_checksum FROM training_windows LIMIT 1`
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].match_checksum;
  } catch (error) {
    return null;
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

// 获取demo的所有玩家和回合
async function getDemoInfo(checksum) {
  let client = null;
  try {
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

    // 获取玩家列表
    const playersResult = await client.query(
      `SELECT DISTINCT player_steam_id, player_name
       FROM training_windows
       WHERE match_checksum = $1
       ORDER BY player_name`,
      [checksum]
    );

    // 获取回合列表
    const roundsResult = await client.query(
      `SELECT DISTINCT round_number
       FROM training_windows
       WHERE match_checksum = $1
       ORDER BY round_number`,
      [checksum]
    );

    return {
      players: playersResult.rows,
      rounds: roundsResult.rows.map(r => r.round_number)
    };
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
    let totalProcessed = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    // 1. 获取checksum
    console.log('[1/3] 获取 demo checksum...');
    const checksum = await getChecksum(demoPath);

    if (!checksum) {
      console.log('⚠️  未找到该demo的训练数据，请先运行元数据导出');
      console.log(`   node out/cli.js training-data "${demoPath}"`);
      process.exit(1);
    }

    console.log(`✓ Checksum: ${checksum}`);
    console.log('');

    // 2. 获取玩家和回合信息
    console.log('[2/3] 获取玩家和回合信息...');
    const { players, rounds } = await getDemoInfo(checksum);

    let filteredPlayers = players;
    let filteredRounds = rounds;

    if (filterPlayers) {
      filteredPlayers = players.filter(p => filterPlayers.includes(p.player_steam_id));
    }

    if (filterRounds) {
      filteredRounds = rounds.filter(r => filterRounds.includes(r));
    }

    console.log(`✓ 找到 ${filteredPlayers.length} 个玩家`);
    for (const player of filteredPlayers) {
      console.log(`  - ${player.player_name} (${player.player_steam_id})`);
    }
    console.log(`✓ 找到 ${filteredRounds.length} 个回合: ${filteredRounds.join(', ')}`);

    const totalTasks = filteredPlayers.length * filteredRounds.length;
    console.log(`\n总任务数: ${totalTasks}`);
    console.log('');

    // 3. 逐个处理
    console.log('[3/3] 开始处理...');
    console.log('');

    let taskIndex = 0;
    for (const player of filteredPlayers) {
      console.log(`处理玩家 ${player.player_name} (${player.player_steam_id})...`);

      for (const round of filteredRounds) {
        taskIndex++;

        // 检查是否已存在
        const check = await checkDataExists(checksum, player.player_steam_id, round);

        if (check.exists) {
          console.log(`  [${taskIndex}/${totalTasks}] Round ${round}: ⏭️  已存在 (${check.dbCount} 窗口, ${check.actualFiles} 帧)`);
          totalSkipped++;
          continue;
        }

        console.log(`  [${taskIndex}/${totalTasks}] Round ${round}: 🎬 开始录制...`);

        try {
          await execAsync(
            `node scripts/complete-training-pipeline.mjs "${demoPath}" ${player.player_steam_id} ${round}`,
            {
              cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager',
              timeout: 600000, // 10分钟超时
            }
          );
          console.log(`    ✓ Round ${round} 完成`);
          totalProcessed++;
        } catch (error) {
          console.log(`    ❌ Round ${round} 失败: ${error.message.split('\n')[0]}`);
          totalFailed++;
        }

        // 等待2秒
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log('');
    }

    // 统计结果
    console.log('='.repeat(80));
    console.log('批量处理完成');
    console.log('='.repeat(80));
    console.log(`✅ 成功: ${totalProcessed}`);
    console.log(`⏭️  跳过: ${totalSkipped}`);
    console.log(`❌ 失败: ${totalFailed}`);
    console.log('');

  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

main();
