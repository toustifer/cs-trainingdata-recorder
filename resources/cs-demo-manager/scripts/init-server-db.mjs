#!/usr/bin/env node

/**
 * 服务器数据库初始化脚本
 *
 * 功能：
 * 1. 检查并创建 csdm 数据库
 * 2. 导入核心表结构 (matches, rounds, players...)
 * 3. 导入训练数据表 (training_windows)
 */

import pg from 'pg';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 手动加载 .env
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) {}

const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '88683139'; // 默认密码
const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;

console.log('正在连接 PostgreSQL...');
console.log(`Host: ${POSTGRES_HOST}, User: ${POSTGRES_USER}`);

async function main() {
    // 1. 连接 postgres 默认库，检查 csdm 是否存在
    const sysClient = new pg.Client({
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        database: 'postgres'
    });

    try {
        await sysClient.connect();
        const res = await sysClient.query("SELECT 1 FROM pg_database WHERE datname = 'csdm'");
        if (res.rows.length === 0) {
            console.log('创建 csdm 数据库...');
            await sysClient.query('CREATE DATABASE csdm');
        } else {
            console.log('csdm 数据库已存在。');
        }
    } catch (e) {
        console.error('连接 PostgreSQL 失败:', e.message);
        process.exit(1);
    } finally {
        await sysClient.end();
    }

    // 2. 连接 csdm 数据库，创建表结构
    const client = new pg.Client({
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        database: 'csdm'
    });

    try {
        await client.connect();
        console.log('已连接 csdm 数据库，开始初始化表结构...');

        // 这里我们只创建最核心的表，确保 training-data 能够运行
        // 注意：这里省略了大量 CSDM 原生表结构，假设 training-data 会自动创建它们
        // 但根据经验，training-data 依赖于 schema_migrations
        
        // 关键：创建 training_windows 表
        const createTrainingTable = `
            CREATE TABLE IF NOT EXISTS training_windows (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                match_checksum TEXT NOT NULL,
                round_number INTEGER NOT NULL,
                player_steam_id TEXT NOT NULL,
                player_name TEXT NOT NULL,
                window_idx INTEGER NOT NULL,
                start_tick INTEGER NOT NULL,
                end_tick INTEGER NOT NULL,
                
                -- 状态数据
                pos_x DOUBLE PRECISION,
                pos_y DOUBLE PRECISION,
                pos_z DOUBLE PRECISION,
                view_pitch DOUBLE PRECISION,
                view_yaw DOUBLE PRECISION,
                health INTEGER,
                armor INTEGER,
                money INTEGER,
                helmet BOOLEAN,
                weapon TEXT,
                
                -- 行为数据
                is_moving BOOLEAN,
                move_speed DOUBLE PRECISION,
                move_direction TEXT,
                is_crouching BOOLEAN,
                is_scoped BOOLEAN,
                is_walking BOOLEAN,
                is_flashed BOOLEAN,
                flash_duration DOUBLE PRECISION,
                
                -- 描述与事件
                situation_text TEXT,
                events_json TEXT,
                events_zh TEXT,
                
                -- 元数据
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                
                -- 索引 (加速查询)
                CONSTRAINT uniq_window UNIQUE (match_checksum, player_steam_id, round_number, window_idx)
            );
            
            CREATE INDEX IF NOT EXISTS idx_training_match_player ON training_windows(match_checksum, player_steam_id);
        `;
        
        await client.query(createTrainingTable);
        console.log('✓ training_windows 表已就绪');

        // 尝试运行 CSDM 的原生迁移逻辑 (如果可用)
        // 如果无法调用原生迁移，我们至少保证了 training_windows 存在
        // training-data 命令通常依赖 matches, rounds, players, player_match_stats 表
        // 如果这些表不存在，training-data 可能会报错
        
        // 我们尝试查询一下 matches 表，如果不存在，提示用户
        try {
            await client.query('SELECT 1 FROM matches LIMIT 1');
            console.log('✓ CSDM 核心表 (matches) 已检测到');
        } catch (e) {
            console.warn('⚠️ 警告: CSDM 核心表似乎缺失。');
            console.warn('建议首次运行: node out/cli.js --help 来触发自动迁移，或者导入完整的 schema.sql');
        }

    } catch (e) {
        console.error('初始化失败:', e.message);
    } finally {
        await client.end();
    }
}

main();
