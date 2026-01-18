#!/usr/bin/env node

/**
 * 方案 F (VDM 终极版)：通过 Valve Demo Maker 实现全自动多段录制
 * 
 * 修正版：
 * 1. 自动在 VDM 中注入 exec 指令，消除手动步骤。
 * 2. 自动生成绝对路径的 cfg。
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
  console.error('用法: node scripts/cli-hlae-direct.mjs --checksum <checksum> --player <steam_id> --demo <path>');
  process.exit(1);
}

async function main() {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '88683139', database: 'csdm' });
  await client.connect();

  try {
    // 1. 获取 HLAE 路径
    const possibleHlae = [
        "C:\\Users\\15775\\.csdm\\hlae\\HLAE.exe", // 确认的真实路径
        "C:\\Users\\15775\\AppData\\Local\\Programs\\cs-demo-manager\\resources\\static\\hlae\\HLAE.exe",
        "D:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\csdm\\hlae\\HLAE.exe",
        "C:\\Program Files (x86)\\HLAE\\HLAE.exe"
    ];
    let hlaePath = possibleHlae.find(p => fs.existsSync(p));
    
    // 尝试读取配置
    if (!hlaePath) {
        try {
            const configPath = path.join(process.env.APPDATA, 'cs-demo-manager', 'config.json');
            if (fs.existsSync(configPath)) {
                const conf = await fs.readJSON(configPath);
                if (conf.video?.hlae?.executablePath) hlaePath = conf.video.hlae.executablePath;
            }
        } catch(e){}
    }
    
    if (!hlaePath || !fs.existsSync(hlaePath)) {
        console.error("无法定位 HLAE，无法继续。");
        process.exit(1);
    }

    const cs2Path = "D:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64\\cs2.exe";

    // 2. 准备数据
    const rounds = (await client.query(`
      SELECT round_number, player_name, MIN(start_tick) as s, MAX(end_tick) as e 
      FROM training_windows WHERE match_checksum = $1 AND player_steam_id = $2 
      GROUP BY round_number, player_name ORDER BY round_number ASC`, [checksum, playerSteamId])).rows;

    const playerName = rounds[0].player_name;
    const outputRoot = 'F:/cs_data/traindata';
    const matchFolder = `${playerName}_${playerSteamId}_vdm_${checksum.substring(0, 8)}`;
    const matchOutputPath = path.resolve(outputRoot, matchFolder);
    await fs.mkdirp(matchOutputPath);

    console.log(`准备录制: ${playerName}, 共 ${rounds.length} 个回合`);
    console.log(`输出目录: ${matchOutputPath}`);

    // 3. 生成 HLAE 启动配置 (setup_streams.cfg)
    const launchCfgPath = path.join(matchOutputPath, 'setup_streams.cfg');
    // HLAE 路径需要转义反斜杠
    const escOutputPath = matchOutputPath.replace(/\\/g, '/');
    
    const streamCfg = `
mirv_streams remove all
mirv_streams add normal myStream
mirv_streams edit myStream drawHud 1
// 设置输出路径: F:/.../round_N/takeXXXX
// {REC_NAME} 会被替换为 round_N
mirv_streams settings add ffmpeg mySettings "-c:v libx264 -crf 23 {QUOTE}${escOutputPath}/{REC_NAME}.mp4{QUOTE}"
mirv_streams edit myStream settings mySettings
echo "HLAE Streams Configured Successfully!"
`;
    await fs.writeFile(launchCfgPath, streamCfg);

    // 4. 生成 VDM 文件
    console.log('[3/4] 生成 VDM 自动化脚本...');
    
    let vdmContent = 'demoactions\n{\n';
    let idx = 1;

    // 4.1 全局初始化 + 自动加载配置
    // 关键：在 Tick 0 自动执行 exec
    const execCmd = `exec \"${launchCfgPath.replace(/\\/g, '/')}\"`;

    vdmContent += `
    "${idx++}"
    {
        factory "PlayCommands"
        name "Init"
        starttick "0"
        commands "sv_cheats 1; cl_draw_only_deathnotices 0; mirv_cvar_unhide_all 1; fps_max 0; demo_timescale 1; ${execCmd}"
    }
    `;

    for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        const startTick = parseInt(r.s);
        const endTick = parseInt(r.e);
        
        // 4.2 回合开始
        vdmContent += `
    "${idx++}"
    {
        factory "PlayCommands"
        name "Start Round ${r.round_number}"
        starttick "${startTick}"
        commands "spec_player_by_accountid ${playerSteamId}; mirv_streams record name round_${r.round_number}; mirv_streams record start"
    }
    `;

        // 4.3 回合结束
        vdmContent += `
    "${idx++}"
    {
        factory "PlayCommands"
        name "Stop Round ${r.round_number}"
        starttick "${endTick}"
        commands "mirv_streams record end"
    }
    `;

        // 4.4 跳转
        if (i < rounds.length - 1) {
            const nextStart = parseInt(rounds[i+1].s);
            if (nextStart - endTick > 200) {
                vdmContent += `
    "${idx++}"
    {
        factory "SkipAhead"
        name "Skip Gap"
        starttick "${endTick + 10}"
        skiptotick "${nextStart - 50}"
    }
    `;
            }
        } else {
            // 退出
            vdmContent += `
    "${idx++}"
    {
        factory "PlayCommands"
        name "Quit"
        starttick "${endTick + 100}"
        commands "quit"
    }
    `;
        }
    }
    
    vdmContent += '\n}\n';
    
    const vdmPath = demoPath.replace('.dem', '.vdm');
    await fs.writeFile(vdmPath, vdmContent);
    console.log(`VDM 文件已生成: ${vdmPath}`);

    // 5. 打印手动启动指南
    console.log('\n[4/4] 准备就绪！请手动启动 HLAE...');
    console.log('----------------------------------------------------------------');
    console.log('1. 打开 HLAE (C:\\Users\\15775\\.csdm\\hlae\\HLAE.exe)');
    console.log('2. File -> Launch CS:GO');
    console.log('3. Game Path: ' + cs2Path);
    console.log('4. Custom Command Line Arguments:');
    console.log(`   -insecure -novid -width 640 -height 480 +playdemo "${demoPath.replace(/\\/g, '/')}"`);
    console.log('5. 点击 Launch');
    console.log('----------------------------------------------------------------');
    console.log('🚀 游戏启动后，VDM 脚本将自动接管，开始 40 倍速全场录制！');
    console.log('录制完成后，视频会自动出现在: ' + matchOutputPath);

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

main();
