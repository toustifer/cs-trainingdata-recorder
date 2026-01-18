#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
const args = process.argv.slice(2);
let checksum, playerSteamId, demoPath, forceOverwrite = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum' && i + 1 < args.length) { checksum = args[i + 1]; i++; }
  else if (args[i] === '--player' && i + 1 < args.length) { playerSteamId = args[i + 1]; i++; }
  else if (args[i] === '--demo' && i + 1 < args.length) { demoPath = args[i + 1]; i++; }
  else if (args[i] === '--force') { forceOverwrite = true; }
}

if (!checksum || !playerSteamId || !demoPath) {
  console.error('用法: node scripts/cli-generate-full-match.mjs --checksum <checksum> --player <steam_id> --demo <path> [--force]');
  process.exit(1);
}

async function main() {
  let client;
  try {
    const { default: pg } = await import('pg');
    client = new pg.Client({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '88683139', database: 'csdm' });
    await client.connect();

    // 1. 获取基础元数据
    const roundsResult = await client.query(`
      SELECT round_number, player_name, MIN(start_tick) as s, MAX(end_tick) as e 
      FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 
      GROUP BY round_number, player_name ORDER BY round_number ASC`, [checksum, playerSteamId]);
    
    if (roundsResult.rows.length === 0) throw new Error('数据库中未找到该玩家的录制任务，请先导出元数据。');
    
    const playerName = roundsResult.rows[0].player_name;
    const globalStartTick = Math.min(...roundsResult.rows.map(r => parseInt(r.s)));
    const tickrate = (await client.query('SELECT tickrate FROM demos WHERE checksum = $1', [checksum])).rows[0].tickrate;
    const recordStartTick = Math.max(0, globalStartTick - (tickrate * 5));

    // 2. 路径设置
    const outputRoot = 'F:/cs_data/traindata';
    const matchFolder = `${playerName}_${playerSteamId}_match_${checksum.substring(0, 8)}`;
    const matchOutputPath = path.resolve(outputRoot, matchFolder);
    const fullVideoPath = path.join(matchOutputPath, 'full_match.mp4');
    await fs.mkdirp(matchOutputPath);

    console.log(`================================================================================`);
    console.log(`全场自动化处理: ${playerName} (${playerSteamId})`);
    console.log(`输出目录: ${matchOutputPath}`);
    console.log(`================================================================================`);

    // 3. 检查全场视频
    if (!(await fs.pathExists(fullVideoPath))) {
        console.log('\n[步骤 1/2] 未找到全场视频，正在启动录制...');
        // 如果需要录制，这里会调用 HLAE
        // (略去录制部分代码，假设你已经录好并移动到 full_match.mp4)
        console.error('❌ 错误：请先确保 full_match.mp4 已在输出目录中。');
        process.exit(1);
    } else {
        console.log('\n[步骤 1/2] ✓ 检测到已有全场视频，准备进入提取阶段。');
    }

    // 4. 准备提取配置
    console.log('[步骤 2/2] 正在准备提取配置...');
    const roundsData = [];
    for (const r of roundsResult.rows) {
        const windows = await client.query(`SELECT * FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 AND round_number = $3 ORDER BY window_idx ASC`, [checksum, playerSteamId, r.round_number]);
        roundsData.push({
            round_number: r.round_number,
            folder_name: `round_${r.round_number}`,
            windows: windows.rows
        });
    }

    const config = {
        video_path: fullVideoPath,
        video_start_tick: recordStartTick,
        tickrate,
        fps: 25,
        output_root: matchOutputPath,
        force_overwrite: forceOverwrite,
        checksum, playerName, playerSteamId,
        rounds: roundsData
    };
    const configPath = path.join(matchOutputPath, 'extract_config.json');
    await fs.writeJSON(configPath, config);

    // 5. 调用 Python 工人 (实时输出)
    const condaPython = path.join(process.env.USERPROFILE, '.conda', 'envs', 'cs2demo', 'python.exe');
    const workerScript = path.join(__dirname, 'extract_worker.py');
    
    console.log(`\n正在启动 Python 工人进行智能提取...`);
    
    const pyProcess = spawn(condaPython, [workerScript, configPath]);

    pyProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    pyProcess.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    await new Promise((resolve, reject) => {
      pyProcess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python process exited with code ${code}`));
      });
    });

    await client.end();
    console.log('\n\n🎉 恭喜！整场比赛数据已全部处理完毕。');

  } catch (error) {
    console.error('\n❌ 运行出错:', error.message);
    if (client) await client.end();
  }
}

main();