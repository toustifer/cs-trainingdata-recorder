const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// 禁用 GPU 加速（解决某些机器上窗口不显示的问题）
app.disableHardwareAcceleration();

// 关键：手动补全模块搜索路径，让主进程能找到外部的 node_modules
const isPackaged = app.isPackaged;
const baseDir = isPackaged ? path.join(process.resourcesPath, 'app') : __dirname;
module.paths.push(path.join(baseDir, 'node_modules'));

let mainWindow;

// 全局进程追踪
const activeProcesses = new Set();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 900,
    title: "CS2 Training Data Reaper Pro",
    backgroundColor: "#121212",
    show: false, // 先隐藏，加载完成后再显示
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  // 加载完成后显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 错误处理
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.loadFile('index.html').catch(err => {
    console.error('loadFile error:', err);
    dialog.showErrorBox('启动错误', `无法加载界面: ${err.message}`);
  });
}

app.whenReady().then(createWindow);

// 处理配置持久化
const CONFIG_PATH = path.join(app.getPath('documents'), 'cs2_reaper_settings.json');
ipcMain.handle('load-config', () => {
  try { if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch (e) {}
  return null;
});
ipcMain.handle('save-config', (event, config) => {
  try { fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8'); } catch (e) {}
});

ipcMain.handle('select-dir', async (event, defaultPath) => {
  const options = { properties: ['openDirectory'] };
  if (defaultPath && fs.existsSync(defaultPath)) {
    options.defaultPath = defaultPath;
  }
  const result = await dialog.showOpenDialog(options);
  return result.filePaths[0];
});

ipcMain.handle('open-config-folder', () => {
  const { shell } = require('electron');
  const configDir = path.dirname(CONFIG_PATH);
  shell.openPath(configDir);
});

// 新增：扫描 demo 文件
ipcMain.handle('scan-demos', async (event, dirPath) => {
  try {
    const glob = require('fast-glob');
    const demos = await glob('**/*.dem', { cwd: dirPath, absolute: true });
    return demos;
  } catch (e) {
    return [];
  }
});

// 新增：检查录制进度
ipcMain.handle('check-recording-progress', async (event, config) => {
  const { demoPath, outputDir, dbUser, dbPass } = config;
  const { Client } = require('pg');

  // 定义日志函数，通过 mainWindow 发送
  const log = (msg) => {
    console.log(msg);
    if (mainWindow) {
      mainWindow.webContents.send('process-log', msg + '\n');
    }
  };

  log('[DEBUG] check-recording-progress started');
  log('[DEBUG] demoPath: ' + demoPath);
  log('[DEBUG] outputDir: ' + outputDir);

  try {
    // 1. 连接数据库
    const pgClient = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: dbUser,
      password: dbPass,
      database: 'csdm'
    });
    await pgClient.connect();

    try {
      // 2. 获取demo的checksum
      const demoName = path.basename(demoPath);
      log('[DEBUG] demoName: ' + demoName);

      const checksumResult = await pgClient.query(
        `SELECT checksum FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
        [`%${demoName}`]
      );

      if (checksumResult.rows.length === 0) {
        log('[DEBUG] No checksum found in database');
        return { error: '数据库中未找到此demo' };
      }

      const checksum = checksumResult.rows[0].checksum;
      log('[DEBUG] checksum: ' + checksum);

      // 3. 查询所有玩家和回合
      const windowsResult = await pgClient.query(
        `SELECT DISTINCT player_steam_id, player_name, round_number
         FROM training_windows
         WHERE match_checksum = $1
         ORDER BY player_steam_id, round_number`,
        [checksum]
      );

      log('[DEBUG] Found ' + windowsResult.rows.length + ' training windows in database');

      // 4. 按玩家分组统计
      const playerMap = new Map();
      for (const row of windowsResult.rows) {
        const steamId = row.player_steam_id;
        if (!playerMap.has(steamId)) {
          playerMap.set(steamId, {
            name: row.player_name,
            steamId: steamId,
            rounds: []
          });
        }
        playerMap.get(steamId).rounds.push(row.round_number);
      }

      log('[DEBUG] playerMap size: ' + playerMap.size);

      // 5. 扫描实际的demo文件夹
      const demoFolderName = path.basename(demoPath, '.dem');
      const demoFolder = path.join(outputDir, demoFolderName);

      log('[DEBUG] demoFolderName: ' + demoFolderName);
      log('[DEBUG] demoFolder: ' + demoFolder);
      log('[DEBUG] demoFolder exists: ' + fs.existsSync(demoFolder));

      // 扫描所有子文件夹
      const glob = require('fast-glob');
      let actualFolders = [];
      if (fs.existsSync(demoFolder)) {
        actualFolders = await glob('*', { cwd: demoFolder, onlyDirectories: true, absolute: false });
        log('[DEBUG] Found ' + actualFolders.length + ' folders in demo directory');
        log('[DEBUG] First 5 folders: ' + JSON.stringify(actualFolders.slice(0, 5)));
      }

      // 6. 检查每个玩家的完成情况
      const results = [];

      // 先统计数据库中的玩家
      for (const [steamId, playerData] of playerMap) {
        log('[DEBUG] Checking DB player: ' + playerData.name + ' ' + steamId);
        let completedRounds = 0;
        const incompleteRounds = [];

        for (const roundNum of playerData.rounds) {
          // 在实际文件夹中查找匹配的文件夹（格式：*_steamId_roundN）
          const matchingFolders = actualFolders.filter(f => {
            const match = f.match(/^(.+)_(\d{17})_round(\d+)$/);
            if (match) {
              const [, , folderSteamId, folderRound] = match;
              return folderSteamId === steamId && parseInt(folderRound) === roundNum;
            }
            return false;
          });

          if (matchingFolders.length > 0) {
            // 找到匹配的文件夹，检查数据完整性
            const folderPath = path.join(demoFolder, matchingFolders[0]);

            // 视频可能是 video.mp4 或 full_round.mp4
            const videoPath = fs.existsSync(path.join(folderPath, 'video.mp4'))
              ? path.join(folderPath, 'video.mp4')
              : path.join(folderPath, 'full_round.mp4');

            const framesDir = path.join(folderPath, 'frames');
            const dataJsonPath = path.join(folderPath, 'data.json');

            let isComplete = false;
            try {
              const videoExists = fs.existsSync(videoPath);
              const videoSize = videoExists ? fs.statSync(videoPath).size : 0;
              const frameFiles = fs.existsSync(framesDir) ? fs.readdirSync(framesDir) : [];
              // 支持 .png 和 .jpg 格式
              const frameCount = frameFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).length;
              const dataJsonExists = fs.existsSync(dataJsonPath);

              log(`[DEBUG] Round ${roundNum}: video=${videoExists}(${videoSize}B), frames=${frameCount}, data.json=${dataJsonExists}`);

              if (videoExists && videoSize > 0 && frameCount > 0 && dataJsonExists) {
                isComplete = true;
              }
            } catch (err) {
              // 检查失败视为未完成
              log(`[DEBUG] Check failed for round ${roundNum}: ${err.message}`);
            }

            if (isComplete) {
              completedRounds++;
            } else {
              incompleteRounds.push(roundNum);
            }
          } else {
            incompleteRounds.push(roundNum);
          }
        }

        results.push({
          name: playerData.name,
          steamId: steamId,
          completedRounds: completedRounds,
          totalRounds: playerData.rounds.length,
          incompleteRounds: incompleteRounds
        });
      }

      // 再扫描实际文件夹中的玩家（数据库中可能没有的）
      const foldersPlayerMap = new Map();
      for (const folder of actualFolders) {
        const match = folder.match(/^(.+)_(\d{17})_round(\d+)$/);
        if (match) {
          const [, playerName, steamId, roundNum] = match;

          // 如果数据库中已经有这个玩家，跳过
          if (playerMap.has(steamId)) continue;

          if (!foldersPlayerMap.has(steamId)) {
            foldersPlayerMap.set(steamId, {
              name: playerName,
              steamId: steamId,
              rounds: new Set()
            });
          }
          foldersPlayerMap.get(steamId).rounds.add(parseInt(roundNum));
        }
      }

      log('[DEBUG] Found ' + foldersPlayerMap.size + ' additional players in folders (not in DB)');

      // 统计文件夹中的玩家
      for (const [steamId, playerData] of foldersPlayerMap) {
        log('[DEBUG] Checking folder-only player: ' + playerData.name + ' ' + steamId);
        let completedRounds = 0;
        const roundsList = Array.from(playerData.rounds).sort((a, b) => a - b);
        const incompleteRounds = [];

        for (const roundNum of roundsList) {
          const folderName = actualFolders.find(f => {
            const match = f.match(/^(.+)_(\d{17})_round(\d+)$/);
            if (match) {
              const [, , folderSteamId, folderRound] = match;
              return folderSteamId === steamId && parseInt(folderRound) === roundNum;
            }
            return false;
          });

          if (folderName) {
            const folderPath = path.join(demoFolder, folderName);

            // 视频可能是 video.mp4 或 full_round.mp4
            const videoPath = fs.existsSync(path.join(folderPath, 'video.mp4'))
              ? path.join(folderPath, 'video.mp4')
              : path.join(folderPath, 'full_round.mp4');

            const framesDir = path.join(folderPath, 'frames');
            const dataJsonPath = path.join(folderPath, 'data.json');

            let isComplete = false;
            try {
              const videoExists = fs.existsSync(videoPath);
              const videoSize = videoExists ? fs.statSync(videoPath).size : 0;
              const frameFiles = fs.existsSync(framesDir) ? fs.readdirSync(framesDir) : [];
              // 支持 .png 和 .jpg 格式
              const frameCount = frameFiles.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).length;
              const dataJsonExists = fs.existsSync(dataJsonPath);

              log(`[DEBUG] Round ${roundNum}: video=${videoExists}(${videoSize}B), frames=${frameCount}, data.json=${dataJsonExists}`);

              if (videoExists && videoSize > 0 && frameCount > 0 && dataJsonExists) {
                isComplete = true;
              }
            } catch (err) {
              // 检查失败视为未完成
              log(`[DEBUG] Check failed for round ${roundNum}: ${err.message}`);
            }

            if (isComplete) {
              completedRounds++;
            } else {
              incompleteRounds.push(roundNum);
            }
          }
        }

        results.push({
          name: playerData.name,
          steamId: steamId,
          completedRounds: completedRounds,
          totalRounds: roundsList.length,
          incompleteRounds: incompleteRounds
        });
      }

      log('[DEBUG] Final results: ' + JSON.stringify(results, null, 2));
      return { players: results };
    } finally {
      await pgClient.end();
    }
  } catch (err) {
    log('[DEBUG] Error: ' + err.message);
    return { error: err.message };
  }
});

// 打开文件夹
ipcMain.handle('open-folder', async (event, folderPath) => {
  const { shell } = require('electron');
  try {
    await shell.openPath(folderPath);
    return { success: true };
  } catch (err) {
    console.error('Failed to open folder:', err);
    return { error: err.message };
  }
});

// 新增：获取Demo的所有训练数据文件夹
ipcMain.handle('get-demo-folders', async (event, config) => {
  const { demoPath, outputDir } = config;

  try {
    // 使用demo文件名作为文件夹名
    const demoName = path.basename(demoPath, '.dem');
    const demoFolder = path.join(outputDir, demoName);

    console.log('[DEBUG] Looking for demo folder:', demoFolder);

    // 检查demo文件夹是否存在
    if (!fs.existsSync(demoFolder)) {
      console.log('[DEBUG] Demo folder not found');
      return { error: '未找到该 Demo 的训练数据文件夹，请先执行"2. 启动录制收割"' };
    }

    // 扫描demo文件夹下的所有子文件夹
    const glob = require('fast-glob');
    const pattern = '*';
    const folders = await glob(pattern, { cwd: demoFolder, onlyDirectories: true, absolute: true });

    console.log('[DEBUG] Found subfolders:', folders.length);

    if (folders.length === 0) {
      return { error: '该 Demo 文件夹为空' };
    }

    // 验证每个文件夹是否包含有效数据
    const validFolders = [];
    for (const folderPath of folders) {
      const dataJsonPath = path.join(folderPath, 'data.json');
      if (fs.existsSync(dataJsonPath)) {
        validFolders.push({
          name: path.basename(folderPath),
          path: folderPath
        });
      }
    }

    if (validFolders.length === 0) {
      return { error: '未找到有效的训练数据（缺少 data.json）' };
    }

    // 排序：按玩家和回合号排序
    validFolders.sort((a, b) => {
      // 文件夹格式: playerName_steamId_roundN
      const aMatch = a.name.match(/_(\d+)_round(\d+)$/);
      const bMatch = b.name.match(/_(\d+)_round(\d+)$/);

      if (aMatch && bMatch) {
        const aSteamId = aMatch[1];
        const bSteamId = bMatch[1];
        const aRound = parseInt(aMatch[2]);
        const bRound = parseInt(bMatch[2]);

        // 先按玩家排序，再按回合号排序
        if (aSteamId !== bSteamId) {
          return aSteamId.localeCompare(bSteamId);
        }
        return aRound - bRound;
      }
      return a.name.localeCompare(b.name);
    });

    console.log('[DEBUG] Valid folders:', validFolders.length);
    return { folders: validFolders };
  } catch (err) {
    console.error('[DEBUG] Error:', err);
    return { error: err.message };
  }
});

function runProc(cmd, args, options, event, onData) {
    return new Promise((resolve) => {
        const p = spawn(cmd, args, options);

        // 追踪进程
        activeProcesses.add(p);

        p.stdout.on('data', (d) => {
            const str = d.toString();
            event.reply('process-log', str);
            if (onData) onData(str);
        });
        p.stderr.on('data', (d) => event.reply('process-log', d.toString()));
        p.on('close', () => {
            // 进程结束时移除追踪
            activeProcesses.delete(p);
            resolve();
        });
    });
}

// 按钮 1：批量分析并提取玩家列表
ipcMain.on('start-analysis', async (event, config) => {
  const glob = require('fast-glob');
  const { demoDir, selectedFile, rounds, dbUser, dbPass, forceReanalyze } = config;
  const env = { ...process.env, NODE_PATH: path.join(baseDir, 'node_modules'), POSTGRES_USER: dbUser, POSTGRES_PASSWORD: dbPass };

  if (forceReanalyze) {
    event.reply('process-log', `>>> 强制重新导出模式已启用\n`);
  }

  // 确定要处理的文件列表
  let demos;
  if (selectedFile) {
    demos = [selectedFile]; // 单文件
  } else {
    demos = await glob('**/*.dem', { cwd: demoDir, absolute: true }); // 全部文件
  }

  event.reply('process-log', `>>> 扫描到 ${demos.length} 个文件，开始分析...\n`);

  // 创建数据库连接用于清理旧记录
  const { Client } = require('pg');
  const pgClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: dbUser,
    password: dbPass,
    database: 'csdm'
  });
  await pgClient.connect();

  // 智能清理策略：只清理 training_windows 为空的 demo
  // 有数据的 demo 会被 CLI 的 --force 参数处理，不需要手动清理
  // 依靠 fallback 机制处理数据库问题
  event.reply('process-log', `>>> 检查 training_windows 表...\n`);
  let cleanupCount = 0;

  try {
    for (const demoPath of demos) {
      const demoName = path.basename(demoPath);

      // 查询 matches 表
      const checksumResult = await pgClient.query(
        `SELECT checksum FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
        [`%${demoName}`]
      );

      if (checksumResult.rows.length > 0) {
        const checksum = checksumResult.rows[0].checksum;

        // 检查 training_windows 是否有数据
        const windowsResult = await pgClient.query(
          `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1`,
          [checksum]
        );

        // 只清理 training_windows 为空的 demo（说明之前分析失败）
        // 删除 matches 记录，让 CLI 认为是新 demo，自动重新分析
        if (windowsResult.rows[0].count == 0) {
          try {
            // 删除 matches 记录（CASCADE 会自动删除 training_windows）
            await pgClient.query(`DELETE FROM matches WHERE checksum = $1`, [checksum]);
            cleanupCount++;
          } catch (delErr) {
            event.reply('process-log', `  ⚠️ 清理 ${demoName} 失败: ${delErr.message}\n`);
          }
        }
      }
    }

    if (cleanupCount > 0) {
      event.reply('process-log', `  ✓ 清理了 ${cleanupCount} 个未完成的 demo\n`);
    } else {
      event.reply('process-log', `  ✓ 所有 demo 数据完整\n`);
    }
  } catch (err) {
    event.reply('process-log', `  ⚠️ 检查失败: ${err.message}\n`);
  }

  event.reply('process-log', `>>> 开始智能分析...\n`);

  try {
    for (let i = 0; i < demos.length; i++) {
      const demoPath = demos[i];
      const fileName = path.basename(demoPath);
      event.reply('process-log', `\n[${i+1}/${demos.length}] 分析: ${fileName}\n`);
      event.reply('file-status-update', { file: demoPath, status: '分析中...' });

      let cliOutput = '';
      // 构建CLI参数
      const cliArgs = ['out/cli.js', 'training-data', demoPath];

      // 关键修复：必须传递 rounds 参数，否则不会生成训练窗口数据
      if (rounds) {
        cliArgs.push('--rounds', rounds);
      } else {
        // 如果用户没有指定，默认分析所有回合
        cliArgs.push('--rounds', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');
      }

      // 不使用 --force 参数，让 CLI 智能判断：
      // - training_windows 为空的 demo 已被清理 (matches 记录已删除) → CLI 认为是新 demo → 自动分析
      // - training_windows 有数据的 demo → CLI 跳过 (已在数据库中)
      // 如果需要强制重新分析，请先清空数据库

      // 不使用 --list-players，因为它会跳过 training_windows 的生成

      await runProc('node', cliArgs, { cwd: baseDir, env }, event, (data) => {
        cliOutput += data;
      });

      // 解析玩家列表
      const players = [];
      let roundsCount = 0;
      const lines = cliOutput.split('\n');
      let capture = false;
      let lastPlayerName = null;
      for (const line of lines) {
        if (line.includes('Players (')) {
          capture = true;
          continue;
        }
        if (capture) {
          if (line.trim().startsWith('Rounds:')) {
            roundsCount = line.split(':')[1].trim();
            break;
          }
          // 匹配玩家名行：两个空格开头
          if (line.startsWith('  ') && !line.startsWith('    ') && !line.includes('──────')) {
            lastPlayerName = line.trim();
          }
          // 匹配 Steam ID 行：四个空格开头
          else if (line.startsWith('    Steam ID:') && lastPlayerName) {
            const steamId = line.split(':')[1].trim();
            // 组合格式：Name [ID]
            players.push(`${lastPlayerName} [${steamId}]`);
            lastPlayerName = null;
          }
        }
      }

      event.reply('file-status-update', {
        file: demoPath,
        status: '完成',
        players: players.length > 0 ? players : ['未找到玩家信息'],
        rounds: roundsCount
      });
    }
  } finally {
    await pgClient.end();
  }
  event.reply('process-complete', 0);
});
    // 新增：静默批量查询玩家信息（自动触发）
ipcMain.on('quick-scan-players', async (event, config) => {
    const { files, dbUser, dbPass } = config;
    if (!files || files.length === 0) return;

    const env = { ...process.env, NODE_PATH: path.join(baseDir, 'node_modules'), POSTGRES_USER: dbUser, POSTGRES_PASSWORD: dbPass };

    // 我们一次性把所有文件传给 CLI，这比一个个生成进程快得多
    // 注意：Windows 命令行长度有限制，如果文件太多可能需要分批，这里暂定一次 20 个
    const BATCH_SIZE = 20;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batchFiles = files.slice(i, i + BATCH_SIZE);
        const args = ['out/cli.js', 'training-data', ...batchFiles, '--list-players'];

        let currentFile = null;
        let currentPlayers = []; // 关键修复：在这里初始化
        let capturing = false;
        let lastPlayerName = null; // 新增状态追踪

        await runProc('node', args, { cwd: baseDir, env }, event, (chunk) => {
            const lines = chunk.split(/\r?\n/);
            for (const line of lines) {
                // 1. 识别当前正在处理哪个文件
                if (line.startsWith('Processing: ')) {
                    // 如果之前有正在处理的文件，先结算
                    if (currentFile && currentPlayers.length > 0) {
                        event.reply('file-status-update', { file: currentFile, status: '已缓存', players: currentPlayers });
                    }
                    currentFile = line.replace('Processing: ', '').trim();
                    currentPlayers = [];
                    capturing = false;
                    lastPlayerName = null;
                    
                    // 初始状态更新
                    event.reply('file-status-update', { file: currentFile, status: '查询中...' });
                }
                
                // 2. 识别是否在数据库中
                if (line.includes('Demo already in database')) {
                     event.reply('file-status-update', { file: currentFile, status: '已入库' });
                }

                // 3. 捕捉玩家块
                if (line.includes('Players (')) {
                    capturing = true;
                    continue;
                }
                
                if (line.startsWith('Rounds:')) {
                    capturing = false;
                    const roundsCount = line.split(':')[1].trim();
                    // 遇到 Rounds 说明当前文件结束，发送数据
                    if (currentFile) {
                        event.reply('file-status-update', { 
                            file: currentFile, 
                            status: '已就绪', 
                            players: currentPlayers.length > 0 ? currentPlayers : ['未找到玩家'],
                            rounds: roundsCount
                        });
                        // 清空以避免重复发送
                        currentPlayers = [];
                        currentFile = null; 
                        lastPlayerName = null;
                    }
                }

                if (capturing) {
                     // 匹配玩家名行：两个空格开头
                     if (line.startsWith('  ') && !line.startsWith('    ') && !line.includes('──────')) {
                        lastPlayerName = line.trim();
                     }
                     // 匹配 Steam ID 行：四个空格开头
                     else if (line.startsWith('    Steam ID:') && lastPlayerName) {
                        const steamId = line.split(':')[1].trim();
                        // 组合格式：Name [ID]
                        currentPlayers.push(`${lastPlayerName} [${steamId}]`);
                        lastPlayerName = null;
                     }
                }
            }
        });
        
        // 批次结束兜底：如果最后一个文件没有遇到 Rounds: 就结束了（不太可能，但为了保险）
        if (currentFile && currentPlayers.length > 0) {
             event.reply('file-status-update', { file: currentFile, status: '已就绪', players: currentPlayers });
        }
    }
});


