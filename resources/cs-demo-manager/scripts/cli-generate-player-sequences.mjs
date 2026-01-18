#!/usr/bin/env node

/**
 * 方案 E (修复版)：一次启动 + 多序列录制 + 智能容错处理
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
    // 1. 准备数据
    console.log('[1/4] 准备录制序列...');
    const rounds = (await client.query(`
      SELECT round_number, player_name, MIN(start_tick) as s, MAX(end_tick) as e 
      FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 
      GROUP BY round_number, player_name ORDER BY round_number ASC`, [checksum, playerSteamId])).rows;

    const playerName = rounds[0].player_name;
    const tickrate = (await client.query('SELECT tickrate FROM demos WHERE checksum = $1', [checksum])).rows[0].tickrate;

    const outputRoot = 'F:/cs_data/traindata';
    const matchFolder = `${playerName}_${playerSteamId}_seq_${checksum.substring(0, 8)}`;
    const matchOutputPath = path.resolve(outputRoot, matchFolder);
    await fs.mkdirp(matchOutputPath);

    // 2. 生成完美配置 (修复所有字段缺失问题)
    const sequences = rounds.map((r, index) => ({
      number: index + 1,
      startTick: parseInt(r.s),
      endTick: parseInt(r.e),
      playerCameras: [{
        tick: parseInt(r.s),
        playerSteamId: playerSteamId,
        playerName: playerName
      }],
      cameras: [],
      playersOptions: [],
      showXRay: false, showAssists: false, showOnlyDeathNotices: false, recordAudio: false,
      playerVoicesEnabled: false, deathNoticesDuration: 5,
      // 关键：在每个序列开始时强制执行指令
      cfg: "fps_max 0; engine_no_focus_sleep 0; demo_timescale 1; host_timescale 1; cl_draw_only_deathnotices 0"
    }));

    const config = {
      demoPath: path.resolve(demoPath),
      recordingSystem: 'HLAE',
      recordingOutput: 'video', // 坚持用视频，因为快
      encoderSoftware: 'FFmpeg',
      framerate: 25,
      width: 640, height: 480,
      closeGameAfterRecording: true, concatenateSequences: false,
      outputFolderPath: matchOutputPath,
      sequences: sequences,
      ffmpegSettings: { videoContainer: 'mp4', videoCodec: 'libx264', constantRateFactor: 23 }
    };

    const configPath = path.join(matchOutputPath, 'recording_config.json');
    await fs.writeJSON(configPath, config, { spaces: 2 });

    // 3. 执行录制 (忽略 CSDM 的报错，我们自己找文件)
    console.log(`
[2/4] 启动 CS2 (共 ${rounds.length} 个回合，预计耗时 2-5 分钟)...`);
    const csdmCmd = 'node';
    const csdmArgs = ['out/cli.js', 'video', '--config-file', configPath];
    
    try {
        await new Promise((resolve, reject) => {
            const p = spawn(csdmCmd, csdmArgs, { cwd: 'D:/myprogram/cs_learning/tools/cs-demo-manager', shell: true });
            p.stdout.on('data', d => process.stdout.write(d));
            // 忽略 stderr，太吵了且容易误导
            p.on('close', code => resolve()); // 无论成功失败都继续，我们自己去检查文件
        });
    } catch (e) {
        console.log("CSDM 执行结束 (可能含警告，继续处理...)");
    }

    // 4. 智能搜寻视频文件
    console.log('\n[3/4] 搜寻生成的视频文件...');
    
    // 可能的位置：输出目录、Demo目录、Demo目录/sequences
    const searchDirs = [
        matchOutputPath,
        path.dirname(demoPath),
        path.join(path.dirname(demoPath), 'sequences') // 有时候会在这里
    ];

    // 收集所有新生成的 MP4
    const foundVideos = new Map(); // Map<sequenceNum, filePath>

    for (const dir of searchDirs) {
        if (await fs.pathExists(dir)) {
            const files = await fs.readdir(dir);
            for (const file of files) {
                // 匹配 sequence-N-tick...mp4
                const match = file.match(/^sequence-(\d+)-.*\.mp4$/);
                if (match) {
                    const seqNum = parseInt(match[1]);
                    const fullPath = path.join(dir, file);
                    // 检查是否是刚刚生成的 (1小时内)
                    const stats = await fs.stat(fullPath);
                    if (Date.now() - stats.mtimeMs < 3600000) {
                        foundVideos.set(seqNum, fullPath);
                    }
                }
            }
        }
    }

    console.log(`✓ 找到了 ${foundVideos.size} / ${rounds.length} 个视频片段。`);

    if (foundVideos.size === 0) {
        console.error("❌ 未找到任何视频文件！录制可能失败。");
        // 尝试找 take 文件夹作为备选
        console.log("尝试查找原始 take 文件夹...");
        // (此处省略 take 处理逻辑，优先支持 MP4)
        process.exit(1);
    }

    // 5. 逐个提取
    console.log('\n[4/4] 开始并行提取图片...');
    const condaPython = path.join(process.env.USERPROFILE, '.conda', 'envs', 'cs2demo', 'python.exe');
    const workerScript = path.join(__dirname, 'extract_worker.py');

    for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        const roundNum = r.round_number;
        const seqNum = i + 1;
        
        if (foundVideos.has(seqNum)) {
            const videoPath = foundVideos.get(seqNum);
            // 移动到规范目录
            const targetVideoPath = path.join(matchOutputPath, `sequence_${seqNum}.mp4`);
            if (videoPath !== targetVideoPath) {
                await fs.move(videoPath, targetVideoPath, { overwrite: true });
            }

            console.log(`
处理回合 ${roundNum} (视频: sequence_${seqNum}.mp4)...`);
            
            const roundConfig = {
                video_path: targetVideoPath,
                video_start_tick: parseInt(r.s), // 完美对齐的关键：起点就是 Tick
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
                py.stderr.on('data', d => process.stderr.write(d)); // 显示 Python 错误
                py.on('close', resolve);
            });
            await fs.remove(roundConfigPath);
        } else {
            console.error(`⚠️ 警告：缺失序列 ${seqNum} (回合 ${roundNum}) 的视频`);
        }
    }

    console.log('\n🎉 任务全部完成！请使用 visualize_playback.py 抽查。');

  } catch (error) {
    console.error('\n❌ 脚本错误:', error.message);
  } finally {
    await client.end();
  }
}

main();
