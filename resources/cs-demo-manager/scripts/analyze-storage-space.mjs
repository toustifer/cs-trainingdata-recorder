#!/usr/bin/env node

console.log('💾 存储空间分析报告\n');
console.log('='.repeat(80));

// 当前磁盘状态
const currentDisk = {
  total: 452,      // GB
  used: 332,       // GB
  available: 120,  // GB
  usagePercent: 74
};

// 当前数据集占用
const currentDataset = {
  demo: 0.323,     // GB (323 MB)
  training: 0.04,  // GB (40 MB)
  total: 0.462     // GB (462 MB)
};

// 不同规模的需求
const dataNeeds = {
  small: {
    name: '小规模验证（1人×10场）',
    dataGB: 27.5,
    description: '验证算法可行性'
  },
  medium: {
    name: '中等规模（10人×10场）',
    dataGB: 275,
    description: '训练原型模型'
  },
  large: {
    name: '大规模（50人×10场）',
    dataGB: 687,
    description: '生产级模型'
  },
  xlarge: {
    name: '超大规模（100人×10场）',
    dataGB: 2747,
    description: '完整数据集'
  }
};

console.log('【当前磁盘状态】\n');
console.log(`磁盘：D盘`);
console.log(`总容量：${currentDisk.total} GB`);
console.log(`已使用：${currentDisk.used} GB (${currentDisk.usagePercent}%)`);
console.log(`可用空间：${currentDisk.available} GB`);
console.log();

console.log(`当前数据集占用：${currentDataset.total.toFixed(2)} GB`);
console.log(`  - Demo 文件：${currentDataset.demo.toFixed(2)} GB`);
console.log(`  - 训练数据：${currentDataset.training.toFixed(2)} GB`);
console.log();

console.log('='.repeat(80));
console.log('【存储空间评估】\n');

Object.entries(dataNeeds).forEach(([key, need]) => {
  const totalNeeded = need.dataGB + 10; // 预留10GB缓冲
  const canFit = totalNeeded <= currentDisk.available;
  const remaining = currentDisk.available - totalNeeded;
  const utilizationAfter = ((currentDisk.used + totalNeeded) / currentDisk.total * 100).toFixed(1);

  console.log(`📦 ${need.name}`);
  console.log(`   数据量：${need.dataGB.toFixed(1)} GB`);
  console.log(`   需要空间：${totalNeeded.toFixed(1)} GB（含缓冲）`);

  if (canFit) {
    console.log(`   状态：✅ 可以存储`);
    console.log(`   剩余空间：${remaining.toFixed(1)} GB`);
    console.log(`   存储后占用：${utilizationAfter}%`);
  } else {
    const shortage = totalNeeded - currentDisk.available;
    console.log(`   状态：❌ 空间不足`);
    console.log(`   缺少：${shortage.toFixed(1)} GB`);
    console.log(`   需要清理或扩容`);
  }
  console.log();
});

console.log('='.repeat(80));
console.log('【建议方案】\n');

// 方案评估
const solutions = [];

// 方案1：当前空间使用
if (currentDisk.available >= 37.5) {
  solutions.push({
    name: '方案1：使用当前空间（小规模）',
    description: '在D盘录制 1人×10场',
    dataSize: 27.5,
    cost: 0,
    priority: '⭐⭐⭐'
  });
}

// 方案2：清理+当前空间
if (currentDisk.available >= 100) {
  solutions.push({
    name: '方案2：清理后使用（中等规模）',
    description: '清理30-50GB后，录制10人×10场',
    dataSize: 275,
    cost: 0,
    priority: '⭐⭐'
  });
}

// 方案3：外置硬盘
solutions.push({
  name: '方案3：购买外置HDD（推荐）',
  description: '2TB移动硬盘，可存储700场比赛',
  dataSize: 2000,
  cost: 400,
  priority: '⭐⭐⭐⭐⭐'
});

// 方案4：内置硬盘扩容
solutions.push({
  name: '方案4：升级内置存储',
  description: '加装2TB SSD或4TB HDD',
  dataSize: 2000,
  cost: 800,
  priority: '⭐⭐⭐⭐'
});

// 方案5：云存储
solutions.push({
  name: '方案5：云存储归档',
  description: '录制后上传OSS，本地只保留最新数据',
  dataSize: Infinity,
  cost: 120,
  priority: '⭐⭐⭐'
});

solutions.forEach((sol, idx) => {
  console.log(`${sol.name} ${sol.priority}`);
  console.log(`  说明：${sol.description}`);
  if (sol.dataSize !== Infinity) {
    console.log(`  容量：${sol.dataSize.toFixed(0)} GB`);
  }
  if (sol.cost > 0) {
    console.log(`  成本：¥${sol.cost}${idx === 4 ? '/月' : ''}`);
  }
  console.log();
});

console.log('='.repeat(80));
console.log('【详细分析】\n');

