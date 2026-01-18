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

async function estimateDatasetSize(matchChecksum) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('📊 数据集大小预估\n');
  console.log('='.repeat(80));

  try {
    // 1. 获取比赛基本信息
    const matchQuery = `
      SELECT
        name, map_name, duration, tick_count, tickrate
      FROM matches
      WHERE checksum = $1
    `;
    const matchResult = await client.query(matchQuery, [matchChecksum]);
    const match = matchResult.rows[0];

    console.log('【比赛信息】');
    console.log(`地图: ${match.map_name}`);
    console.log(`总时长: ${(match.duration / 60).toFixed(1)} 分钟 (${match.duration} 秒)`);
    console.log(`Tick数: ${match.tick_count} (@ ${match.tickrate} tick/s)`);

    // 2. 获取回合信息
    const roundsQuery = `
      SELECT
        number,
        start_tick,
        end_tick,
        (end_tick - start_tick) / 64.0 as duration_seconds
      FROM rounds
      WHERE match_checksum = $1
      ORDER BY number
    `;
    const roundsResult = await client.query(roundsQuery, [matchChecksum]);
    const rounds = roundsResult.rows;

    const totalRoundDuration = rounds.reduce((sum, r) => sum + parseFloat(r.duration_seconds), 0);
    const avgRoundDuration = totalRoundDuration / rounds.length;
    const minRoundDuration = Math.min(...rounds.map(r => parseFloat(r.duration_seconds)));
    const maxRoundDuration = Math.max(...rounds.map(r => parseFloat(r.duration_seconds)));

    console.log(`\n回合数: ${rounds.length}`);
    console.log(`回合时长统计:`);
    console.log(`  - 最短: ${minRoundDuration.toFixed(1)} 秒`);
    console.log(`  - 最长: ${maxRoundDuration.toFixed(1)} 秒`);
    console.log(`  - 平均: ${avgRoundDuration.toFixed(1)} 秒`);
    console.log(`  - 总计: ${(totalRoundDuration / 60).toFixed(1)} 分钟`);

    // 3. 获取玩家信息
    const playersQuery = `
      SELECT COUNT(DISTINCT steam_id) as total_players
      FROM players
      WHERE match_checksum = $1
    `;
    const playersResult = await client.query(playersQuery, [matchChecksum]);
    const totalPlayers = playersResult.rows[0].total_players;

    console.log(`\n玩家数: ${totalPlayers} 人`);

    // 4. 分析已有数据
    const existingQuery = `
      SELECT
        COUNT(*) as window_count,
        MIN(start_tick) as first_tick,
        MAX(end_tick) as last_tick,
        (MAX(end_tick) - MIN(start_tick)) / 64.0 as recorded_duration,
        COUNT(DISTINCT player_steam_id) as recorded_players,
        COUNT(DISTINCT round_number) as recorded_rounds
      FROM training_windows
      WHERE match_checksum = $1
    `;
    const existingResult = await client.query(existingQuery, [matchChecksum]);
    const existing = existingResult.rows[0];

    console.log('\n【已录制数据】');
    console.log(`回合数: ${existing.recorded_rounds} / ${rounds.length}`);
    console.log(`玩家数: ${existing.recorded_players} / ${totalPlayers}`);
    console.log(`时间窗口: ${existing.window_count} 个`);
    console.log(`录制时长: ${parseFloat(existing.recorded_duration).toFixed(1)} 秒`);

    // 5. 计算当前数据量
    const currentDataPath = 'D:/myprogram/cs_learning/dataset/1/training_data';
    let currentSizeMB = 0;
    let currentFrameCount = 0;

    if (fs.existsSync(currentDataPath)) {
      // 计算目录大小
      const calcDirSize = (dirPath) => {
        let totalSize = 0;
        let frameCount = 0;
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
          const itemPath = `${dirPath}/${item}`;
          const stats = fs.statSync(itemPath);

          if (stats.isDirectory()) {
            const result = calcDirSize(itemPath);
            totalSize += result.size;
            frameCount += result.count;
          } else {
            totalSize += stats.size;
            if (item.endsWith('.jpg')) {
              frameCount++;
            }
          }
        }

        return { size: totalSize, count: frameCount };
      };

      const result = calcDirSize(currentDataPath);
      currentSizeMB = result.size / 1024 / 1024;
      currentFrameCount = result.count;
    }

    console.log(`\n当前数据量:`);
    console.log(`  - 图片数: ${currentFrameCount} 张`);
    console.log(`  - 磁盘占用: ${currentSizeMB.toFixed(2)} MB (未压缩)`);
    console.log(`  - 每窗口: ${(currentSizeMB / existing.window_count).toFixed(2)} MB`);
    console.log(`  - 每帧: ${(currentSizeMB / currentFrameCount * 1024).toFixed(2)} KB`);
    console.log(`  - 每秒: ${(currentSizeMB / parseFloat(existing.recorded_duration)).toFixed(2)} MB`);

    // 6. 预估完整数据集
    console.log('\n' + '='.repeat(80));
    console.log('【数据集预估】\n');

    // 基于实际数据的计算
    const mbPerSecond = currentSizeMB / parseFloat(existing.recorded_duration);
    const mbPerWindow = currentSizeMB / existing.window_count;
    const framesPerSecond = currentFrameCount / parseFloat(existing.recorded_duration);

    // 场景1：录制所有回合的1个玩家
    const scenario1_duration = totalRoundDuration;
    const scenario1_windows = Math.round(scenario1_duration / 0.406);
    const scenario1_frames = scenario1_windows * 10;
    const scenario1_sizeMB = scenario1_duration * mbPerSecond;

    console.log('📦 场景1：单个玩家，所有回合');
    console.log(`  回合数: ${rounds.length}`);
    console.log(`  时长: ${(scenario1_duration / 60).toFixed(1)} 分钟`);
    console.log(`  时间窗口: ${scenario1_windows.toLocaleString()} 个`);
    console.log(`  图片帧数: ${scenario1_frames.toLocaleString()} 张`);
    console.log(`  未压缩: ${scenario1_sizeMB.toFixed(0)} MB (${(scenario1_sizeMB / 1024).toFixed(2)} GB)`);
    console.log(`  压缩后: ~${(scenario1_sizeMB * 0.95).toFixed(0)} MB (${(scenario1_sizeMB * 0.95 / 1024).toFixed(2)} GB)`);

    // 场景2：录制所有回合的所有玩家
    const scenario2_sizeMB = scenario1_sizeMB * totalPlayers;
    const scenario2_windows = scenario1_windows * totalPlayers;
    const scenario2_frames = scenario1_frames * totalPlayers;

    console.log('\n📦 场景2：所有玩家，所有回合');
    console.log(`  玩家数: ${totalPlayers}`);
    console.log(`  回合数: ${rounds.length}`);
    console.log(`  总时长: ${(scenario1_duration * totalPlayers / 60).toFixed(1)} 分钟 (${totalPlayers}人并行)`);
    console.log(`  时间窗口: ${scenario2_windows.toLocaleString()} 个`);
    console.log(`  图片帧数: ${scenario2_frames.toLocaleString()} 张`);
    console.log(`  未压缩: ${scenario2_sizeMB.toFixed(0)} MB (${(scenario2_sizeMB / 1024).toFixed(2)} GB)`);
    console.log(`  压缩后: ~${(scenario2_sizeMB * 0.95).toFixed(0)} MB (${(scenario2_sizeMB * 0.95 / 1024).toFixed(2)} GB)`);

    // 场景3：录制5个最长的回合，1个玩家
    const longestRounds = rounds
      .sort((a, b) => parseFloat(b.duration_seconds) - parseFloat(a.duration_seconds))
      .slice(0, 5);
    const scenario3_duration = longestRounds.reduce((sum, r) => sum + parseFloat(r.duration_seconds), 0);
    const scenario3_windows = Math.round(scenario3_duration / 0.406);
    const scenario3_frames = scenario3_windows * 10;
    const scenario3_sizeMB = scenario3_duration * mbPerSecond;

    console.log('\n📦 场景3：单个玩家，最长5回合（高质量样本）');
    console.log(`  回合: ${longestRounds.map(r => r.number).join(', ')}`);
    console.log(`  时长: ${(scenario3_duration / 60).toFixed(1)} 分钟`);
    console.log(`  时间窗口: ${scenario3_windows.toLocaleString()} 个`);
    console.log(`  图片帧数: ${scenario3_frames.toLocaleString()} 张`);
    console.log(`  未压缩: ${scenario3_sizeMB.toFixed(0)} MB (${(scenario3_sizeMB / 1024).toFixed(2)} GB)`);
    console.log(`  压缩后: ~${(scenario3_sizeMB * 0.95).toFixed(0)} MB (${(scenario3_sizeMB * 0.95 / 1024).toFixed(2)} GB)`);

    // 按回合长度分组统计
    console.log('\n【回合时长分布】');
    const durationGroups = {
      '0-30s': 0,
      '30-60s': 0,
      '60-90s': 0,
      '90-120s': 0,
      '>120s': 0
    };

    rounds.forEach(r => {
      const dur = parseFloat(r.duration_seconds);
      if (dur < 30) durationGroups['0-30s']++;
      else if (dur < 60) durationGroups['30-60s']++;
      else if (dur < 90) durationGroups['60-90s']++;
      else if (dur < 120) durationGroups['90-120s']++;
      else durationGroups['>120s']++;
    });

    Object.entries(durationGroups).forEach(([range, count]) => {
      const percentage = ((count / rounds.length) * 100).toFixed(1);
      console.log(`  ${range.padEnd(10)}: ${count.toString().padStart(2)} 回合 (${percentage}%)`);
    });

    // 预估录制时间
    console.log('\n【录制时间预估】');
    console.log('基于当前录制速度（包括CS2启动、录制、保存）:');

    const currentRecordingTime = 120; // 假设当前录制一个回合用了约2分钟
    const timePerRound = currentRecordingTime / parseFloat(existing.recorded_duration);

    console.log(`  - 单回合平均: ~${(avgRoundDuration * timePerRound / 60).toFixed(1)} 分钟`);
    console.log(`  - 场景1 (1人23回合): ~${(scenario1_duration * timePerRound / 3600).toFixed(1)} 小时`);
    console.log(`  - 场景2 (10人23回合): ~${(scenario2_sizeMB / currentSizeMB * currentRecordingTime / 3600).toFixed(1)} 小时`);

    console.log('\n' + '='.repeat(80));
    console.log('【建议】\n');
    console.log('💡 推荐策略：');
    console.log('  1. 优先录制长回合（>60秒）- 数据密度更高');
    console.log('  2. 选择表现活跃的玩家（击杀数多、存活时间长）');
    console.log('  3. 分批录制，每次2-3个回合，验证质量后再继续');
    console.log('  4. 考虑只录制特定队伍（CT或T）减少50%数据量');
    console.log('\n⚠️  注意：');
    console.log('  - 图片质量设置会显著影响大小（当前JPG质量约85%）');
    console.log('  - 压缩比约95%（JPG已压缩，tar.gz效果有限）');
    console.log('  - 建议预留比预估值多20%的磁盘空间');

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await client.end();
  }
}

// 命令行参数
const matchChecksum = process.argv[2] || 'c6c0a055158ff5fe';
estimateDatasetSize(matchChecksum);
