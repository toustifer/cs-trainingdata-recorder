#!/usr/bin/env python3
import sys

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 在第281行之前插入 outputArg 定义
lines.insert(280, '          const outputArg = outputPath ? ` --output "${outputPath}"` : "";\n')

# 修改第282行（现在是283）添加 outputArg
for i, line in enumerate(lines):
    if 'node out/cli.js training-data' in line and '--players' in line:
        lines[i] = line.replace("batch.join(',')}`,", "batch.join(',')}\${outputArg}`,")
        break

with open('D:/myprogram/cs_learning/tools/cs-demo-manager/scripts/smart-batch-pipeline.mjs', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("修改完成")
