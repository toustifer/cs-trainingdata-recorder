#!/usr/bin/env node
import pkg from 'pg';
const { Client } = pkg;

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
};

async function analyzeTrainingDataHours(matchChecksum) {
  const client = new Client(DB_CONFIG);
  await client.connect();

  console.log('⏱️  训练数据时长分析\n');
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

    console.log('【Demo 基本信息】\n');
    console.log(`地图: ${match.map_name}`);
    console.log(`总时长: ${(match.duration / 60).toFixed(1)} 分钟 (${match.duration} 秒)`);
    console.log(`录制时长: ${(match.tick_count / match.tickrate / 60).toFixed(1)} 分钟`);
    console.log();

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
    const totalRoundMinutes = totalRoundDuration / 60;
    const totalRoundHours = totalRoundDuration / 3600;

    console.log('【可用训练数据时长】\n');
    console.log(`回合数: ${rounds.length}`);
    console.log(`有效游戏时长: ${totalRoundMinutes.toFixed(1)} 分钟 (${totalRoundHours.toFixed(2)} 小时)`);
    console.log();

    // 3. 计算不同录制方式的数据量
    const playersQuery = `
      SELECT COUNT(DISTINCT steam_id) as total_players
      FROM players
      WHERE match_checksum = $1
    `;
    const playersResult = await client.query(playersQuery, [matchChecksum]);
    const totalPlayers = playersResult.rows[0].total_players;

    console.log('='.repeat(80));
    console.log('【训练数据时长估算】\n');

    // 单个玩家
    const singlePlayerHours = totalRoundHours;
    const singlePlayerMinutes = totalRoundMinutes;

    console.log('📹 方案1：单个玩家录制');
    console.log(`  有效训练时长: ${singlePlayerMinutes.toFixed(1)} 分钟 (${singlePlayerHours.toFixed(2)} 小时)`);
    console.log(`  数据量: ${(singlePlayerHours * 6.23).toFixed(1)} GB`);
    console.log(`  时间窗口: ${Math.round(totalRoundDuration / 0.406).toLocaleString()} 个`);
    console.log(`  图片帧数: ${Math.round(totalRoundDuration / 0.406 * 10).toLocaleString()} 张`);
    console.log();

    // 10个玩家
    const tenPlayersHours = totalRoundHours * 10;
    const tenPlayersMinutes = totalRoundMinutes * 10;

    console.log('📹 方案2：10个玩家全部录制');
    console.log(`  有效训练时长: ${tenPlayersMinutes.toFixed(1)} 分钟 (${tenPlayersHours.toFixed(2)} 小时)`);
    console.log(`  数据量: ${(tenPlayersHours * 6.23).toFixed(1)} GB`);
    console.log(`  时间窗口: ${Math.round(totalRoundDuration / 0.406 * 10).toLocaleString()} 个`);
    console.log(`  图片帧数: ${Math.round(totalRoundDuration / 0.406 * 10 * 10).toLocaleString()} 张`);
    console.log();

    // 5个玩家（一队）
    const fivePlayersHours = totalRoundHours * 5;
    const fivePlayersMinutes = totalRoundMinutes * 5;

    console.log('📹 方案3：单队录制（5个玩家）');
    console.log(`  有效训练时长: ${fivePlayersMinutes.toFixed(1)} 分钟 (${fivePlayersHours.toFixed(2)} 小时)`);
    console.log(`  数据量: ${(fivePlayersHours * 6.23).toFixed(1)} GB`);
    console.log(`  时间窗口: ${Math.round(totalRoundDuration / 0.406 * 5).toLocaleString()} 个`);
    console.log(`  图片帧数: ${Math.round(totalRoundDuration / 0.406 * 5 * 10).toLocaleString()} 张`);
    console.log();

    console.log('='.repeat(80));
    console.log('【不同游戏类型对比】\n');

    // 不同类型比赛的估算
    const matchTypes = [
      { name: '快速碾压（16:0）', rounds: 16, avgDuration: 60 },
      { name: '正常比赛（16:10）', rounds: 26, avgDuration: 70 },
      { name: '当前比赛', rounds: rounds.length, avgDuration: totalRoundDuration / rounds.length },
      { name: '焦灼局（15:15）', rounds: 30, avgDuration: 70 },
    ];

    matchTypes.forEach(type => {
      const totalSeconds = type.rounds * type.avgDuration;
      const minutes = totalSeconds / 60;
      const hours = totalSeconds / 3600;
      const dataGB = hours * 6.23;

      console.log(`${type.name}:`);
      console.log(`  回合数: ${type.rounds}`);
      console.log(`  训练时长: ${minutes.toFixed(1)} 分钟 (${hours.toFixed(2)} 小时/玩家)`);
      console.log(`  数据量: ${dataGB.toFixed(1)} GB/玩家`);
      console.log();
    });

    console.log('='.repeat(80));
    console.log('【训练数据与录制时长对比】\n');

    const recordingOverhead = 5.2; // 录制倍率
    const actualRecordingHours = singlePlayerHours * recordingOverhead;

    console.log(`游戏实际时长: ${singlePlayerHours.toFixed(2)} 小时`);
    console.log(`训练数据时长: ${singlePlayerHours.toFixed(2)} 小时 (相同)`);
    console.log(`实际录制时长: ${actualRecordingHours.toFixed(2)} 小时 (包括CS2启动、保存等)`);
    console.log(`录制效率: ${(singlePlayerHours / actualRecordingHours * 100).toFixed(1)}%`);
    console.log();

    console.log('💡 说明:');
    console.log('  - "训练数据时长"是指模型可以学习的有效游戏时长');
    console.log('  - "录制时长"是指实际需要的录制时间（包括等待和保存）');
    console.log('  - 录制时长 ≈ 训练数据时长 × 5.2 倍');
    console.log();

    console.log('='.repeat(80));
    console.log('【规模化统计】\n');

    const scales = [
      { demos: 1, name: '单个demo' },
      { demos: 10, name: '10个demo' },
      { demos: 50, name: '50个demo' },
      { demos: 100, name: '100个demo' },
      { demos: 500, name: '500个demo' },
      { demos: 1000, name: '1000个demo' }
    ];

    scales.forEach(scale => {
      const trainingHours = singlePlayerHours * scale.demos;
      const trainingDays = trainingHours / 24;
      const dataGB = trainingHours * 6.23;
      const dataTB = dataGB / 1024;
      const recordingDays = trainingHours * recordingOverhead / 24;

      console.log(`${scale.name} (单玩家):`);
      console.log(`  训练数据时长: ${trainingHours.toFixed(1)} 小时 (${trainingDays.toFixed(1)} 天)`);

      if (dataTB < 1) {
        console.log(`  数据量: ${dataGB.toFixed(1)} GB`);
      } else {
        console.log(`  数据量: ${dataTB.toFixed(2)} TB (${dataGB.toFixed(0)} GB)`);
      }

      console.log(`  录制时间: ${recordingDays.toFixed(1)} 天`);
      console.log();
    });

    console.log('='.repeat(80));
    console.log('【时间窗口详细分析】\n');

    const windowDuration = 0.406; // 秒
    const framesPerWindow = 10;
    const windowsCount = Math.round(totalRoundDuration / windowDuration);

    console.log(`时间窗口长度: ${windowDuration} 秒 (406ms)`);
    console.log(`每个窗口帧数: ${framesPerWindow} 帧`);
    console.log(`帧率: 25 fps`);
    console.log(`窗口重叠: 无（连续采样）`);
    console.log();

    console.log(`当前demo统计（单玩家）:`);
    console.log(`  总窗口数: ${windowsCount.toLocaleString()} 个`);
    console.log(`  总帧数: ${(windowsCount * framesPerWindow).toLocaleString()} 张`);
    console.log(`  覆盖时长: ${(windowsCount * windowDuration / 60).toFixed(1)} 分钟`);
    console.log(`  采样率: ${(windowsCount * windowDuration / totalRoundDuration * 100).toFixed(1)}%`);
    console.log();

    console.log('='.repeat(80));
    console.log('【关键指标总结】\n');

    console.log(`📊 当前 Demo (${match.name}):`);
    console.log(`  - 地图: ${match.map_name}`);
    console.log(`  - 回合数: ${rounds.length}`);
    console.log(`  - 玩家数: ${totalPlayers}`);
    console.log();

    console.log(`⏱️  训练数据时长（单玩家）:`);
    console.log(`  - ${singlePlayerMinutes.toFixed(1)} 分钟`);
    console.log(`  - ${singlePlayerHours.toFixed(2)} 小时`);
    console.log();

    console.log(`💾 数据量（单玩家）:`);
    console.log(`  - ${(singlePlayerHours * 6.23).toFixed(1)} GB`);
    console.log(`  - ${windowsCount.toLocaleString()} 个时间窗口`);
    console.log(`  - ${(windowsCount * 10).toLocaleString()} 张图片`);
    console.log();

    console.log(`🔢 倍数关系:`);
    console.log(`  - 10个玩家 = ${tenPlayersHours.toFixed(2)} 小时 (${(tenPlayersHours * 6.23).toFixed(1)} GB)`);
    console.log(`  - 10个demo = ${(singlePlayerHours * 10).toFixed(2)} 小时 (${(singlePlayerHours * 10 * 6.23).toFixed(1)} GB)`);
    console.log(`  - 100个demo = ${(singlePlayerHours * 100).toFixed(1)} 小时 (${(singlePlayerHours * 100 * 6.23 / 1024).toFixed(2)} TB)`);

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await client.end();
  }
}

// 命令行参数
const matchChecksum = process.argv[2] || 'c6c0a055158ff5fe';
analyzeTrainingDataHours(matchChecksum);
