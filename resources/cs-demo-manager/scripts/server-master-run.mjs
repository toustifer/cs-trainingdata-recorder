#!/usr/bin/env node

/**
 * 服务器总控脚本：无人值守批量收割
 * 
 * 用法：node scripts/server-master-run.mjs --dir "D:/demos"
 */

import { spawn, exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let demoDir;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir') demoDir = args[++i];
}

if (!demoDir) {
  console.error('请指定 Demo 目录: node scripts/server-master-run.mjs --dir "D:/demos"');
  process.exit(1);
}

// 辅助函数：运行命令并实时输出
async function runCmd(cmd, args) {
    return new Promise((resolve, reject) => {
        console.log(`\n> 执行: ${cmd} ${args.join(' ')}`);
        const p = spawn(cmd, args, { cwd: path.resolve(__dirname, '..'), shell: true });
        p.stdout.on('data', d => process.stdout.write(d)); // 实时输出
        p.stderr.on('data', d => process.stderr.write(d));
        p.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`Exit Code ${code}`));
        });
    });
}

async function main() {
    // 1. 扫描所有 Demo
    const files = await fs.readdir(demoDir);
    const demos = files.filter(f => f.endsWith('.dem'));
    
    console.log(`\n==================================================`);
    console.log(`🚀 服务器总控启动 | 发现 ${demos.length} 个 Demo`);
    console.log(`==================================================\n`);

    for (let i = 0; i < demos.length; i++) {
        const demoFile = demos[i];
        const demoPath = path.join(demoDir, demoFile);
        
        console.log(`\n--------------------------------------------------`);
        console.log(`[${i+1}/${demos.length}] 处理 Demo: ${demoFile}`);
        console.log(`--------------------------------------------------`);

        try {
            // 2. 第一步：分析 Demo 并找出最佳玩家
            // 我们先运行一次 training-data --list-players 来获取 json 输出
            // 为了简化，我们假设我们想录制击杀数最多的那个玩家
            
            // 这里我们用一个小技巧：调用 training-data 但只为了让数据库有数据
            // 然后我们查数据库找最佳玩家
            
            // 为了稳妥，我们先手动解析一下
            console.log(`Step 1: 解析 Demo 元数据...`);
            // 这里我们简单粗暴：先让它分析所有玩家，但不导出具体 round
            // 实际上 CSDM 分析一次就会把所有 match info 存入 DB
            
            // 由于 CSDM 没有直接的 "analyze only" 命令，我们用 training-data 跑一个空回合来触发分析
            // 或者：我们假设你已经分析过了。
            
            // 更好的策略：直接调用 analyze 脚本（如果存在），或者用 training-data
            // 我们用 training-data 跑 round 1 触发分析
            try {
                await execAsync(`node out/cli.js training-data "${demoPath}" --rounds 0`, { cwd: path.resolve(__dirname, '..') });
            } catch(e) { 
                // 忽略 round 0 的报错，只要分析跑了就行
            }

            // 3. 查数据库找大哥
            const { default: pg } = await import('pg');
            const client = new pg.Client({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '88683139', database: 'csdm' });
            await client.connect();
            
            // 获取 checksum
            // 这里比较麻烦，因为文件名不等于 checksum。
            // 简单起见，我们假设你愿意手动为每个 Demo 指定 Player，或者...
            // 我们可以查 "最近导入的 match"
            
            const matchRes = await client.query(`
                SELECT checksum FROM matches 
                ORDER BY created_at DESC LIMIT 1
            `);
            const checksum = matchRes.rows[0].checksum;
            
            // 找大哥 (K/D > 1.5 且 击杀 > 20)
            const playerRes = await client.query(`
                SELECT steam_id, name, kill_count, death_count 
                FROM player_match_stats 
                WHERE match_checksum = $1 
                AND kill_count > 20
                ORDER BY kill_count DESC 
                LIMIT 1
            `, [checksum]);
            
            if (playerRes.rows.length === 0) {
                console.log("⚠️ 该局没有大哥 (击杀>20)，跳过。");
                await client.end();
                continue;
            }
            
            const player = playerRes.rows[0];
            console.log(`🎯 锁定目标: ${player.name} (Kills: ${player.kill_count})`);
            
            // 4. 第二步：生成该玩家所有回合的元数据
            console.log(`Step 2: 生成元数据 (All Rounds)...`);
            // 获取总回合数
            const roundCountRes = await client.query(`SELECT count(*) as cnt FROM rounds WHERE match_checksum = $1`, [checksum]);
            const totalRounds = parseInt(roundCountRes.rows[0].cnt);
            const allRounds = Array.from({length: totalRounds}, (_, i) => i + 1).join(',');
            
            await client.end(); // 释放连接，让 CLI 用
            
            await runCmd('node', ['out/cli.js', 'training-data', `"${demoPath}"`, '--players', player.steam_id, '--rounds', allRounds]);

            // 5. 第三步：批量录制 (Smart Batch)
            console.log(`Step 3: 开始批量录制...`);
            await runCmd('node', ['scripts/smart-batch-hlae.mjs', '--checksum', checksum, '--player', player.steam_id, '--demo', `"${demoPath}"`]);
            
            console.log(`✅ Demo ${demoFile} 处理完毕！`);
            
            // 6. 归档 (可选)
            const doneDir = path.join(demoDir, 'processed');
            await fs.ensureDir(doneDir);
            await fs.move(demoPath, path.join(doneDir, demoFile));

        } catch (e) {
            console.error(`❌ Demo ${demoFile} 处理失败:`, e.message);
            // 移动到错误目录
            const errDir = path.join(demoDir, 'error');
            await fs.ensureDir(errDir);
            try { await fs.move(demoPath, path.join(errDir, demoFile)); } catch {}
        }
    }
    
    console.log('\n🌟 所有 Demo 处理结束！');
}

main();