// 按钮 2：完整收割
ipcMain.on('start-process', async (event, config) => {
  const glob = require('fast-glob');
  const { demoDir, selectedFile, rounds, playerSteamId, dbUser, dbPass, speed, outputDir, framesPerWindow, forceReanalyze } = config;
  const env = { ...process.env, NODE_PATH: path.join(baseDir, 'node_modules'), POSTGRES_USER: dbUser, POSTGRES_PASSWORD: dbPass };

  if (forceReanalyze) {
    event.reply('process-log', `>>> 强制重新导出模式已启用\n`);
  }

  // 确定要处理的文件列表
  let demos;
  if (selectedFile) {
    demos = [selectedFile]; // 单文件
  } else {
    demos = await glob('**/*.dem', { cwd: demoDir, absolute: true }); // 全部文件
  }

  // 创建数据库连接（用于检查是否已有训练窗口数据）
  const { Client } = require('pg');
  const pgClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: dbUser,
    password: dbPass,
    database: 'csdm'
  });
  await pgClient.connect();

  try {
    for (let i = 0; i < demos.length; i++) {
      event.reply('process-log', `\n[${i+1}/${demos.length}] 收割: ${path.basename(demos[i])}\n`);

      // 1. 从数据库获取 demo checksum (demo 已经分析过了)
      let checksum;
      try {
        const demoName = path.basename(demos[i]);
        // 从 matches 表查询 checksum (通过 demo_path 匹配)
        event.reply('process-log', `  → 查询 demo: ${demoName}\n`);
        const checksumResult = await pgClient.query(
          `SELECT checksum, demo_path FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
          [`%${demoName}`]
        );

        if (checksumResult.rows.length > 0) {
          checksum = checksumResult.rows[0].checksum;
          event.reply('process-log', `  ✓ 从数据库获取 checksum: ${checksum.substring(0, 16)}...\n`);
          event.reply('process-log', `    demo_path: ${checksumResult.rows[0].demo_path}\n`);
        } else {
          event.reply('process-log', `  ⚠️ 数据库中未找到此 demo，请先执行分析\n`);
          continue;
        }
      } catch (err) {
        event.reply('process-log', `  ⚠️ 无法获取 checksum: ${err.message}\n`);
        continue;
      }

      // 2. 检查数据库是否已有训练窗口数据
      const roundsToCheck = rounds ? rounds.split(',').map(r => parseInt(r.trim())) : null;
      let needAnalyze = false;

      // 即使强制重新导出，也要检查是否已有 approved 的数据
      try {
        if (playerSteamId && playerSteamId.trim() !== '') {
          // 检查指定玩家的数据
          const checkQuery = roundsToCheck
            ? `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 AND round_number = ANY($3::int[])`
            : `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2`;

          const checkParams = roundsToCheck
            ? [checksum, playerSteamId, roundsToCheck]
            : [checksum, playerSteamId];

          const result = await pgClient.query(checkQuery, checkParams);
          needAnalyze = result.rows[0].count == 0;
        } else {
          // 检查所有玩家的数据
          const checkQuery = roundsToCheck
            ? `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1 AND round_number = ANY($2::int[])`
            : `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1`;

          const checkParams = roundsToCheck
            ? [checksum, roundsToCheck]
            : [checksum];

          const result = await pgClient.query(checkQuery, checkParams);
          needAnalyze = result.rows[0].count == 0;
        }

        // 如果数据库中有数据，进一步检查是否已有 approved 的文件
        if (!needAnalyze && forceReanalyze) {
          event.reply('process-log', `  → 检查是否已有审核通过的数据...\n`);

          // 检查输出目录中是否已有 approved 的 data.json
          const glob = require('fast-glob');
          const demoBaseName = path.basename(demos[i], '.dem');
          const demoOutputDir = path.join(outputDir, demoBaseName);

          if (fs.existsSync(demoOutputDir)) {
            const dataJsonFiles = await glob('**/data.json', { cwd: demoOutputDir, absolute: true });
            let hasApprovedData = false;

            for (const jsonFile of dataJsonFiles) {
              try {
                const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
                // 检查新格式和旧格式
                if (jsonContent.review_status === 'approved' || jsonContent.states === true) {
                  hasApprovedData = true;
                  const folderName = path.basename(path.dirname(jsonFile));
                  event.reply('process-log', `    ✓ 发现已审核通过的数据: ${folderName}\n`);
                  break;
                }
              } catch (err) {
                // 忽略读取错误
              }
            }

            if (hasApprovedData) {
              event.reply('process-log', `  ✓ 已有审核通过的数据，跳过重新分析\n`);
              needAnalyze = false;
            } else {
              event.reply('process-log', `  → 未发现审核通过的数据，将强制重新导出\n`);
              needAnalyze = true;
            }
          } else {
            event.reply('process-log', `  → 输出目录不存在，将强制重新导出\n`);
            needAnalyze = true;
          }
        } else if (forceReanalyze) {
          // 数据库中没有数据，直接重新分析
          event.reply('process-log', `  → 强制重新导出训练窗口数据\n`);
          needAnalyze = true;
        }
      } catch (err) {
        event.reply('process-log', `  ⚠️ 数据库检查失败，将执行分析: ${err.message}\n`);
        needAnalyze = true;
      }

      // 3. 如果需要，执行分析
      if (needAnalyze) {
        if (forceReanalyze) {
          event.reply('process-log', `  ⊙ 强制重新导出训练窗口数据...\n`);
        } else {
          event.reply('process-log', `  ⊙ 数据库中无训练窗口数据，开始分析...\n`);
        }

        // 关键修复：如果 matches 表中已有记录但 training_windows 为空，
        // 先删除所有相关表的记录，然后作为全新 demo 重新分析
        event.reply('process-log', `  → 检测到需要重新分析，清理所有相关记录...\n`);

        // 先删除 demos 表记录（避免 "Demo already in database" 错误）
        try {
          await pgClient.query(`DELETE FROM demos WHERE checksum = $1`, [checksum]);
        } catch (e) {
          // demos 表可能不存在或结构不同，忽略错误
        }

        // 使用 CASCADE 删除 matches，自动删除所有外键关联的记录
        try {
          const result = await pgClient.query(`DELETE FROM matches WHERE checksum = $1`, [checksum]);
          event.reply('process-log', `  ✓ 清理完成（删除 ${result.rowCount} 条 matches 记录及所有关联数据）\n`);
        } catch (err) {
          event.reply('process-log', `  ⚠️ 清理失败: ${err.message}\n`);
        }

        const cliArgs = ['out/cli.js', 'training-data', demos[i]];
        if (playerSteamId && playerSteamId.trim() !== '') {
          cliArgs.push('--players', playerSteamId);
        }

        if (rounds) {
          cliArgs.push('--rounds', rounds);
        } else {
          cliArgs.push('--rounds', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');
        }

        // 不需要 --force 参数，因为已经删除了 matches 记录
        // CLI 会认为是新 demo，自动进行分析

        await runProc('node', cliArgs, { cwd: baseDir, env }, event);

        // 重新从数据库获取 checksum（分析后生成新的记录）
        try {
          const demoName = path.basename(demos[i]);
          const checksumResult = await pgClient.query(
            `SELECT checksum, demo_path FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
            [`%${demoName}`]
          );

          if (checksumResult.rows.length > 0) {
            checksum = checksumResult.rows[0].checksum;
            event.reply('process-log', `  ✓ 重新获取 checksum: ${checksum.substring(0, 16)}...\n`);
            event.reply('process-log', `    demo_path: ${checksumResult.rows[0].demo_path}\n`);

            // 验证 training_windows 表中是否有数据
            const verifyResult = await pgClient.query(
              `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1`,
              [checksum]
            );
            event.reply('process-log', `  → 验证训练窗口数据: ${verifyResult.rows[0].count} 条\n`);

            if (verifyResult.rows[0].count == 0) {
              event.reply('process-log', `  ⚠️ 分析后仍无训练窗口数据，跳过录制\n`);
              continue;
            }
          } else {
            event.reply('process-log', `  ⚠️ 分析后仍无法获取 checksum，跳过录制\n`);
            continue;
          }
        } catch (err) {
          event.reply('process-log', `  ⚠️ 重新获取 checksum 失败: ${err.message}\n`);
          continue;
        }
      } else {
        event.reply('process-log', `  ✓ 数据库中已有训练窗口数据，跳过分析\n`);
      }

      // 4. 构建视频生成脚本参数
      const hlaeArgs = ['scripts/smart-batch-hlae.mjs', '--checksum', checksum, '--demo', demos[i]];
      if (playerSteamId && playerSteamId.trim() !== '') {
        hlaeArgs.push('--player', playerSteamId);
      }
      // 关键修复：也要把回合号传给录制脚本
      if (rounds) {
        hlaeArgs.push('--rounds', rounds);
      }
      // 传递倍速参数
      if (speed) {
        hlaeArgs.push('--speed', speed);
      }
      // 传递输出目录
      if (outputDir) {
        hlaeArgs.push('--output', outputDir);
      }
      // 传递每窗口帧数
      if (framesPerWindow) {
        hlaeArgs.push('--frames', framesPerWindow);
      }

      await runProc('node', hlaeArgs, { cwd: baseDir, env }, event);
    }
  } finally {
    await pgClient.end();
  }
  event.reply('process-complete', 0);
});

