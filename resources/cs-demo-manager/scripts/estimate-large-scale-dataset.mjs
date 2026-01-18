#!/usr/bin/env node

console.log('📊 大规模数据集预估：每个用户每场比赛\n');
console.log('='.repeat(80));

// 基于实际数据的基准
const benchmarkData = {
  recordedSeconds: 23.2,
  sizeMB: 40.19,
  windows: 57,
  frames: 605
};

// 计算每秒数据量
const mbPerSecond = benchmarkData.sizeMB / benchmarkData.recordedSeconds;

// CS2 竞技比赛的典型数据
const typicalMatch = {
  avgRounds: 23,              // 平均回合数（完整比赛）
  avgRoundDuration: 70.6,     // 平均每回合时长（秒）
  minRounds: 13,              // 最少回合（16:0）
  maxRounds: 30,              // 最多回合（15:15）
  shortMatchRounds: 12        // 短比赛模式
};

// 计算不同比赛模式的数据量
const matchTypes = {
  full: {
    name: '完整竞技比赛（BO1）',
    rounds: typicalMatch.avgRounds,
    duration: typicalMatch.avgRounds * typicalMatch.avgRoundDuration,
    sizeMB: 0,
    sizeGB: 0
  },
  short: {
    name: '短比赛模式',
    rounds: typicalMatch.shortMatchRounds,
    duration: typicalMatch.shortMatchRounds * typicalMatch.avgRoundDuration,
    sizeMB: 0,
    sizeGB: 0
  },
  stomp: {
    name: '碾压局（16:3）',
    rounds: 19,
    duration: 19 * typicalMatch.avgRoundDuration,
    sizeMB: 0,
    sizeGB: 0
  },
  close: {
    name: '焦灼局（15:15）',
    rounds: 30,
    duration: 30 * typicalMatch.avgRoundDuration,
    sizeMB: 0,
    sizeGB: 0
  }
};

// 计算大小
Object.keys(matchTypes).forEach(key => {
  const match = matchTypes[key];
  match.sizeMB = match.duration * mbPerSecond;
  match.sizeGB = match.sizeMB / 1024;
});

console.log('【单场比赛数据量（单个玩家）】\n');

Object.values(matchTypes).forEach(match => {
  console.log(`${match.name}:`);
  console.log(`  回合数: ${match.rounds}`);
  console.log(`  时长: ${(match.duration / 60).toFixed(1)} 分钟`);
  console.log(`  数据量: ${match.sizeMB.toFixed(0)} MB (${match.sizeGB.toFixed(2)} GB)`);
  console.log(`  压缩后: ~${(match.sizeMB * 0.95).toFixed(0)} MB (${(match.sizeGB * 0.95).toFixed(2)} GB)`);
  console.log();
});

console.log('='.repeat(80));
console.log('【规模化数据集预估】\n');

// 不同规模的数据集
const scales = [
  { users: 1, matches: 1, name: '单用户单场' },
  { users: 1, matches: 10, name: '单用户10场' },
  { users: 10, matches: 1, name: '10用户各1场' },
  { users: 10, matches: 10, name: '10用户各10场' },
  { users: 50, matches: 5, name: '50用户各5场' },
  { users: 100, matches: 10, name: '100用户各10场' },
  { users: 500, matches: 5, name: '500用户各5场' },
  { users: 1000, matches: 10, name: '1000用户各10场' }
];

const avgMatchSizeGB = matchTypes.full.sizeGB;

scales.forEach(scale => {
  const totalMatches = scale.users * scale.matches;
  const totalGB = totalMatches * avgMatchSizeGB;
  const totalTB = totalGB / 1024;
  const totalFrames = totalMatches * (matchTypes.full.duration / 0.406) * 10;
  const totalWindows = totalMatches * (matchTypes.full.duration / 0.406);

  console.log(`📦 ${scale.name}:`);
  console.log(`  总比赛数: ${totalMatches.toLocaleString()} 场`);
  console.log(`  时间窗口: ${totalWindows.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 个`);
  console.log(`  图片帧数: ${totalFrames.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 张`);

  if (totalTB < 1) {
    console.log(`  数据量: ${totalGB.toFixed(1)} GB`);
    console.log(`  压缩后: ~${(totalGB * 0.95).toFixed(1)} GB`);
  } else {
    console.log(`  数据量: ${totalTB.toFixed(2)} TB (${totalGB.toFixed(0)} GB)`);
    console.log(`  压缩后: ~${(totalTB * 0.95).toFixed(2)} TB`);
  }

  console.log();
});

console.log('='.repeat(80));
console.log('【存储成本估算】\n');

