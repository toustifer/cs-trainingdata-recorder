#!/usr/bin/env python3
import re

file_path = 'D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并替换checkDataExists函数
pattern = r'(// 检查数据是否已存在\nasync function checkDataExists\(checksum, playerSteamId, roundNumber\) \{)\n  (try \{[\s\S]*?)(const client = new Client\([\s\S]*?\);)\n([\s\S]*?await client\.connect\(\);[\s\S]*?await client\.query\([\s\S]*?\);)\n\s*await client\.end\(\);\n([\s\S]*?  \} catch \(error\) \{[\s\S]*?\})\n\}'

replacement = r'\1\n  let client = null;\n  \2\3\n\4\n\5\n  } finally {\n    // 确保总是关闭连接，避免连接泄漏\n    if (client) {\n      try {\n        await client.end();\n      } catch (e) {\n        // 忽略关闭连接时的错误\n      }\n    }\n  }\n}'

# 执行替换
new_content = content.replace(
    'const client = new Client({',
    'client = new Client({'
).replace(
    '    await client.end();\n\n    const dbCount',
    '    const dbCount'
)

# 添加finally块
new_content = new_content.replace(
    '  } catch (error) {\n    return { exists: false, reason: `检查失败: ${error.message}` };\n  }\n}',
    '  } catch (error) {\n    return { exists: false, reason: `检查失败: ${error.message}` };\n  } finally {\n    // 确保总是关闭连接，避免连接泄漏\n    if (client) {\n      try {\n        await client.end();\n      } catch (e) {\n        // 忽略关闭连接时的错误\n      }\n    }\n  }\n}'
)

# 添加client声明
new_content = new_content.replace(
    'async function checkDataExists(checksum, playerSteamId, roundNumber) {\n  try {',
    'async function checkDataExists(checksum, playerSteamId, roundNumber) {\n  let client = null;\n  try {'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ 修复完成！")
print("- 添加了 finally 块确保连接总是被关闭")
print("- 防止数据库连接泄漏")