// 按钮 3：可视化回放
ipcMain.on('start-visualization', async (event, config) => {
  const glob = require('fast-glob');
  const { outputDir, selectedFile, playerSteamId, rounds, targetFolder } = config;

  // 方式 A: 直接指定了文件夹 (来自右侧列表点击)
  if (targetFolder) {
      event.reply('process-log', `\n>>> 启动可视化工具: ${path.basename(targetFolder)}\n`);
      runVisualization(targetFolder, event);
      return;
  }

  // 方式 B: 通过参数查找 (来自按钮点击)
  if (!selectedFile || !playerSteamId || !rounds) {
      event.reply('process-log', '\n[错误] 可视化需要指定：单个Demo文件、玩家ID、具体回合号。\n');
      return;
  }
  
  // rounds 可能是 "1,2,3"，我们只取第一个
  const targetRound = rounds.split(',')[0].trim();
  
  event.reply('process-log', `\n>>> 正在查找数据: SteamID=${playerSteamId}, Round=${targetRound} ...\n`);
  
  const searchPattern = `*_${playerSteamId}_round${targetRound}`;
  const foundFolders = await glob(searchPattern, { cwd: outputDir, onlyDirectories: true, absolute: true });
  
  if (foundFolders.length === 0) {
      event.reply('process-log', `[错误] 未找到数据文件夹。请检查是否已生成数据，或路径是否正确。\n搜索路径: ${path.join(outputDir, searchPattern)}\n`);
      return;
  }
  
  const foundFolder = foundFolders[0]; // 取第一个匹配的
  event.reply('process-log', `>>> 启动可视化工具: ${path.basename(foundFolder)}\n`);
  runVisualization(foundFolder, event);
});

