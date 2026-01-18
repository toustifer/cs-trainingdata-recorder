#!/usr/bin/env node

/**
 * 方案 B：HLAE 录制整个回合 + ffmpeg 切片
 *
 * 流程：
 * 1. 使用 HLAE 录制完整回合（快速，视频流）
 * 2. 使用 ffmpeg 按窗口时间戳切片
 * 3. 保存切片视频 + 索引信息
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FFmpeg 路径
const FFMPEG_PATH = 'F:\\ffmpeg-2026-01-14-git-6c878f8b82-essentials_build\\bin\\ffmpeg.exe';

// 动态定位 cs-demo-manager 目录
const possibleCsdmPaths = [
    path.resolve(__dirname, '../cs-demo-manager'),           // 打包后: scripts/../cs-demo-manager
    path.resolve(__dirname, '../../cs-demo-manager'),        // 开发环境
];

let csdmDir = null;
for (const p of possibleCsdmPaths) {
    if (fs.existsSync(p)) {
        csdmDir = p;
        break;
    }
}

if (!csdmDir) {
    console.error('[错误] 无法找到 cs-demo-manager 目录');
    process.exit(1);
}

// 调试参数
console.log('[DEBUG] cli-generate-hlae-video args:', process.argv.slice(2));

// 解析参数
const args = process.argv.slice(2);
let checksum, playerSteamId, roundNumber, demoPath;
let customOutputRoot = null;
let speed = 8; // 默认倍速
let framesPerWindow = 10; // 每个窗口的帧数，默认10

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--checksum' && i + 1 < args.length) {
    checksum = args[i + 1];
    i++;
  } else if (args[i] === '--player' && i + 1 < args.length) {
    playerSteamId = args[i + 1];
    i++;
  } else if (args[i] === '--round' && i + 1 < args.length) {
    roundNumber = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--demo' && i + 1 < args.length) {
    demoPath = args[i + 1];
    i++;
  } else if (args[i] === '--output' && i + 1 < args.length) {
    customOutputRoot = args[i + 1].replace(/^"|"$/g, ''); // 去除可能的引号
    i++;
  } else if (args[i] === '--speed' && i + 1 < args.length) {
    speed = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--frames' && i + 1 < args.length) {
    framesPerWindow = parseInt(args[i + 1]);
    i++;
  }
}

if (!checksum || !playerSteamId || !roundNumber || !demoPath) {
  console.error('用法: node cli-generate-hlae-video.mjs --checksum <checksum> --player <steam_id> --round <number> --demo <path>');
  process.exit(1);
}

console.log('='.repeat(80));
console.log('HLAE 视频录制 + 切片（方案 B）');
console.log('='.repeat(80));
console.log(`Checksum: ${checksum}`);
console.log(`Player: ${playerSteamId}`);
console.log(`Round: ${roundNumber}`);
console.log('');

async function main() {
  let client;

  try {
    // 1. 从数据库查询窗口数据
    console.log('[1/4] 查询数据库...');
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

    // 查询任务信息
    const taskQuery = `
      SELECT
        round_number,
        player_steam_id,
        player_name,
        MIN(start_tick) as video_start_tick,
        MAX(end_tick) as video_end_tick,
        COUNT(id) as total_windows
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      GROUP BY round_number, player_steam_id, player_name
    `;

    const taskResult = await client.query(taskQuery, [checksum, playerSteamId, roundNumber]);

    if (taskResult.rows.length === 0) {
      console.error('错误：未找到录制任务');
      await client.end();
      process.exit(1);
    }

    const task = taskResult.rows[0];
    console.log(`找到任务: Round ${task.round_number}, ${task.player_name}`);
    console.log(`  Tick 范围: ${task.video_start_tick}-${task.video_end_tick}`);
    console.log(`  总窗口数: ${task.total_windows}`);

    // 查询所有窗口的详细信息
    const windowsQuery = `
      SELECT
        id,
        window_idx,
        start_tick,
        end_tick,
        situation_text,
        events_json,
        pos_x, pos_y, pos_z,
        health, armor, weapon,
        is_moving, move_direction, move_speed
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      ORDER BY window_idx ASC
    `;

    const windowsResult = await client.query(windowsQuery, [checksum, playerSteamId, roundNumber]);
    const windows = windowsResult.rows;
    console.log(`✓ 查询到 ${windows.length} 个窗口`);

    // 获取 tickrate（从 matches 表查询，因为 demos 表可能为空）
    const demoQuery = await client.query(
      'SELECT tickrate FROM matches WHERE checksum = $1',
      [checksum]
    );

    if (demoQuery.rows.length === 0) {
      console.error('错误：未找到 demo');
      await client.end();
      process.exit(1);
    }

    const tickrate = demoQuery.rows[0].tickrate;
    const startTick = Number(task.video_start_tick);
    const endTick = Number(task.video_end_tick);

    // 计算理论帧数
    const videoDuration = (endTick - startTick) / tickrate;
    const theoreticalFrames = Math.ceil(videoDuration * 25);
    const expectedFrames = windows.length * framesPerWindow;

    console.log(`Tickrate: ${tickrate}`);
    console.log(`视频时长: ${videoDuration.toFixed(2)} 秒 (tick ${startTick} -> ${endTick})`);
    console.log(`理论帧数: ${theoreticalFrames} (视频时长 × 25fps)`);
    console.log(`期望帧数: ${expectedFrames} (${windows.length} 窗口 × ${framesPerWindow} 帧/窗口)`);
    if (theoreticalFrames !== expectedFrames) {
      console.log(`⚠️ 帧数差异: ${theoreticalFrames - expectedFrames} 帧`);
    }
    console.log('');

    // 2. 设置输出路径
    const outputRoot = customOutputRoot || 'F:/cs_data/traindata';

    // 从 demo 路径提取 demo 名称（不带扩展名）
    const demoBaseName = path.basename(demoPath, '.dem');

    // 新的目录结构：输出目录/demo名称/玩家名_玩家ID_round轮次
    const demoDir = path.join(outputRoot, demoBaseName);
    const outputFolder = `${task.player_name}_${playerSteamId}_round${roundNumber}`;
    const outputPath = path.join(demoDir, outputFolder);
    const tempVideoPath = path.join(outputPath, 'full_round.mp4');

    console.log(`输出目录: ${outputPath}`);
    await fs.mkdirp(outputPath);

    // 2.5. 检查数据完整性，如果已完整则跳过
    console.log('\n[检查] 检查现有数据完整性...');
    const framesDir = path.join(outputPath, 'frames');
    const dataJsonPath = path.join(outputPath, 'data.json');

    let isComplete = false;

    if (await fs.pathExists(outputPath)) {
        try {
            // 检查 full_round.mp4 是否存在且大小 > 0
            const videoExists = await fs.pathExists(tempVideoPath);
            const videoSize = videoExists ? (await fs.stat(tempVideoPath)).size : 0;

            // 检查 frames/ 目录是否存在且有文件
            const framesDirExists = await fs.pathExists(framesDir);
            let frameCount = 0;
            if (framesDirExists) {
                const frameFiles = await fs.readdir(framesDir);
                frameCount = frameFiles.filter(f => f.endsWith('.jpg')).length;
            }

            // 检查 data.json 是否存在且能解析
            let dataJson = null;
            if (await fs.pathExists(dataJsonPath)) {
                try {
                    const dataContent = await fs.readFile(dataJsonPath, 'utf-8');
                    dataJson = JSON.parse(dataContent);
                } catch (e) {
                    console.log(`  ⚠️ data.json 损坏，需要重新录制`);
                }
            }

            // 简化检查：只要视频存在、frames有文件、data.json可解析就认为完整
            if (videoExists && videoSize > 0 && frameCount > 0 && dataJson) {
                isComplete = true;
                console.log(`  ✓ 数据已存在：视频 ${(videoSize / 1024 / 1024).toFixed(2)}MB，${frameCount} 帧，${dataJson.windows?.length || 0} 个窗口`);
            } else {
                console.log(`  ⚠️ 数据缺失：video=${videoExists}(${(videoSize/1024/1024).toFixed(2)}MB), frames=${frameCount}, data.json=${!!dataJson}`);
            }
        } catch (err) {
            console.log(`  ⚠️ 检查失败: ${err.message}`);
        }
    } else {
        console.log(`  ⊙ 目录不存在，需要录制`);
    }

    if (isComplete) {
        console.log(`\n✓✓✓ 数据已存在，跳过录制\n`);
        console.log('>>> 任务结束。');
        process.exit(0);
    }

    console.log(`  → 开始录制...\n`);

    // 3. 使用官方 CLI + HLAE 录制完整回合视频
    console.log('\n[2/4] 使用 HLAE 录制完整回合视频...');
    console.log('⚠️ 这将启动 HLAE 和 CS2，请不要操作窗口');
    console.log('');

    console.log(`[DEBUG] 即将执行 HLAE, speed=${speed}, 类型=${typeof speed}`);
    console.log(`[DEBUG] CSDM 目录: ${csdmDir}`);
    console.log(`[DEBUG] 输出目录: ${outputPath}`);

    const hlaeCommand = [
      'node out/cli.js video',
      `"${demoPath}"`,
      startTick,
      endTick,
      '--recording-system HLAE',
      '--recording-output video',
      '--encoder-software FFmpeg',
      '--framerate 25',
      '--width 640',
      '--height 480',
      '--ffmpeg-video-codec libx264',
      '--ffmpeg-crf 23',
      '--ffmpeg-video-container mp4',
      `--output "${outputPath}"`,  // 添加输出路径参数
      `--focus-player ${playerSteamId}`,
      '--close-game-after-recording',
      '--no-concatenate-sequences',
      `--cfg "cl_draw_only_deathnotices 0; demo_timescale ${speed}; host_timescale ${speed}"`,
    ].join(' ');

    console.log('');
    console.log('[DEBUG] ========== 完整 HLAE 命令 ==========');
    console.log(hlaeCommand);
    console.log('[DEBUG] =====================================');
    console.log('');

    const startTime = Date.now();

    try {
      const { stdout, stderr } = await execAsync(hlaeCommand, {
        cwd: csdmDir,
        timeout: 600000,
        maxBuffer: 10 * 1024 * 1024,
      });

      console.log('[DEBUG] ========== HLAE STDOUT ==========');
      if (stdout) console.log(stdout);
      else console.log('(无输出)');
      console.log('[DEBUG] ================================');

      if (stderr) {
        console.log('[DEBUG] ========== HLAE STDERR ==========');
        console.error(stderr);
        console.log('[DEBUG] ==================================');
      }

    } catch (error) {
      console.error('');
      console.error('='.repeat(60));
      console.error('[ERROR] HLAE 录制失败!');
      console.error('='.repeat(60));
      console.error('错误类型:', error.constructor.name);
      console.error('错误信息:', error.message);
      console.error('');
      console.error('[DEBUG] ========== HLAE STDOUT ==========');
      console.error(error.stdout || '(无输出)');
      console.error('[DEBUG] ================================');
      console.error('');
      console.error('[DEBUG] ========== HLAE STDERR ==========');
      console.error(error.stderr || '(无输出)');
      console.error('[DEBUG] ==================================');
      console.error('');

      // 详细列出可能的输出目录内容
      console.error('[DEBUG] ========== 目录内容检查 ==========');
      const dirsToCheck = [
        { name: '指定输出目录', path: outputPath },
        { name: 'Demo 所在目录', path: path.dirname(demoPath) },
        { name: 'CSDM 目录', path: csdmDir },
        { name: '.csdm/output', path: path.join(process.env.USERPROFILE, '.csdm', 'output') },
        { name: '.csdm-dev/output', path: path.join(process.env.USERPROFILE, '.csdm-dev', 'output') },
        { name: '.csdm/hlae-temp', path: path.join(process.env.USERPROFILE, '.csdm', 'hlae-temp') },
        { name: '.csdm-dev/hlae-temp', path: path.join(process.env.USERPROFILE, '.csdm-dev', 'hlae-temp') },
      ];

      for (const dir of dirsToCheck) {
        console.error(`\n[${dir.name}] ${dir.path}`);
        try {
          if (await fs.pathExists(dir.path)) {
            const files = await fs.readdir(dir.path);
            if (files.length === 0) {
              console.error('  (空目录)');
            } else {
              // 显示最近修改的文件（最多20个）
              const fileInfos = [];
              for (const f of files.slice(0, 30)) {
                try {
                  const fullPath = path.join(dir.path, f);
                  const stat = await fs.stat(fullPath);
                  const ageMin = Math.round((Date.now() - stat.mtimeMs) / 60000);
                  fileInfos.push({
                    name: f,
                    isDir: stat.isDirectory(),
                    size: stat.size,
                    ageMin
                  });
                } catch (e) {
                  fileInfos.push({ name: f, error: e.message });
                }
              }
              // 按修改时间排序
              fileInfos.sort((a, b) => (a.ageMin || 9999) - (b.ageMin || 9999));
              for (const fi of fileInfos.slice(0, 20)) {
                if (fi.error) {
                  console.error(`  ${fi.name} (错误: ${fi.error})`);
                } else if (fi.isDir) {
                  console.error(`  [DIR] ${fi.name} (${fi.ageMin}分钟前)`);
                } else {
                  const sizeMB = (fi.size / 1024 / 1024).toFixed(2);
                  console.error(`  ${fi.name} (${sizeMB}MB, ${fi.ageMin}分钟前)`);
                }
              }
              if (files.length > 20) {
                console.error(`  ... 还有 ${files.length - 20} 个文件/目录`);
              }
            }
          } else {
            console.error('  (目录不存在)');
          }
        } catch (e) {
          console.error(`  (读取失败: ${e.message})`);
        }
      }
      console.error('[DEBUG] =====================================');

      await client.end();
      process.exit(1);
    }

    const recordTime = Date.now() - startTime;
    console.log(`✓ HLAE 录制完成，耗时 ${(recordTime / 1000).toFixed(1)} 秒`);
    console.log('');

    // 4. 查找生成的视频文件
    console.log('[3/4] 查找生成的视频文件...');
    console.log('[DEBUG] 开始搜索视频文件...');

    let sourceVideoPath = null;

    // 优先搜索输出目录（我们指定的输出位置）
    console.log(`[DEBUG] 指定输出目录: ${outputPath}`);

    // 同时也搜索其他可能的输出位置
    const demoDirPath = path.dirname(demoPath);
    const searchPaths = [
      outputPath,  // 最优先：我们指定的输出目录
      demoDirPath,     // Demo 所在目录
      path.join(process.env.USERPROFILE, '.csdm', 'output'),
      path.join(process.env.USERPROFILE, '.csdm-dev', 'output'),
      path.join(process.env.USERPROFILE, '.csdm', 'hlae-temp'),
      path.join(process.env.USERPROFILE, '.csdm-dev', 'hlae-temp'),
      'D:/cs_videos',
    ];

    let newestTime = 0;
    let allFoundVideos = []; // 记录所有找到的视频

    for (const basePath of searchPaths) {
      console.log(`[DEBUG] 搜索目录: ${basePath}`);
      if (await fs.pathExists(basePath)) {
        // 查找所有 mp4/avi 文件
        // 递归查找可能会很慢，这里只查找第一层和第二层子目录
        try {
            const files = await fs.readdir(basePath, { withFileTypes: true });

            for (const file of files) {
                let fullPath = path.join(basePath, file.name);

                // 如果是文件
                if (file.isFile() && (file.name.endsWith('.mp4') || file.name.endsWith('.avi'))) {
                    // 检查是否是刚刚生成的（10分钟内）
                    const stats = await fs.stat(fullPath);
                    const ageMin = Math.round((Date.now() - stats.mtimeMs) / 60000);
                    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

                    allFoundVideos.push({
                      path: fullPath,
                      size: sizeMB,
                      ageMin,
                      recent: ageMin < 10
                    });

                    if (Date.now() - stats.mtimeMs < 10 * 60 * 1000) {
                        if (stats.mtimeMs > newestTime) {
                            newestTime = stats.mtimeMs;
                            sourceVideoPath = fullPath;
                        }
                    }
                }
                // 如果是目录，进入一层查找
                else if (file.isDirectory()) {
                     try {
                        const subFiles = await fs.readdir(fullPath);
                        for (const subFile of subFiles) {
                             if (subFile.endsWith('.mp4') || subFile.endsWith('.avi')) {
                                 const subFullPath = path.join(fullPath, subFile);
                                 const stats = await fs.stat(subFullPath);
                                 const ageMin = Math.round((Date.now() - stats.mtimeMs) / 60000);
                                 const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

                                 allFoundVideos.push({
                                   path: subFullPath,
                                   size: sizeMB,
                                   ageMin,
                                   recent: ageMin < 10
                                 });

                                 if (Date.now() - stats.mtimeMs < 10 * 60 * 1000) {
                                     if (stats.mtimeMs > newestTime) {
                                         newestTime = stats.mtimeMs;
                                         sourceVideoPath = subFullPath;
                                     }
                                 }
                             }
                        }
                     } catch(e) {
                        console.log(`[DEBUG]   子目录 ${file.name} 读取失败: ${e.message}`);
                     }
                }
            }
        } catch(e) {
            console.log(`[DEBUG]   跳过目录: ${e.message}`);
        }
      } else {
        console.log(`[DEBUG]   目录不存在`);
      }
    }

    // 打印所有找到的视频
    console.log('[DEBUG] ========== 找到的所有视频文件 ==========');
    if (allFoundVideos.length === 0) {
      console.log('[DEBUG] 未找到任何视频文件!');
    } else {
      allFoundVideos.sort((a, b) => a.ageMin - b.ageMin);
      for (const v of allFoundVideos) {
        const marker = v.recent ? '[RECENT]' : '        ';
        const selected = v.path === sourceVideoPath ? ' <-- 选中' : '';
        console.log(`[DEBUG] ${marker} ${v.path} (${v.size}MB, ${v.ageMin}分钟前)${selected}`);
      }
    }
    console.log('[DEBUG] ===========================================');

    if (!sourceVideoPath) {
      console.error('');
      console.error('='.repeat(60));
      console.error('[ERROR] 未找到 HLAE 生成的视频文件!');
      console.error('='.repeat(60));
      console.error('');
      console.error('可能原因:');
      console.error('1. HLAE 录制失败，未生成视频');
      console.error('2. 视频生成在预期之外的位置');
      console.error('3. 录制时间超过10分钟，文件被视为"旧文件"跳过');
      console.error('');
      console.error('请检查以下目录:');
      for (const p of searchPaths) {
        console.error(`  - ${p}`);
      }
      await client.end();
      process.exit(1);
    }

    console.log(`✓ 找到最新视频: ${sourceVideoPath}`);

    // 移动到目标位置
    await fs.copy(sourceVideoPath, tempVideoPath, { overwrite: true });
    console.log(`✓ 视频已复制到: ${tempVideoPath}`);

    const videoStats = await fs.stat(tempVideoPath);
    const videoSizeMB = (videoStats.size / 1024 / 1024).toFixed(2);
    console.log(`  视频大小: ${videoSizeMB} MB`);
    console.log('');

    // 5. 将视频转换为图片序列 (模拟方案 A)
    console.log('[4/4] 将视频转换为 JPG 图片序列...');
    await fs.mkdirp(framesDir);

    // 使用 python 脚本来提取帧 (因为 environment可能有 opencv)
    const extractScript = `
import cv2
import os
import sys

video_path = r"${tempVideoPath}"
output_dir = r"${framesDir}"

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error: Could not open video")
    sys.exit(1)

frame_idx = 1
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize to 640x480 if needed
    if frame.shape[1] != 640 or frame.shape[0] != 480:
        frame = cv2.resize(frame, (640, 480))

    output_path = os.path.join(output_dir, f"frame_{frame_idx:04d}.jpg")
    cv2.imwrite(output_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 90])

    if frame_idx % 100 == 0:
        print(f"Extracted {frame_idx} frames...")

    frame_idx += 1

cap.release()
print(f"Total frames extracted: {frame_idx-1}")
    `;

    const extractScriptPath = path.join(outputPath, 'extract_frames.py');
    await fs.writeFile(extractScriptPath, extractScript);

    // 尝试寻找 python 环境
    let pythonCmd = 'python';
    // 优先尝试 cs2demo 环境
    const condaEnvPath = path.join(process.env.USERPROFILE, '.conda', 'envs', 'cs2demo', 'python.exe');
    if (await fs.pathExists(condaEnvPath)) {
        pythonCmd = `"${condaEnvPath}"`;
    }

    console.log(`执行帧提取脚本 (使用 ${pythonCmd})...`);
    try {
        await execAsync(`${pythonCmd} "${extractScriptPath}"`);
    } catch (e) {
        console.error('帧提取失败:', e.message);
        // 如果 python 失败，尝试 ffmpeg
        console.log('尝试使用 ffmpeg...');
        await execAsync(`"${FFMPEG_PATH}" -i "${tempVideoPath}" -q:v 2 -vf scale=640:480 "${path.join(framesDir, 'frame_%04d.jpg')}"`);
    }

    // 清理脚本
    await fs.remove(extractScriptPath);

    // 统计生成的图片数量
    const frameFiles = await fs.readdir(framesDir);
    const totalFrames = frameFiles.filter(f => f.endsWith('.jpg')).length;
    console.log(`✓ 已生成 ${totalFrames} 张图片`);

    // 验证帧数 (expectedFrames 已在前面定义)
    if (totalFrames < expectedFrames) {
      console.warn(`⚠️ 警告: 帧数不足! 期望 ${expectedFrames} 帧 (${windows.length} 窗口 × ${framesPerWindow} 帧), 实际 ${totalFrames} 帧`);
      console.warn(`   这可能导致数据不对应，建议检查录制参数`);
    } else if (totalFrames > expectedFrames) {
      console.log(`   (期望 ${expectedFrames} 帧，多出 ${totalFrames - expectedFrames} 帧将被忽略)`);
    }

    // 6. 生成 data.json (标准格式)
    console.log('生成 data.json...');

    const dataJson = {
      demo_checksum: checksum,
      player_name: task.player_name,
      player_steam_id: playerSteamId,
      round_number: roundNumber,
      tickrate: tickrate,
      total_windows: windows.length,
      total_frames: totalFrames,

      // 不设置 storage_mode，默认为标准图片模式
      // storage_mode: 'frames',

      windows: windows.map((w, index) => {
        // 按时间偏移计算帧索引（更准确）
        // start_tick 在视频中的时间 = (w.start_tick - startTick) / tickrate
        // 对应的帧号 = floor(time * fps) + 1
        const timeOffset = (Number(w.start_tick) - startTick) / tickrate;
        const startFrameIdx = Math.floor(timeOffset * 25) + 1;

        // 调试信息（前3个和最后1个窗口）
        if (index < 3 || index === windows.length - 1) {
          console.log(`  窗口${index}: tick ${w.start_tick}-${w.end_tick}, 时间偏移 ${timeOffset.toFixed(3)}s, 帧 ${startFrameIdx}-${startFrameIdx + framesPerWindow - 1}`);
        } else if (index === 3) {
          console.log(`  ... (省略 ${windows.length - 4} 个窗口)`);
        }

        // 构建 framesPerWindow 帧的路径
        const framePaths = [];
        for (let i = 0; i < framesPerWindow; i++) {
            const frameNum = startFrameIdx + i;
            const frameName = `frame_${String(frameNum).padStart(4, '0')}.jpg`;
            framePaths.push(`${outputFolder}/frames/${frameName}`);
        }

        // 动态计算 middle_frames 的范围
        // 如果帧数为4: start(0), middle(1,2), end(3)
        // 如果帧数为10: start(0), middle(1-8), end(9)
        const midFrames = framePaths.slice(1, framesPerWindow - 1);

        return {
          window_index: w.window_idx,
          start_tick: w.start_tick,
          end_tick: w.end_tick,

          // 标准图片路径格式
          start_frame: framePaths[0],
          middle_frames: midFrames,
          end_frame: framePaths[framesPerWindow - 1],

          // 情况描述
          situation: w.situation_text,

          // 事件
          events: w.events_json || "[]",

          // 玩家状态
          player_state: {
            position: {
              x: w.pos_x,
              y: w.pos_y,
              z: w.pos_z
            },
            health: w.health,
            armor: w.armor,
            weapon: w.weapon,
            is_moving: w.is_moving,
            move_direction: w.move_direction,
            move_speed: w.move_speed
          }
        };
      })
    };

    await fs.writeJSON(dataJsonPath, dataJson, { spaces: 2 });
    console.log(`✓ data.json 已生成`);

    await client.end();

    // 7. 统计信息
    console.log('\n' + '='.repeat(80));
    console.log('✓ HLAE 录制 + 图片转换完成');
    console.log('='.repeat(80));
    console.log(`输出目录: ${outputPath}`);
    console.log(`  - 图片数量: ${totalFrames}`);
    console.log(`  - 录制耗时: ${(recordTime / 1000).toFixed(1)} 秒`);
    console.log('');

    // 可选：删除原始视频以节省空间
    // await fs.remove(tempVideoPath);

  } catch (error) {
    console.error('\n错误:', error.message);
    console.error(error.stack);

    // 清理不完整的数据
    if (outputPath && await fs.pathExists(outputPath)) {
      const dataJsonExists = await fs.pathExists(path.join(outputPath, 'data.json'));
      const framesDir = path.join(outputPath, 'frames');
      const framesExist = await fs.pathExists(framesDir);
      let frameCount = 0;
      if (framesExist) {
        const files = await fs.readdir(framesDir);
        frameCount = files.filter(f => f.endsWith('.jpg')).length;
      }

      // 如果 data.json 不存在或帧数为 0，删除整个目录
      if (!dataJsonExists || frameCount === 0) {
        console.log(`\n[cleanup] 清理不完整的数据目录: ${outputPath}`);
        try {
          await fs.remove(outputPath);
          console.log('✓ 已删除');
        } catch (e) {
          console.error(`✗ 删除失败: ${e.message}`);
        }
      }
    }

    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

main();
