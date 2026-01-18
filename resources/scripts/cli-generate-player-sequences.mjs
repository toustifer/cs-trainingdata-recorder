#!/usr/bin/env node

/**
 * 方案 E：单次启动 + 多序列精准录制 (修复版)
 */

import { spawn } from 'node:child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let checksum, playerSteamId, demoPath;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum') checksum = args[++i];
  else if (args[i] === '--player') playerSteamId = args[++i];
  else if (args[i] === '--demo') demoPath = args[++i];
}

if (!checksum || !playerSteamId || !demoPath) {
  console.error('用法: node scripts/cli-generate-player-sequences.mjs --checksum <checksum> --player <steam_id> --demo <path>');
  process.exit(1);
}

async function main() {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '88683139', database: 'csdm' });
  await client.connect();

  try {
    console.log('[1/4] 正在从数据库生成任务序列...');
    const rounds = (await client.query(`
      SELECT round_number, player_name, MIN(start_tick) as s, MAX(end_tick) as e 
      FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 
      GROUP BY round_number, player_name ORDER BY round_number ASC`, [checksum, playerSteamId])).rows;

    if (rounds.length === 0) throw new Error('未找到录制任务');
    const playerName = rounds[0].player_name;
    const tickrate = (await client.query('SELECT tickrate FROM demos WHERE checksum = $1', [checksum])).rows[0].tickrate;

    const outputRoot = 'F:/cs_data/traindata';
    const matchFolder = `${playerName}_${playerSteamId}_seq_${checksum.substring(0, 8)}`;
    const matchOutputPath = path.resolve(outputRoot, matchFolder);
    await fs.mkdirp(matchOutputPath);

    const sequences = rounds.map((r, index) => ({
      number: index + 1,
      startTick: parseInt(r.s),
      endTick: parseInt(r.e),
      playerCameras: [{
        tick: parseInt(r.s),
        playerSteamId: playerSteamId,
        playerName: playerName
      }],
      showXRay: false, showAssists: false, showOnlyDeathNotices: false, recordAudio: false
    }));

    const config = {
      demoPath: path.resolve(demoPath),
      recordingSystem: 'HLAE', recordingOutput: 'video', encoderSoftware: 'FFmpeg',
      framerate: 25, width: 640, height: 480,
      closeGameAfterRecording: true, concatenateSequences: false,
      outputFolderPath: matchOutputPath,
      sequences: sequences,
      cfg: "fps_max 0; engine_no_focus_sleep 0; demo_timescale 1; host_timescale 1; cl_draw_only_deathnotices 0",
      ffmpegSettings: { videoContainer: 'mp4', videoCodec: 'libx264', constantRateFactor: 23 }
    };

    const configPath = path.join(matchOutputPath, 'recording_config.json');
    await fs.writeJSON(configPath, config, { spaces: 2 });

    console.log(`\n[2/4] 启动全场多序列录制 (共 ${rounds.length} 个回合)...`);
    const csdmCmd = 'node';
    const csdmArgs = ['out/cli.js', 'video', '--config-file', configPath];
    
    await new Promise((resolve, reject) => {
        const p = spawn(csdmCmd, csdmArgs, { cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager', shell: true });
        p.stdout.on('data', d => process.stdout.write(d));
        p.stderr.on('data', d => process.stderr.write(d));
        p.on('close', code => code === 0 ? resolve() : reject(new Error(`CSDM Exit ${code}`)));
    });

    console.log('\n[3/4] 录制完成，开始逐个回合提取图片...');
    const condaPython = path.join(process.env.USERPROFILE, '.conda', 'envs', 'cs2demo', 'python.exe');
    const workerScript = path.join(__dirname, 'extract_worker.py');

    for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        const roundNum = r.round_number;
        const seqNum = i + 1;
        
        const files = await fs.readdir(matchOutputPath);
        const videoFile = files.find(f => f.startsWith(`sequence-${seqNum}-`) && f.endsWith('.mp4'));
        
        if (videoFile) {
            const videoPath = path.join(matchOutputPath, videoFile);
            console.log(`\n处理序列 ${seqNum} (回合 ${roundNum}): ${videoFile}`);
            
            const roundConfig = {
                video_path: videoPath, video_start_tick: parseInt(r.s),
                tickrate, fps: 25, output_root: matchOutputPath,
                checksum, playerName, playerSteamId,
                rounds: [{
                    round_number: roundNum, folder_name: `round_${roundNum}`,
                    windows: (await client.query(`SELECT * FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 AND round_number = $3 ORDER BY window_idx ASC`, [checksum, playerSteamId, roundNum])).rows
                }]
            };
            
            const roundConfigPath = path.join(matchOutputPath, `config_r${roundNum}.json`);
            await fs.writeJSON(roundConfigPath, roundConfig);
            
            await new Promise((resolve) => {
                const py = spawn(condaPython, [workerScript, roundConfigPath]);
                py.stdout.on('data', d => process.stdout.write(d));
                py.on('close', resolve);
            });
            await fs.remove(roundConfigPath);
        }
    }

    console.log('\n[4/4] 🎉 所有序列处理完毕！');
  } catch (error) {
    console.error('\n❌ 运行失败:', error.message);
  } finally {
    await client.end();
  }
}

main();