console.log('✅ 可以做的（当前空间 120 GB）：');
console.log('  ✓ 小规模验证：1-3人 × 5-10场（13-83 GB）');
console.log('  ✓ 算法原型：5人 × 5场（69 GB）');
console.log('  ✓ 初步训练：10人 × 3场（83 GB）');
console.log();

console.log('⚠️  勉强可以（需要清理空间）：');
console.log('  ⚠  中等规模：10人 × 10场（275 GB）- 需要清理150GB');
console.log('  ⚠  扩展训练：20人 × 10场（550 GB）- 需要清理430GB');
console.log();

console.log('❌ 不可行（需要扩容）：');
console.log('  ✗ 大规模：50人 × 10场（1.37 TB）');
console.log('  ✗ 超大规模：100人 × 10场（2.68 TB）');
console.log();

console.log('='.repeat(80));
console.log('【推荐策略】\n');

console.log('🎯 短期（1-2周）：');
console.log('  ✓ 使用当前空间录制 1-5人 × 5场');
console.log('  ✓ 验证数据质量和训练流程');
console.log('  ✓ 不需要额外投入');
console.log();

console.log('🎯 中期（1个月）：');
console.log('  ✓ 购买 2TB 移动硬盘（¥400）');
console.log('  ✓ 录制 50人 × 5场（687 GB）');
console.log('  ✓ 训练生产级模型');
console.log();

console.log('🎯 长期（3-6个月）：');
console.log('  ✓ 升级到 4TB HDD（¥800）或使用云存储');
console.log('  ✓ 录制 100人 × 10场（2.68 TB）');
console.log('  ✓ 构建完整数据集');
console.log();

console.log('='.repeat(80));
console.log('【空间优化建议】\n');

console.log('1. 清理 D 盘（可释放 50-100 GB）：');
console.log('   - 清理临时文件（Windows.old、Temp等）');
console.log('   - 移除不常用的游戏/软件');
console.log('   - 清理浏览器缓存');
console.log('   - 清理下载文件夹');
console.log();

console.log('2. 数据压缩（节省 5-10%）：');
console.log('   - 使用 tar.gz 压缩训练数据');
console.log('   - 删除原始未压缩文件');
console.log('   - 仅保留压缩包');
console.log();

console.log('3. 增量存储：');
console.log('   - 录制完一批数据后立即压缩并移动到外置硬盘');
console.log('   - 本地只保留正在处理的数据');
console.log('   - 可节省 70-80% 空间');
console.log();

console.log('4. 选择性录制（最有效）：');
console.log('   - 只录制长回合（>60秒）→ 节省 30%');
console.log('   - 降低分辨率到 960×540 → 节省 40%');
console.log('   - 降低帧率到 15fps → 节省 40%');
console.log('   - 只录制有事件的窗口 → 节省 50%');
console.log();

console.log('='.repeat(80));
console.log('【最终建议】\n');

console.log('💡 根据你的 120 GB 可用空间，我的建议是：\n');

console.log('👉 立即行动（本周）：');
console.log('   使用当前空间录制 5人 × 5场（69 GB）');
console.log('   - 成本：¥0');
console.log('   - 时间：2-3天');
console.log('   - 足够验证算法和训练原型');
console.log();

console.log('👉 近期规划（下月）：');
console.log('   购买 2TB 移动硬盘（¥400-500）');
console.log('   - 可存储 ~700 场比赛');
console.log('   - 足够训练生产级模型');
console.log('   - 性价比最高');
console.log();

console.log('👉 长期规划（3个月后）：');
console.log('   根据实际需求决定：');
console.log('   - 如果数据集<2TB：继续使用移动硬盘');
console.log('   - 如果数据集>2TB：升级内置硬盘或使用云存储');
console.log();

console.log('='.repeat(80));
console.log('💾 硬盘推荐（2026年价格）\n');

const diskRecommendations = [
  {
    type: '2TB 移动HDD',
    brand: '西部数据/希捷',
    price: 400,
    speed: '100 MB/s',
    suitable: '小-中规模（<500场）',
    priority: '⭐⭐⭐⭐⭐'
  },
  {
    type: '2TB 移动SSD',
    brand: '三星T7',
    price: 900,
    speed: '500 MB/s',
    suitable: '需要快速访问',
    priority: '⭐⭐⭐⭐'
  },
  {
    type: '4TB 内置HDD',
    brand: '西数蓝盘',
    price: 600,
    speed: '150 MB/s',
    suitable: '大规模（500-1500场）',
    priority: '⭐⭐⭐⭐'
  },
  {
    type: '2TB 内置SSD',
    brand: '三星980',
    price: 1200,
    speed: '3000 MB/s',
    suitable: '需要最快速度',
    priority: '⭐⭐⭐'
  }
];

diskRecommendations.forEach(disk => {
  console.log(`${disk.type} - ${disk.brand} ${disk.priority}`);
  console.log(`  价格：¥${disk.price}`);
  console.log(`  速度：${disk.speed}`);
  console.log(`  适合：${disk.suitable}`);
  console.log();
});
