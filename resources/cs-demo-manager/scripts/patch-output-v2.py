#!/usr/bin/env python3

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs.backup', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 添加 outputPath 变量
content = content.replace(
    'let batchSize = 10; // 默认每次录制10个回合\nlet forceRegenerate = false;',
    'let batchSize = 10; // 默认每次录制10个回合\nlet forceRegenerate = false;\nlet outputPath = null; // 输出路径'
)

# 2. 添加参数解析
content = content.replace(
    "  } else if (args[i] === '--force') {\n    forceRegenerate = true;\n  }",
    "  } else if (args[i] === '--output' && i + 1 < args.length) {\n    outputPath = args[i + 1];\n    i++;\n  } else if (args[i] === '--force') {\n    forceRegenerate = true;\n  }"
)

# 3. 修改 training-data 命令调用
old_cmd = '`node out/cli.js training-data "${demoPath}" --players ${player.player_steam_id} --rounds ${batch.join(\',\')}`,'
new_cmd = '`node out/cli.js training-data "${demoPath}" --players ${player.player_steam_id} --rounds ${batch.join(\',\')}${outputPath ? ` --output "${outputPath}"` : ""}`,'

content = content.replace(old_cmd, new_cmd)

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 修改完成！")
print("- 添加了 outputPath 变量")
print("- 添加了 --output 参数解析")
print("- 修改了 training-data 命令调用")
