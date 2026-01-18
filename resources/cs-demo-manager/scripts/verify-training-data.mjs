import { db } from '../src/node/database/database.js';
import { createDatabaseConnection } from '../src/node/database/database.js';
import { getSettings } from '../src/node/settings/get-settings.js';
import fs from 'fs';

async function main() {
  const settings = await getSettings();
  createDatabaseConnection(settings.database);

  // 查询一条完整的训练数据
  const sample = await db
    .selectFrom('training_windows')
    .selectAll()
    .where('window_idx', '=', 0)
    .executeTakeFirst();

  if (!sample) {
    console.log('❌ 没有找到训练数据');
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('训练数据完整性验证');
  console.log('='.repeat(80));
  console.log('');

  // 解析 JSON 字段
  const middleFrames = JSON.parse(sample.middle_frame_paths);
  const events = JSON.parse(sample.events_json);

  console.log('✅ 元数据完整性检查：');
  console.log('');
  console.log(`Demo checksum: ${sample.match_checksum}`);
  console.log(`回合号: ${sample.round_number}`);
  console.log(`玩家: ${sample.player_name} (${sample.player_steam_id})`);
  console.log(`窗口索引: ${sample.window_idx}`);
  console.log(`Tick 范围: ${sample.start_tick} - ${sample.end_tick}`);
  console.log(`时间: ${sample.time_ms}ms`);
  console.log('');

  console.log('📍 玩家状态：');
  console.log(`  位置: (${sample.pos_x.toFixed(1)}, ${sample.pos_y.toFixed(1)}, ${sample.pos_z.toFixed(1)})`);
  console.log(`  视角: pitch=${sample.view_pitch.toFixed(1)}°, yaw=${sample.view_yaw.toFixed(1)}°`);
  console.log(`  生命: ${sample.health} HP`);
  console.log(`  护甲: ${sample.armor}`);
  console.log(`  武器: ${sample.weapon}`);
  console.log(`  队伍: ${sample.team}`);
  console.log(`  金钱: $${sample.money}`);
  console.log(`  存活: ${sample.is_alive ? '是' : '否'}`);
  console.log(`  蹲下: ${sample.is_crouching ? '是' : '否'}`);
  console.log(`  开镜: ${sample.is_scoped ? '是' : '否'}`);
  console.log('');

  console.log('🏃 移动状态：');
  console.log(`  移动中: ${sample.is_moving ? '是' : '否'}`);
  console.log(`  方向: ${sample.move_direction}`);
  console.log(`  速度: ${sample.move_speed}`);
  console.log('');

  console.log('📝 Situation（起始帧之前）：');
  console.log(`  ${sample.situation_text}`);
  console.log('');

  console.log('⚡ 事件（窗口内）：');
  if (events.length > 0) {
    events.forEach(e => {
      console.log(`  [Tick ${e.tick}] ${e.description}`);
    });
  } else {
    console.log(`  无事件`);
  }
  console.log(`  中文描述: ${sample.events_zh || '无'}`);
  console.log('');

  console.log('🎬 帧路径（10帧，25fps）：');
  console.log(`  [1] 起始帧: ${sample.start_frame_path}`);
  middleFrames.forEach((frame, i) => {
    console.log(`  [${i + 2}] 中间帧: ${frame}`);
  });
  console.log(`  [10] 结束帧: ${sample.end_frame_path}`);
  console.log('');

  // 检查图片是否存在
  console.log('📷 图片文件检查：');
  const framesToCheck = [
    sample.start_frame_path,
    ...middleFrames,
    sample.end_frame_path
  ];

  let existCount = 0;
  let missingCount = 0;

  for (const framePath of framesToCheck) {
    if (fs.existsSync(framePath)) {
      existCount++;
    } else {
      missingCount++;
    }
  }

  if (existCount > 0) {
    console.log(`  ✅ 已存在: ${existCount} 个`);
  }
  if (missingCount > 0) {
    console.log(`  ❌ 缺失: ${missingCount} 个`);
  }
  console.log('');

  // 生成训练数据示例
  console.log('='.repeat(80));
  console.log('🎯 训练数据格式示例（Python）');
  console.log('='.repeat(80));
  console.log('');
  console.log('```python');
  console.log('training_sample = {');
  console.log('    # 输入：10帧图片');
  console.log(`    "frames": [`);
  console.log(`        "${sample.start_frame_path.replace(/\\/g, '/')}",  # 起始帧`);
  middleFrames.slice(0, 2).forEach(f => {
    console.log(`        "${f.replace(/\\/g, '/')}",  # 中间帧`);
  });
  console.log(`        ...  # 更多中间帧`);
  console.log(`        "${sample.end_frame_path.replace(/\\/g, '/')}",  # 结束帧`);
  console.log(`    ],`);
  console.log('    ');
  console.log('    # 标签：玩家状态');
  console.log(`    "player_state": {`);
  console.log(`        "position": [${sample.pos_x.toFixed(2)}, ${sample.pos_y.toFixed(2)}, ${sample.pos_z.toFixed(2)}],`);
  console.log(`        "health": ${sample.health},`);
  console.log(`        "armor": ${sample.armor},`);
  console.log(`        "weapon": "${sample.weapon}",`);
  console.log(`        "is_moving": ${sample.is_moving ? 'True' : 'False'},`);
  console.log(`        "move_direction": "${sample.move_direction}",`);
  console.log(`    },`);
  console.log('    ');
  console.log('    # 标签：事件');
  console.log(`    "events": ${JSON.stringify(events.map(e => ({ tick: e.tick, type: e.type, description: e.description })), null, 8).replace(/\n/g, '\n    ')},`);
  console.log('    ');
  console.log('    # 标签：情况描述');
  console.log(`    "situation": "${sample.situation_text}",`);
  console.log('}');
  console.log('```');
  console.log('');

  // 总结
  console.log('='.repeat(80));
  console.log('📊 总结');
  console.log('='.repeat(80));
  console.log('');

  const total = await db
    .selectFrom('training_windows')
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst();

  console.log(`✅ 元数据：${total.count} 个时间窗口已导出到数据库`);

  if (missingCount > 0) {
    console.log(`❌ 图片：${missingCount} 个图片文件缺失`);
    console.log('');
    console.log('⚠️  下一步：运行视频录制命令生成图片');
    console.log('');
    console.log('   node out/cli.js generate-frames --checksum ' + sample.match_checksum);
    console.log('');
    console.log('   或使用完整流水线（如果还未导出元数据）：');
    console.log('');
    console.log('   node scripts/full-training-pipeline.mjs <demo路径> --players <id> --rounds <n>');
  } else {
    console.log(`✅ 图片：所有 ${existCount} 个图片文件已存在`);
    console.log('');
    console.log('🎉 数据完整！可以开始训练了！');
  }

  console.log('');
  process.exit(0);
}

main().catch(console.error);
