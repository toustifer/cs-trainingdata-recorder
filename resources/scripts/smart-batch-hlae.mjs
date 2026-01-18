#!/usr/bin/env node

/**
 * 最终稳健方案：单回合循环批量录制
 * 
 * 这种方式最稳，因为它一个回合一个回合地重启 CS2，
 * 避免了 CSDM CLI 处理多序列时的内部 Bug。
 */

import { spawn } from 'node:child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let checksum, playerSteamId, demoPath, rounds, speed, outputDir, framesPerWindow;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum') checksum = args[++i];
  else if (args[i] === '--player') playerSteamId = args[++i];
  else if (args[i] === '--demo') demoPath = args[++i];
  else if (args[i] === '--rounds') rounds = args[++i];
  else if (args[i] === '--speed') speed = args[++i];
  else if (args[i] === '--output') outputDir = args[++i];
  else if (args[i] === '--frames') framesPerWindow = args[++i];
}

if (!checksum || !demoPath) {
  console.error('用法: node scripts/smart-batch-hlae.mjs --checksum <checksum> --demo <path> [--player <steam_id>] [--rounds <1,2,3>] [--speed <n>] [--output <dir>] [--frames <n>]');
  console.error('  --player 可选，不提供时录制所有玩家');
  console.error('  --rounds 可选，不提供时录制所有回合');
  process.exit(1);
}

async function runSingleRound(roundNum, currentPlayerSteamId, retryCount = 0) {
    const maxRetries = 3;
    const retryPrefix = retryCount > 0 ? ` (重试 ${retryCount}/${maxRetries})` : '';

    return new Promise((resolve, reject) => {
        console.log(`\n>>> 正在录制回合 ${roundNum}${retryPrefix} ...`);

        // 使用脚本所在目录的上级目录作为 cwd (app/ 目录)
        const appDir = path.resolve(__dirname, '..');
        const scriptPath = path.join(appDir, 'scripts', 'cli-generate-hlae-video.mjs');

        const cmdArgs = [
            scriptPath,
            '--checksum', checksum,
            '--player', currentPlayerSteamId,
            '--round', String(roundNum),
            '--demo', demoPath  // 不需要引号，spawn 会自动处理
        ];

        // 传递可选参数
        if (speed) {
            cmdArgs.push('--speed', speed);
        }
        if (outputDir) {
            cmdArgs.push('--output', outputDir);
        }
        if (framesPerWindow) {
            cmdArgs.push('--frames', framesPerWindow);
        }

        console.log(`[DEBUG] cwd: ${appDir}`);
        console.log(`[DEBUG] script: ${scriptPath}`);

        const p = spawn('node', cmdArgs, { cwd: appDir, stdio: 'inherit' });

        p.on('error', err => {
            console.error(`[ERROR] spawn error: ${err.message}`);
            reject(err);
        });
        p.on('close', code => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
    });
}

async function runSingleRoundWithRetry(roundNum, currentPlayerSteamId) {
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            await runSingleRound(roundNum, currentPlayerSteamId, attempt);
            if (attempt > 0) {
                console.log(`\n✓ 回合 ${roundNum} 重试成功！`);
            }
            return; // 成功，退出重试循环
        } catch (e) {
            if (attempt < maxRetries) {
                console.error(`\n⚠️ 回合 ${roundNum} 失败: ${e.message}`);
                console.log(`>>> 等待 5 秒后重试 (${attempt + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error(`\n✗ 回合 ${roundNum} 失败 ${maxRetries + 1} 次，跳过`);
                throw e; // 所有重试都失败，抛出错误
            }
        }
    }
}

async function main() {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '88683139', database: 'csdm' });
  await client.connect();

  try {
    // 1. 确定要录制的玩家列表
    let players;
    if (playerSteamId) {
      // 指定了玩家，只录制该玩家
      const result = await client.query(`
        SELECT DISTINCT player_steam_id,
               (SELECT name FROM players WHERE steam_id = training_windows.player_steam_id AND match_checksum = $1 LIMIT 1) as player_name
        FROM training_windows
        WHERE match_checksum = $1 AND player_steam_id = $2
      `, [checksum, playerSteamId]);

      if (result.rows.length === 0) {
        console.error(`错误: 未找到玩家 ${playerSteamId} 在该 demo 的训练窗口数据`);
        process.exit(1);
      }
      players = result.rows;
    } else {
      // 没有指定玩家，录制所有玩家
      const result = await client.query(`
        SELECT DISTINCT player_steam_id,
               (SELECT name FROM players WHERE steam_id = training_windows.player_steam_id AND match_checksum = $1 LIMIT 1) as player_name
        FROM training_windows
        WHERE match_checksum = $1
        ORDER BY player_steam_id
      `, [checksum]);

      if (result.rows.length === 0) {
        console.error(`错误: 该 demo 没有训练窗口数据`);
        process.exit(1);
      }
      players = result.rows;
      console.log(`未指定玩家，将录制所有 ${players.length} 个玩家`);
    }

    // 2. 对每个玩家执行录制
    let totalSuccess = 0;
    let totalFail = 0;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      console.log('\n' + '='.repeat(80));
      console.log(`[${i + 1}/${players.length}] 录制玩家: ${player.player_name || 'Unknown'} (${player.player_steam_id})`);
      console.log('='.repeat(80));

      // 查询该玩家的回合
      let roundsQuery, roundsParams;
      if (rounds) {
        // 指定了回合，只录制这些回合
        const roundNumbers = rounds.split(',').map(r => parseInt(r.trim()));
        roundsQuery = `
          SELECT round_number FROM training_windows
          WHERE match_checksum = $1 AND player_steam_id = $2 AND round_number = ANY($3::int[])
          GROUP BY round_number ORDER BY round_number ASC
        `;
        roundsParams = [checksum, player.player_steam_id, roundNumbers];
      } else {
        // 没有指定回合，录制所有回合
        roundsQuery = `
          SELECT round_number FROM training_windows
          WHERE match_checksum = $1 AND player_steam_id = $2
          GROUP BY round_number ORDER BY round_number ASC
        `;
        roundsParams = [checksum, player.player_steam_id];
      }

      const roundsResult = await client.query(roundsQuery, roundsParams);

      console.log(`准备录制 ${roundsResult.rows.length} 个回合...`);

      let successCount = 0;
      let failCount = 0;

      for (const r of roundsResult.rows) {
        try {
          await runSingleRoundWithRetry(r.round_number, player.player_steam_id);
          successCount++;
        } catch (e) {
          failCount++;
          // 已经在 runSingleRoundWithRetry 中打印了错误信息
        }
      }

      console.log(`\n玩家 ${player.player_name} 录制完成: ✓ ${successCount} 个回合成功, ✗ ${failCount} 个回合失败`);
      totalSuccess += successCount;
      totalFail += failCount;
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 所有任务结束！');
    console.log(`总计: ${players.length} 个玩家`);
    console.log(`✓ 成功: ${totalSuccess} 个回合`);
    if (totalFail > 0) {
      console.log(`✗ 失败: ${totalFail} 个回合 (已重试3次)`);
    }
    console.log('='.repeat(80));
  } finally {
    await client.end();
  }
}

main();