function runVisualization(folderPath, event) {
  // 尝试寻找 python 环境
  let pythonCmd = 'python';
  // 优先尝试 cs2demo 环境 (如果存在)
  const condaEnvPath = path.join(process.env.USERPROFILE, '.conda', 'envs', 'cs2demo', 'python.exe');
  if (fs.existsSync(condaEnvPath)) {
      pythonCmd = condaEnvPath;
  }

  const scriptPath = path.join(baseDir, 'scripts', 'visualize_playback.py');

  const p = spawn(pythonCmd, [scriptPath, folderPath]);

  // 追踪进程
  activeProcesses.add(p);

  p.stdout.on('data', d => {
    const output = d.toString();
    event.reply('process-log', `[GUI] ${output}`);

    // 检测删除标记
    if (output.includes('__DELETED__')) {
      event.reply('visualization-deleted');
    }
    // 检测标记标记
    if (output.includes('__MARKED__')) {
      event.reply('visualization-marked');
    }
    // 检测错误标记
    if (output.includes('__ERROR_MARKED__')) {
      event.reply('visualization-error-marked');
    }
    // 检测切换标记
    if (output.includes('__NEXT__')) {
      event.reply('visualization-next');
    }
    if (output.includes('__PREV__')) {
      event.reply('visualization-prev');
    }
  });

  p.stderr.on('data', d => event.reply('process-log', `[GUI] ${d}`));

  p.on('close', () => {
    // 进程结束时移除追踪
    activeProcesses.delete(p);
  });

  p.on('error', (err) => {
      event.reply('process-log', `[错误] 无法启动 Python: ${err.message}\n请确保已安装 Python 并添加到环境变量，或安装了 Anaconda 环境。\n`);
  });
}

