#!/usr/bin/env node
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

async function exportTrainingData(checksum, playerSteamId, roundNumber, outputPath) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('📦 导出训练数据元数据...\n');

  try {
    // 导出训练窗口数据
    const query = `
      SELECT
        window_idx,
        start_tick,
        end_tick,
        time_ms,
        pos_x, pos_y, pos_z,
        view_pitch, view_yaw,
        health, armor, weapon,
        is_alive, is_scoped, is_crouching, is_defusing, is_planting,
        flash_duration,
        team, money,
        is_moving, move_direction, move_speed,
        situation_text,
        events_json,
        events_zh,
        start_frame_path,
        middle_frame_paths,
        end_frame_path,
        match_checksum,
        player_steam_id,
        player_name,
        round_number
      FROM training_windows
      WHERE match_checksum = $1
        AND player_steam_id = $2
        AND round_number = $3
      ORDER BY window_idx
    `;

    const result = await client.query(query, [checksum, playerSteamId, roundNumber]);

    const exportData = {
      metadata: {
        match_checksum: checksum,
        player_steam_id: playerSteamId,
        player_name: result.rows[0]?.player_name || 'Unknown',
        round_number: roundNumber,
        total_windows: result.rows.length,
        export_date: new Date().toISOString(),
        version: '1.0'
      },
      windows: result.rows.map(row => ({
        ...row,
        middle_frame_paths: JSON.parse(row.middle_frame_paths),
        events_json: JSON.parse(row.events_json)
      }))
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log(`✅ 导出成功！`);
    console.log(`   文件: ${outputPath}`);
    console.log(`   窗口数: ${result.rows.length}`);
    console.log(`   玩家: ${exportData.metadata.player_name}`);
    console.log(`   文件大小: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ 导出失败:', error);
  } finally {
    await client.end();
  }
}

// 命令行参数
const checksum = process.argv[2];
const playerSteamId = process.argv[3];
const roundNumber = parseInt(process.argv[4]);
const outputPath = process.argv[5];

if (!checksum || !playerSteamId || !roundNumber || !outputPath) {
  console.log('用法: node export-training-metadata.mjs <checksum> <player_steam_id> <round_number> <output_path>');
  console.log('');
  console.log('示例:');
  console.log('  node export-training-metadata.mjs c6c0a055158ff5fe 76561199138765870 1 metadata.json');
  process.exit(1);
}

exportTrainingData(checksum, playerSteamId, roundNumber, outputPath);