// 存储价格（2026年估算）
const storageCosts = {
  hdd: { name: 'HDD（机械硬盘）', pricePerTB: 200 },
  ssd: { name: 'SATA SSD', pricePerTB: 600 },
  nvme: { name: 'NVMe SSD', pricePerTB: 800 },
  cloud: { name: '云存储（OSS/S3）', pricePerTB: 120 }  // 每月
};

const exampleScale = scales.find(s => s.users === 100 && s.matches === 10);
const exampleSizeTB = exampleScale.users * exampleScale.matches * avgMatchSizeGB / 1024;

console.log(`示例：${exampleScale.name} (${exampleSizeTB.toFixed(2)} TB)\n`);

Object.entries(storageCosts).forEach(([key, storage]) => {
  const cost = exampleSizeTB * storage.pricePerTB;
  const isMonthly = key === 'cloud';

  console.log(`${storage.name}:`);
  console.log(`  单价: ¥${storage.pricePerTB}/TB${isMonthly ? '/月' : ''}`);
  console.log(`  总成本: ¥${cost.toFixed(0)}${isMonthly ? '/月' : ''}`);
  console.log();
});

console.log('='.repeat(80));
console.log('【数据收集时间估算】\n');

// 基于当前录制速度
const recordingOverhead = 5.2; // 实际录制时间 / 游戏时间（包括启动、保存等）
const avgMatchDuration = matchTypes.full.duration / 60; // 分钟

console.log(`单场比赛录制时间: ~${(avgMatchDuration * recordingOverhead).toFixed(1)} 分钟\n`);

scales.forEach(scale => {
  const totalMatches = scale.users * scale.matches;
  const totalMinutes = totalMatches * avgMatchDuration * recordingOverhead;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  console.log(`${scale.name}:`);

  if (totalDays < 1) {
    console.log(`  录制时间: ${totalHours.toFixed(1)} 小时`);
  } else if (totalDays < 30) {
    console.log(`  录制时间: ${totalDays.toFixed(1)} 天 (${totalHours.toFixed(0)} 小时)`);
  } else {
    console.log(`  录制时间: ${(totalDays / 30).toFixed(1)} 个月 (${totalDays.toFixed(0)} 天)`);
  }

  console.log();
});

console.log('='.repeat(80));
console.log('【数据采样策略建议】\n');

console.log('💡 策略1：精英采样');
console.log('  - 选择高段位玩家（至少荣耀1以上）');
console.log('  - 每人录制5-10场');
console.log('  - 优先录制长回合（>60秒）');
console.log('  - 预期数据质量：高');
console.log('  - 适合：竞技AI训练\n');

console.log('💡 策略2：多样化采样');
console.log('  - 覆盖多个段位（银色到荣耀）');
console.log('  - 每人录制3-5场');
console.log('  - 录制完整比赛');
console.log('  - 预期数据质量：中等');
console.log('  - 适合：泛化能力训练\n');

console.log('💡 策略3：大规模采样');
console.log('  - 大量玩家（500-1000人）');
console.log('  - 每人1-2场');
console.log('  - 只录制关键回合');
console.log('  - 预期数据质量：一般');
console.log('  - 适合：预训练模型\n');

console.log('='.repeat(80));
console.log('【实用建议】\n');

console.log('🎯 小规模研究（<10 GB）:');
console.log('  - 1-5个用户，每人5-10场');
console.log('  - 本地录制即可');
console.log('  - 适合算法验证\n');

console.log('🎯 中等规模（10-100 GB）:');
console.log('  - 10-50个用户，每人5场');
console.log('  - 需要自动化脚本');
console.log('  - 适合模型训练\n');

console.log('🎯 大规模（100 GB - 1 TB）:');
console.log('  - 50-200个用户，每人5-10场');
console.log('  - 需要分布式录制');
console.log('  - 适合生产级模型\n');

console.log('🎯 超大规模（>1 TB）:');
console.log('  - 500+用户');
console.log('  - 需要众包平台');
console.log('  - 适合基础模型预训练\n');

console.log('='.repeat(80));
console.log('【关键指标总结】\n');

console.log(`每秒数据量: ${mbPerSecond.toFixed(2)} MB/s`);
console.log(`每分钟数据量: ${(mbPerSecond * 60).toFixed(1)} MB`);
console.log(`每场比赛（平均）: ${avgMatchSizeGB.toFixed(2)} GB`);
console.log(`每1000场比赛: ${(avgMatchSizeGB * 1000 / 1024).toFixed(2)} TB`);
console.log(`每10万场比赛: ${(avgMatchSizeGB * 100000 / 1024 / 1024).toFixed(2)} PB`);