// 新增：终止所有任务
ipcMain.handle('kill-all-tasks', async (event) => {
  try {
    const count = activeProcesses.size;

    if (count === 0) {
      return { success: true, count: 0 };
    }

    // 复制一份集合，因为kill会触发close事件，从而修改activeProcesses
    const processesToKill = Array.from(activeProcesses);

    for (const proc of processesToKill) {
      try {
        // Windows下使用 taskkill 强制终止进程树
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/T', '/F']);
        } else {
          proc.kill('SIGKILL');
        }
      } catch (err) {
        console.error('Failed to kill process:', err);
      }
    }

    // 清空集合
    activeProcesses.clear();

    return { success: true, count: count };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 新增：扫描已生成的数据
ipcMain.handle('scan-training-data', async (event, outputDir) => {
    try {
        const glob = require('fast-glob');
        // 查找所有包含 data.json 的子目录
        // pattern: */data.json 表示只查一级子目录
        const files = await glob('*/data.json', { cwd: outputDir, absolute: true, stats: true });

        // 按时间倒序排列 (最新的在最前)
        files.sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs);

        return files.map(f => {
            const folderPath = path.dirname(f.path);
            const folderName = path.basename(folderPath);
            return {
                name: folderName,
                path: folderPath,
                mtime: f.stats.mtime
            };
        });
    } catch (e) {
        return [];
    }
});

// 新增：获取数据库状态
ipcMain.handle('get-database-status', async (event, config) => {
  const { dbUser, dbPass } = config;
  const { Client } = require('pg');

  const pgClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: dbUser,
    password: dbPass,
    database: 'csdm'
  });

  try {
    await pgClient.connect();

    // 查询各表的记录数
    const demosCountResult = await pgClient.query('SELECT COUNT(*) as count FROM demos');
    const matchesCountResult = await pgClient.query('SELECT COUNT(*) as count FROM matches');
    const windowsCountResult = await pgClient.query('SELECT COUNT(*) as count FROM training_windows');

    // 查询最近的 demos（带 training_windows 计数）
    const demosResult = await pgClient.query(`
      SELECT
        m.checksum,
        m.name,
        m.date,
        COUNT(tw.id) as windows_count
      FROM matches m
      LEFT JOIN training_windows tw ON tw.match_checksum = m.checksum
      GROUP BY m.checksum, m.name, m.date
      ORDER BY m.date DESC
      LIMIT 20
    `);

    await pgClient.end();

    return {
      demosCount: parseInt(demosCountResult.rows[0].count),
      matchesCount: parseInt(matchesCountResult.rows[0].count),
      windowsCount: parseInt(windowsCountResult.rows[0].count),
      demos: demosResult.rows.map(row => ({
        checksum: row.checksum,
        name: row.name,
        date: row.date,
        windows_count: parseInt(row.windows_count)
      }))
    };
  } catch (err) {
    console.error('Database status query error:', err);
    return { error: err.message };
  }
});

