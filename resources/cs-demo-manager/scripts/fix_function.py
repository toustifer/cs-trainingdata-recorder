import re

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 在函数开始后添加 let client = null;
content = content.replace(
    'async function checkDataExists(checksum, playerSteamId, roundNumber) {\n  try {',
    'async function checkDataExists(checksum, playerSteamId, roundNumber) {\n  let client = null;\n  try {'
)

# 2. 在SQL查询中添加 GROUP BY player_name
content = content.replace(
    '''         AND round_number = $3`,
      [checksum, playerSteamId, roundNumber]
    );''',
    '''         AND round_number = $3
       GROUP BY player_name`,
      [checksum, playerSteamId, roundNumber]
    );'''
)

# 3. 使用可选链处理空值
content = content.replace(
    '    const dbCount = parseInt(result.rows[0].count);',
    '    const dbCount = parseInt(result.rows[0]?.count || 0);'
)
content = content.replace(
    '    const playerName = result.rows[0].player_name;',
    '    const playerName = result.rows[0]?.player_name;'
)

# 4. 移除 await client.end(); 并在函数末尾添加 finally 块
content = content.replace(
    '''    await client.end();

    const dbCount''',
    '''    const dbCount'''
)

# 5. 在catch块后添加finally块
content = content.replace(
    '''  } catch (error) {
    return { exists: false, reason: `检查失败: ${error.message}` };
  }
}

async function main()''',
    '''  } catch (error) {
    return { exists: false, reason: `检查失败: ${error.message}` };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // 忽略关闭错误
      }
    }
  }
}

async function main()'''
)

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ 修复完成！')
print('主要修复:')
print('  1. 添加了 let client = null; 声明')
print('  2. 添加了 GROUP BY player_name')
print('  3. 使用可选链 ?. 处理空值')
print('  4. 添加了 finally 块确保连接关闭')
