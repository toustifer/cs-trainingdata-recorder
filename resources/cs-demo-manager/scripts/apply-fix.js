#!/usr/bin/env node

const fs = require('fs');
const filePath = 'D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs';

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// 找到函数开始和结束
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async function checkDataExists(checksum, playerSteamId, roundNumber)')) {
    startIdx = i;
  }
  if (startIdx !== -1 && i > startIdx && lines[i] === '}') {
    endIdx = i;
    break;
  }
}

if (startIdx === -1 || endIdx === -1) {
  console.error('找不到函数');
  process.exit(1);
}

const newFunction = `// 检查数据是否已存在
async function checkDataExists(checksum, playerSteamId, roundNumber) {
  let client = null;
  try {
    // 检查数据库
    const { default: pg } = await import('pg');
    const { Client } = pg;

    client = new Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '88683139',
      database: 'csdm',
    });

    await client.connect();

    const result = await client.query(
      \`SELECT COUNT(*) as count,
              player_name,
              MIN(start_tick) as min_tick,
              MAX(end_tick) as max_tick
       FROM training_windows
       WHERE match_checksum = $1
         AND player_steam_id = $2
         AND round_number = $3
       GROUP BY player_name\`,
      [checksum, playerSteamId, roundNumber]
    );

    const dbCount = parseInt(result.rows[0]?.count || 0);
    const playerName = result.rows[0]?.player_name;

    if (dbCount === 0) {
      return { exists: false, reason: '数据库无记录' };
    }

    // 检查图片文件
    const outputRoot = 'F:/cs_data/traindata';
    const outputFolder = \`\${playerName}_\${playerSteamId}_round\${roundNumber}\`;
    const framesPath = path.join(outputRoot, outputFolder, 'frames');

    if (!await fs.pathExists(framesPath)) {
      return { exists: false, reason: '图片目录不存在', dbCount };
    }

    const files = await fs.readdir(framesPath);
    const jpgFiles = files.filter(f => f.endsWith('.jpg'));
    const expectedFiles = dbCount * 10;

    if (jpgFiles.length === 0) {
      return { exists: false, reason: '图片文件缺失', dbCount, actualFiles: 0, expectedFiles };
    }

    if (jpgFiles.length < expectedFiles) {
      return { exists: false, reason: '图片不完整', dbCount, actualFiles: jpgFiles.length, expectedFiles };
    }

    return { exists: true, dbCount, actualFiles: jpgFiles.length };

  } catch (error) {
    return { exists: false, reason: \`检查失败: \${error.message}\` };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // 忽略关闭错误
      }
    }
  }
}`;

// 替换函数
const before = lines.slice(0, startIdx);
const after = lines.slice(endIdx + 1);
const result = [...before, ...newFunction.split('\n'), ...after].join('\n');

fs.writeFileSync(filePath, result, 'utf8');

console.log('✅ 修复完成！');
console.log(`  函数位置: 第${startIdx + 1}-${endIdx + 1}行`);
console.log('  主要修复:');
console.log('    1. 添加了 let client = null; 声明');
console.log('    2. 添加了 GROUP BY player_name');
console.log('    3. 使用可选链 ?. 处理空值');
console.log('    4. 添加了 finally 块确保连接关闭');