// 新增：清空数据库所有表
ipcMain.handle('clear-database', async (event, config) => {
  const { dbUser, dbPass } = config;
  const { Client } = require('pg');

  const pgClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: dbUser,
    password: dbPass,
    database: 'csdm'
  });

  try {
    await pgClient.connect();

    // 先查询要删除的记录数
    const demosCount = await pgClient.query('SELECT COUNT(*) as count FROM demos');
    const matchesCount = await pgClient.query('SELECT COUNT(*) as count FROM matches');
    const windowsCount = await pgClient.query('SELECT COUNT(*) as count FROM training_windows');

    // 使用 TRUNCATE 清空表（比 DELETE 更快，自动重置序列）
    // CASCADE 会自动删除所有外键关联的记录
    await pgClient.query('TRUNCATE TABLE demos CASCADE');
    await pgClient.query('TRUNCATE TABLE matches CASCADE');
    await pgClient.query('TRUNCATE TABLE training_windows CASCADE');

    await pgClient.end();

    return {
      demosDeleted: parseInt(demosCount.rows[0].count),
      matchesDeleted: parseInt(matchesCount.rows[0].count),
      windowsDeleted: parseInt(windowsCount.rows[0].count)
    };
  } catch (err) {
    console.error('Clear database error:', err);
    return { error: err.message };
  }
});

