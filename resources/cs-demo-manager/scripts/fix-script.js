// 彻底修复 smart-batch-pipeline.mjs
const fs = require('fs');

const filePath = 'D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs';
let content = fs.readFileSync(filePath, 'utf8');

// 找到checkDataExists函数并完全替换
const oldFunction = /\/\/ 检查数据是否已存在\nasync function checkDataExists\(checksum, playerSteamId, roundNumber\) \{[\s\S]*?\n\}/;

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
         AND round_number = $3\`,
      [checksum, playerSteamId, roundNumber]
    );

    const dbCount = parseInt(result.rows[0].count);
    const playerName = result.rows[0].player_name;

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
    // 确保总是关闭连接，避免连接泄漏
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // 忽略关闭连接时的错误
      }
    }
  }
}`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 脚本修复完成！');
