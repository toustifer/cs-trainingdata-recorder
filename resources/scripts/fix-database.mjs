#!/usr/bin/env node

/**
 * 修复数据库脚本
 * 清空并重建数据库表，然后使用 cs-demo-manager 的 analyze 命令重新分析 demo
 *
 * 使用方法：
 *   node scripts/fix-database.mjs --demo "你的demo路径.dem"
 */

import pg from 'pg';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execAsync = promisify(exec);
const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析参数
const args = process.argv.slice(2);
let password = '88683139';
let demoPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--password' && i + 1 < args.length) {
    password = args[i + 1];
    i++;
  } else if (args[i] === '--demo' && i + 1 < args.length) {
    demoPath = args[i + 1];
    i++;
  }
}

console.log('='.repeat(60));
console.log('CS2 Data Reaper - 数据库修复脚本');
console.log('='.repeat(60));
console.log('');

async function main() {
  // 1. 连接数据库
  console.log('[1/3] 连接 PostgreSQL...');

  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'csdm'
  });

  try {
    await client.connect();
    console.log('✓ 连接成功');
  } catch (err) {
    console.error('✗ 连接失败:', err.message);
    process.exit(1);
  }

  // 2. 删除有问题的表并重建
  console.log('');
  console.log('[2/3] 重置数据库表...');

  try {
    // 删除我们自己创建的简化表
    await client.query('DROP TABLE IF EXISTS training_windows CASCADE;');
    await client.query('DROP TABLE IF EXISTS demos CASCADE;');
    await client.query('DROP TABLE IF EXISTS matches CASCADE;');
    console.log('✓ 旧表已删除');

    // 只创建 training_windows 表（demos 和 matches 由 cs-demo-manager 自动创建）
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_windows (
        id SERIAL PRIMARY KEY,
        match_checksum VARCHAR(64) NOT NULL,
        player_steam_id VARCHAR(32) NOT NULL,
        player_name VARCHAR(64),
        round_number INTEGER NOT NULL,
        window_idx INTEGER NOT NULL,
        start_tick INTEGER NOT NULL,
        end_tick INTEGER NOT NULL,
        situation_text TEXT,
        events_json TEXT,
        pos_x REAL,
        pos_y REAL,
        pos_z REAL,
        health INTEGER,
        armor INTEGER,
        weapon VARCHAR(64),
        is_moving BOOLEAN,
        move_direction VARCHAR(32),
        move_speed REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(match_checksum, player_steam_id, round_number, window_idx)
      )
    `);
    console.log('✓ training_windows 表已创建');

    // 创建索引
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tw_checksum ON training_windows(match_checksum);
      CREATE INDEX IF NOT EXISTS idx_tw_player ON training_windows(player_steam_id);
      CREATE INDEX IF NOT EXISTS idx_tw_round ON training_windows(round_number);
    `);
    console.log('✓ 索引已创建');

  } catch (err) {
    console.error('✗ 重置表失败:', err.message);
    await client.end();
    process.exit(1);
  }

  await client.end();

  // 3. 使用 cs-demo-manager 的 analyze 命令
  if (demoPath) {
    console.log('');
    console.log('[3/3] 使用 cs-demo-manager 分析 demo...');

    // 找到 cs-demo-manager 目录
    const possiblePaths = [
      path.resolve(__dirname, '../cs-demo-manager'),
      path.resolve(__dirname, '../../cs-demo-manager'),
    ];

    let csdmDir = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        csdmDir = p;
        break;
      }
    }

    if (!csdmDir) {
      console.log('⚠ 未找到 cs-demo-manager，请手动运行:');
      console.log(`   node out/cli.js analyze "${demoPath}"`);
    } else {
      console.log(`使用 cs-demo-manager: ${csdmDir}`);
      try {
        const { stdout, stderr } = await execAsync(`node out/cli.js analyze "${demoPath}"`, {
          cwd: csdmDir,
          timeout: 300000
        });
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        console.log('✓ 分析完成');
      } catch (err) {
        console.error('分析失败:', err.message);
        console.log('请手动运行:');
        console.log(`   cd ${csdmDir}`);
        console.log(`   node out/cli.js analyze "${demoPath}"`);
      }
    }
  } else {
    console.log('');
    console.log('[3/3] 跳过分析（未指定 demo 文件）');
    console.log('');
    console.log('请手动运行 cs-demo-manager 的 analyze 命令:');
    console.log('   node out/cli.js analyze "你的demo路径.dem"');
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✓ 数据库修复完成！');
  console.log('='.repeat(60));
}

main();
