# 训练数据完整流水线

## 概述

本流水线可以一次性处理 CS2 demo，生成两种数据：
1. **训练数据元数据**：存储在 PostgreSQL 数据库中
2. **视频帧图片**：通过启动 CS2 + HLAE 录制

## 数据格式

每个时间窗口（400ms，10帧，25fps）包含：
- ✅ **起始帧**（frame_0001.jpg）
- ✅ **中间帧**（frame_0002.jpg ~ frame_0009.jpg，共8帧）
- ✅ **结束帧**（frame_0010.jpg）
- ✅ **Situation**（起始帧之前的玩家状态）
- ✅ **Events**（窗口内发生的事件）

## 使用方法

### 方案A：完整流水线（推荐）

**一键运行，自动完成导出 + 录制：**

```bash
cd D:\myprogram\cs_learning\tools\cs-demo-manager

# 完整流程
node scripts/full-training-pipeline.mjs <demo路径> --players <Steam ID> --rounds <回合号>

# 示例：处理1个玩家的第1回合
node scripts/full-training-pipeline.mjs \
  "D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem" \
  --players 76561199138765870 \
  --rounds 1
```

### 方案B：分步执行

**步骤1：导出训练数据到数据库**
```bash
node out/cli.js training-data <demo路径> --players <Steam ID> --rounds <回合号>

# 示例
node out/cli.js training-data \
  "D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem" \
  --players 76561199138765870 \
  --rounds 1
```

**步骤2：查询已导出的数据**
```bash
node out/cli.js query-training
```

**步骤3：录制视频帧**
```bash
node out/cli.js generate-frames --checksum <checksum>

# 示例（需要先获取 checksum）
node out/cli.js generate-frames --checksum abc123def456
```

## 命令参考

### training-data 命令

导出训练数据元数据到数据库。

```bash
node out/cli.js training-data <demo路径> [选项]
```

**选项：**
- `--players <ids>`：逗号分隔的 Steam ID（默认：全部）
- `--rounds <numbers>`：逗号分隔的回合号（默认：全部）
- `--list-players`：只列出玩家信息，不导出
- `--output <path>`：输出目录（默认：demo目录/training_data）
- `--force`：强制重新分析 demo

**示例：**
```bash
# 列出所有玩家
node out/cli.js training-data demo.dem --list-players

# 导出特定玩家的特定回合
node out/cli.js training-data demo.dem --players 76561198000000001 --rounds 1,2,3

# 导出所有玩家所有回合
node out/cli.js training-data demo.dem
```

### query-training 命令

查询数据库中的训练数据。

```bash
node out/cli.js query-training [选项]
```

**选项：**
- `--checksum <checksum>`：按 demo 过滤
- `--limit <n>`：显示记录数（默认：3）

**示例：**
```bash
# 查看所有训练数据统计
node out/cli.js query-training

# 查看特定 demo 的数据
node out/cli.js query-training --checksum abc123
```

### generate-frames 命令

根据数据库中的训练数据录制视频帧。

⚠️ **需要：**
- CS2 已安装
- HLAE 已安装（会自动安装）
- FFmpeg 已安装（会自动安装）

```bash
node out/cli.js generate-frames --checksum <checksum> [选项]
```

**选项：**
- `--checksum <checksum>`：**必需**，demo checksum
- `--players <ids>`：逗号分隔的 Steam ID（默认：全部）
- `--rounds <numbers>`：逗号分隔的回合号（默认：全部）

**示例：**
```bash
# 录制所有训练数据的视频帧
node out/cli.js generate-frames --checksum abc123

# 录制特定玩家的帧
node out/cli.js generate-frames --checksum abc123 --players 76561198000000001

# 录制特定回合的帧
node out/cli.js generate-frames --checksum abc123 --rounds 1
```

## 输出结构

```
training_data/
└── <玩家名>_<Steam ID>/
    └── round_<回合号>/
        └── frames/
            ├── frame_0001.jpg  # 窗口1起始帧
            ├── frame_0002.jpg  # 窗口1中间帧
            ├── ...
            ├── frame_0010.jpg  # 窗口1结束帧
            ├── frame_0011.jpg  # 窗口2起始帧
            ├── ...
            └── frame_0570.jpg  # 最后一帧
```

## 数据库表结构

**training_windows 表：**

| 字段 | 类型 | 说明 |
|------|------|------|
| match_checksum | varchar | Demo checksum |
| round_number | int | 回合号 |
| player_steam_id | varchar | 玩家 Steam ID |
| window_idx | int | 窗口索引 |
| start_tick | int | 起始 tick |
| end_tick | int | 结束 tick |
| start_frame_path | varchar | 起始帧路径 |
| middle_frame_paths | text | 中间帧路径（JSON数组） |
| end_frame_path | varchar | 结束帧路径 |
| situation_text | text | 情况描述（中文） |
| events_json | text | 事件（JSON） |
| events_zh | text | 事件描述（中文） |
| pos_x, pos_y, pos_z | float | 玩家位置 |
| health, armor, money | int | 玩家状态 |
| ... | ... | 更多字段 |

## 查询示例

```sql
-- 查询某个玩家某回合的所有窗口
SELECT
  window_idx,
  start_tick,
  end_tick,
  situation_text,
  events_zh
FROM training_windows
WHERE player_steam_id = '76561199138765870'
  AND round_number = 1
ORDER BY window_idx;

-- 统计每个玩家的训练数据量
SELECT
  player_name,
  COUNT(*) as total_windows,
  COUNT(DISTINCT round_number) as total_rounds
FROM training_windows
GROUP BY player_steam_id, player_name;
```

## 故障排除

### 问题1：demo 未在数据库中

**错误：** `Demo not found in database`

**解决：** 先使用 `--force` 重新分析 demo
```bash
node out/cli.js training-data demo.dem --force
```

### 问题2：CS2 无法启动

**检查：**
1. CS2 是否已安装
2. Steam 是否在运行
3. HLAE 是否正确安装（位于 `~/.cs-demo-manager/hlae`）

### 问题3：内存不足

**解决：** 增加 Node.js 内存限制
```bash
node --max-old-space-size=4096 out/cli.js training-data demo.dem
```

### 问题4：录制失败

**检查：**
1. FFmpeg 是否安装
2. 输出目录是否有写入权限
3. CS2 游戏设置是否正确

## 性能优化

- **单玩家单回合**：~30秒（取决于回合时长）
- **内存使用**：~100MB（已优化流式处理）
- **数据库大小**：每个窗口约 1KB

**建议：**
- 先测试单玩家单回合
- 确认流程正常后再批量处理
- 使用 SSD 存储图片提升 I/O 性能

## 下一步

完成数据导出后，你可以：
1. 使用训练数据训练 AI 模型
2. 分析玩家行为模式
3. 创建游戏高光集锦
4. 生成数据可视化

---

**需要帮助？**
- 查看日志：`node out/cli.js <command> --verbose`
- 报告问题：https://github.com/akiver/cs-demo-manager/issues
