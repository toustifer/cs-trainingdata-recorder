const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// 禁用 GPU 加速（解决某些机器上窗口不显示的问题）
app.disableHardwareAcceleration();

// 关键：手动补全模块搜索路径，让主进程能找到外部的 node_modules
const isPackaged = app.isPackaged;
const baseDir = isPackaged ? process.resourcesPath : __dirname;
module.paths.push(path.join(baseDir, 'node_modules'));

let mainWindow;

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

ipcMain.handle('select-dir', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
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

function runProc(cmd, args, options, event, onData) {
    return new Promise((resolve) => {
        const p = spawn(cmd, args, options);
        p.stdout.on('data', (d) => {
            const str = d.toString();
            event.reply('process-log', str);
            if (onData) onData(str);
        });
        p.stderr.on('data', (d) => event.reply('process-log', d.toString()));
        p.on('close', resolve);
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

  for (let i = 0; i < demos.length; i++) {
    const demoPath = demos[i];
    const fileName = path.basename(demoPath);
    event.reply('process-log', `\n[${i+1}/${demos.length}] 分析: ${fileName}\n`);
    event.reply('file-status-update', { file: demoPath, status: '分析中...' });

    let cliOutput = '';
    // 构建CLI参数
    const cliArgs = ['out/cli.js', 'training-data', demoPath];
    if (rounds) {
      cliArgs.push('--rounds', rounds);
    }
    if (forceReanalyze) {
      cliArgs.push('--force');
    }
    cliArgs.push('--list-players');

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
        const checksumResult = await pgClient.query(
          `SELECT checksum FROM matches WHERE demo_path LIKE $1 ORDER BY date DESC LIMIT 1`,
          [`%${demoName}`]
        );

        if (checksumResult.rows.length > 0) {
          checksum = checksumResult.rows[0].checksum;
          event.reply('process-log', `  ✓ 从数据库获取 checksum: ${checksum.substring(0, 16)}...\n`);
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

      // 如果强制重新导出，跳过检查
      if (forceReanalyze) {
        needAnalyze = true;
        event.reply('process-log', `  → 强制重新导出训练窗口数据\n`);
      } else {
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
        } catch (err) {
          event.reply('process-log', `  ⚠️ 数据库检查失败，将执行分析: ${err.message}\n`);
          needAnalyze = true;
        }
      }

      // 3. 如果需要，执行分析
      if (needAnalyze) {
        if (forceReanalyze) {
          event.reply('process-log', `  ⊙ 强制重新导出训练窗口数据...\n`);
        } else {
          event.reply('process-log', `  ⊙ 数据库中无训练窗口数据，开始分析...\n`);
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

        if (forceReanalyze) {
          cliArgs.push('--force');
        }

        await runProc('node', cliArgs, { cwd: baseDir, env }, event);
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
  
  p.stdout.on('data', d => event.reply('process-log', `[GUI] ${d}`));
  p.stderr.on('data', d => event.reply('process-log', `[GUI] ${d}`));
  
  p.on('error', (err) => {
      event.reply('process-log', `[错误] 无法启动 Python: ${err.message}\n请确保已安装 Python 并添加到环境变量，或安装了 Anaconda 环境。\n`);
  });
}

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
