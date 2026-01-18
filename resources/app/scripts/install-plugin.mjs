#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 尝试从CSDM配置读取CS2路径
let CS2_ROOT = null;
try {
  const csdmSettingsPath = path.join(os.homedir(), '.csdm', 'settings.json');
  if (fs.existsSync(csdmSettingsPath)) {
    const csdmSettings = JSON.parse(fs.readFileSync(csdmSettingsPath, 'utf8'));
    const cs2ExePath = csdmSettings.playback?.cs2ExecutablePath;
    if (cs2ExePath) {
      // cs2.exe路径是 .../game/bin/win64/cs2.exe，需要提取到根目录
      CS2_ROOT = cs2ExePath.replace(/[\/\\]game[\/\\]bin[\/\\]win64[\/\\]cs2\.exe$/i, '');
      console.log(`[INFO] 从 CSDM 配置读取到 CS2 路径: ${CS2_ROOT}`);
    }
  }
} catch (err) {
  console.warn(`[警告] 无法读取 CSDM 配置文件: ${err.message}`);
}

// 如果没有找到，提示用户手动指定
if (!CS2_ROOT) {
  console.error('❌ 无法找到 CS2 安装路径');
  console.error('请在 CSDM GUI 中配置 CS2 路径，或者直接修改本脚本第7行');
  console.error('用法: node install-plugin.mjs <CS2根目录路径>');
  if (process.argv[2]) {
    CS2_ROOT = process.argv[2];
    console.log(`使用命令行参数: ${CS2_ROOT}`);
  } else {
    process.exit(1);
  }
}

function install() {
    console.log(`目标: ${CS2_ROOT}`);
    if (!fs.existsSync(CS2_ROOT)) { console.error('❌ 找不到 CS2 目录'); process.exit(1); }

    const sourceDll = path.resolve(__dirname, '../static/cs2/server.dll');
    const destDir = path.join(CS2_ROOT, 'game', 'csgo', 'csdm', 'bin');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(sourceDll, path.join(destDir, 'server.dll'));
    console.log('✓ 插件已复制');

    const gameInfoPath = path.join(CS2_ROOT, 'game', 'csgo', 'gameinfo.gi');
    if (fs.existsSync(gameInfoPath)) {
        let content = fs.readFileSync(gameInfoPath, 'utf8');
        if (!content.includes('csgo/csdm')) {
            content = content.replace(/(Game\s+csgo\r?\n)/i, '$1\t\t\tGame\tcsgo/csdm\n');
            fs.writeFileSync(gameInfoPath, content);
            console.log('✓ gameinfo.gi 已更新');
        }
    }
    console.log('🎉 完成');
}
install();
