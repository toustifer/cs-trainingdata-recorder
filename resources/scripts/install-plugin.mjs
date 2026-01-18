#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CS2_ROOT = "F:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive";

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