// 新增：一键全流程（分析+录制）
ipcMain.on('start-full-pipeline', async (event, config) => {
  const glob = require('fast-glob');
  const { demoDir, outputDir, selectedFile, rounds, playerSteamId, dbUser, dbPass, speed, framesPerWindow } = config;
  const env = { ...process.env, NODE_PATH: path.join(baseDir, 'node_modules'), POSTGRES_USER: dbUser, POSTGRES_PASSWORD: dbPass };

  // 确定要处理的文件列表
  let demos;
  if (selectedFile) {
    demos = [selectedFile];
  } else {
    // 排除 broken_demos 文件夹
    demos = await glob('**/*.dem', {
      cwd: demoDir,
      absolute: true,
      ignore: ['**/broken_demos/**']
    });
  }

  event.reply('process-log', `📊 扫描到 ${demos.length} 个demo文件（已排除 broken_demos 文件夹）\n\n`);

  // 创建数据库连接
  const { Client } = require('pg');
  const pgClient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: dbUser,
    password: dbPass,
    database: 'csdm'
  });

  try {
    await pgClient.connect();

    for (let i = 0; i < demos.length; i++) {
      const demoPath = demos[i];
      const demoName = path.basename(demoPath);

      event.reply('process-log', `\n╔═══════════════════════════════════════════════════════════╗\n`);
      event.reply('process-log', `║ [${i+1}/${demos.length}] ${demoName}\n`);
      event.reply('process-log', `╚═══════════════════════════════════════════════════════════╝\n\n`);

      // 第一步：检查并分析
      event.reply('process-log', `[步骤 1/2] 检查training_windows状态...\n`);

      let needAnalyze = false;
      let checksum = null;

      try {
        // 查询checksum
        const checksumResult = await pgClient.query(
          `SELECT checksum FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
          [`%${demoName}`]
        );

        if (checksumResult.rows.length > 0) {
          checksum = checksumResult.rows[0].checksum;

          // 检查training_windows
          const windowsResult = await pgClient.query(
            `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1`,
            [checksum]
          );

          if (windowsResult.rows[0].count == 0) {
            event.reply('process-log', `  ⚠️  training_windows为空，需要分析\n`);
            needAnalyze = true;
          } else {
            event.reply('process-log', `  ✓ training_windows已存在 (${windowsResult.rows[0].count}条)，跳过分析\n\n`);
          }
        } else {
          event.reply('process-log', `  ⚠️  Demo不在数据库中，需要分析\n`);
          needAnalyze = true;
        }
      } catch (err) {
        event.reply('process-log', `  ⚠️  数据库检查失败，需要分析: ${err.message}\n`);
        needAnalyze = true;
      }

      // 如果需要分析，执行分析流程
      if (needAnalyze) {
        event.reply('process-log', `\n[步骤 1/2] 开始分析demo...\n`);

        // 删除旧记录（如果有）
        if (checksum) {
          try {
            await pgClient.query(`DELETE FROM demos WHERE checksum = $1`, [checksum]);
            await pgClient.query(`DELETE FROM matches WHERE checksum = $1`, [checksum]);
            event.reply('process-log', `  ✓ 清理了旧记录\n`);
          } catch (e) {
            // 忽略删除错误
          }
        }

        // 构建分析命令
        const cliArgs = ['out/cli.js', 'training-data', demoPath];
        if (rounds) {
          cliArgs.push('--rounds', rounds);
        } else {
          cliArgs.push('--rounds', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');
        }

        // 执行分析
        try {
          await runProc('node', cliArgs, { cwd: baseDir, env }, event);
          event.reply('process-log', `  ✓ 分析完成\n\n`);
        } catch (analyzeError) {
          event.reply('process-log', `  ❌ 分析失败，可能是demo文件损坏\n`);
        }
      }

      // 第二步：录制
      event.reply('process-log', `[步骤 2/2] 开始录制视频...\n`);

      // 重新查询checksum（分析后可能变化）
      let demoIsBroken = false;
      try {
        const checksumResult = await pgClient.query(
          `SELECT checksum FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
          [`%${demoName}`]
        );

        if (checksumResult.rows.length > 0) {
          checksum = checksumResult.rows[0].checksum;

          // 验证training_windows
          const windowsResult = await pgClient.query(
            `SELECT COUNT(*) as count FROM training_windows WHERE match_checksum = $1`,
            [checksum]
          );

          if (windowsResult.rows[0].count > 0) {
            event.reply('process-log', `  ✓ 找到 ${windowsResult.rows[0].count} 个训练窗口\n`);

            // 调用录制脚本
            const scriptPath = path.join(baseDir, 'scripts', 'smart-batch-hlae.mjs');

            // 调试日志：显示参数值
            event.reply('process-log', `  [调试] checksum=${checksum}\n`);
            event.reply('process-log', `  [调试] demoPath=${demoPath}\n`);
            event.reply('process-log', `  [调试] speed=${speed}\n`);
            event.reply('process-log', `  [调试] outputDir=${outputDir}\n`);
            event.reply('process-log', `  [调试] framesPerWindow=${framesPerWindow}\n`);

            const scriptArgs = [
              scriptPath,
              '--checksum', checksum,
              '--demo', demoPath,
              '--speed', speed,
              '--output', outputDir,
              '--frames', framesPerWindow
            ];

            // 可选参数：玩家ID
            if (playerSteamId) {
              scriptArgs.push('--player', playerSteamId);
              event.reply('process-log', `  [调试] playerSteamId=${playerSteamId}\n`);
            }

            // 可选参数：回合号
            if (rounds) {
              scriptArgs.push('--rounds', rounds);
              event.reply('process-log', `  [调试] rounds=${rounds}\n`);
            }

            event.reply('process-log', `  [调试] 完整命令: node ${scriptArgs.join(' ')}\n\n`);

            await runProc('node', scriptArgs, { cwd: baseDir, env }, event);

            event.reply('process-log', `  ✓ 录制完成\n`);
          } else {
            event.reply('process-log', `  ⚠️  分析后仍无training_windows，判定为损坏demo\n`);
            demoIsBroken = true;
          }
        } else {
          event.reply('process-log', `  ⚠️  分析后仍无法获取checksum，判定为损坏demo\n`);
          demoIsBroken = true;
        }
      } catch (err) {
        event.reply('process-log', `  ⚠️  录制失败: ${err.message}\n`);
      }

      // 自动移动损坏的demo到broken_demos文件夹
      if (demoIsBroken && needAnalyze) {
        try {
          const fs = require('fs-extra');
          const brokenDir = path.join(path.dirname(demoPath), 'broken_demos');
          await fs.ensureDir(brokenDir);

          const fileName = path.basename(demoPath);
          const targetPath = path.join(brokenDir, fileName);

          await fs.move(demoPath, targetPath, { overwrite: true });
          event.reply('process-log', `  🗂️  已自动移动到: broken_demos/${fileName}\n`);
        } catch (moveErr) {
          event.reply('process-log', `  ⚠️  移动文件失败: ${moveErr.message}\n`);
        }
      }

      event.reply('process-log', `\n✅ Demo处理完成\n`);
    }

    event.reply('process-log', `\n\n🎉 ========== 全部demo处理完成 ==========\n`);
    event.reply('process-log', `📊 总计处理: ${demos.length} 个demo\n`);

  } catch (err) {
    event.reply('process-log', `\n❌ 错误: ${err.message}\n`);
  } finally {
    await pgClient.end();
    event.reply('process-complete', 0);
  }
});

