# CS2 训练数据完整收集系统

## 概述

这是一个完整的 CS2 训练数据收集系统，能够自动从 demo 文件中提取训练数据，包括：
- 视频帧（10帧/窗口，25fps）
- 玩家状态（位置、血量、武器等）
- 事件信息（击杀、受伤等）
- 情况描述（Situation文本）

## 系统架构

```
Demo 文件
   ↓
[1] 导出元数据 → PostgreSQL 数据库
   ↓                 (situation + events)
[2] 启动 CS2 + 录制
   ↓
[3] 提取视频帧 → training_data/frames/
   ↓
[4] 完整训练数据
```

## 数据格式

### 时间窗口
- **窗口长度**: 400ms
- **帧率**: 25fps
- **每窗口帧数**: 10帧
  - 起始帧: `frame_0001.jpg` (窗口开始)
  - 中间帧: `frame_0002.jpg` ~ `frame_0009.jpg` (8帧)
  - 结束帧: `frame_0010.jpg` (窗口结束)

### 标签数据

每个窗口包含：

#### 1. Situation（起始帧之前的情况）
```
"HP:100 | 护甲:100 | 武器:AK-47 | 移动中 | 前进(W) | 速度:250"
```

#### 2. 玩家状态
```json
{
  "position": [1234.5, 678.9, 100.0],
  "view": [10.5, 90.0],
  "health": 100,
  "armor": 100,
  "weapon": "AK-47",
  "team": "T",
  "money": 2700,
  "is_crouching": false,
  "is_scoped": false
}
```

#### 3. 移动状态
```json
{
  "is_moving": true,
  "direction": "W",
  "speed": 250
}
```

#### 4. 事件（窗口内发生）
```json
[
  {
    "tick": 9900,
    "type": "kill",
    "description": "击杀了敌人"
  },
  {
    "tick": 9920,
    "type": "damage_dealt",
    "description": "造成 27 点伤害"
  }
]
```

## 使用方法

### 1. 完整流水线（推荐）

一键收集某个玩家某局的所有训练数据：

```bash
cd D:\myprogram\cs_learning\tools\cs-demo-manager

# 收集某玩家的训练数据
node scripts/complete-training-pipeline.mjs \
  "D:/demos/match.dem" \
  76561199138765870

# 收集某玩家某回合的训练数据
node scripts/complete-training-pipeline.mjs \
  "D:/demos/match.dem" \
  76561199138765870 \
  1
```

这个脚本会自动：
1. ✓ 导出训练数据元数据到数据库
2. ✓ 启动 CS2 并录制视频帧
3. ✓ 验证数据完整性

### 2. 分步执行

如果需要更多控制，可以分步执行：

#### 步骤 1: 导出元数据

```bash
node out/cli.js training-data \
  "D:/demos/match.dem" \
  --players 76561199138765870 \
  --rounds 1
```

#### 步骤 2: 查询数据获取 checksum

```bash
node out/cli.js query-training --limit 1
# 输出中会显示: Demo Checksum: abc123def456
```

#### 步骤 3: 录制视频帧

```bash
node out/cli.js generate-frames \
  --checksum abc123def456 \
  --players 76561199138765870 \
  --rounds 1
```

### 3. 查询和验证

```bash
# 查询所有训练数据
node out/cli.js query-training

# 查询前 5 个窗口
node out/cli.js query-training --limit 5

# 查询特定玩家
node out/cli.js query-training --player 76561199138765870
```

## Python 数据加载器

### 安装依赖

```bash
pip install psycopg2-binary pillow numpy torch torchvision
```

### 基础使用

```python
from scripts.cs2_training_loader import CS2TrainingDataset

# 创建数据集
dataset = CS2TrainingDataset(
    db_config={
        'host': '127.0.0.1',
        'port': 5432,
        'user': 'postgres',
        'password': '88683139',
        'database': 'csdm'
    }
)

# 加载一个样本
sample = dataset[0]

print(f"Frames: {sample['frames'].shape}")  # (10, H, W, 3)
print(f"Situation: {sample['situation']}")
print(f"Events: {sample['events']}")
print(f"Player state: {sample['player_state']}")
```

### PyTorch 训练

```python
from torch.utils.data import DataLoader
from torchvision import transforms

# 定义图片变换
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225]),
])

# 创建数据集
dataset = CS2TrainingDataset(
    db_config={...},
    transform=transform
)

# 创建 DataLoader
dataloader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True,
    num_workers=4
)

# 训练循环
for batch in dataloader:
    frames = batch['frames']        # (B, 10, 3, 224, 224)
    situation = batch['situation']  # (B,)
    events = batch['events']        # (B, N)
    player_state = batch['player_state']  # Dict of tensors

    # 你的模型训练代码
    output = model(frames)
    loss = criterion(output, labels)
    # ...
```

## 输出目录结构

```
dataset/1/
└── training_data/
    └── {player_name}_{steam_id}/
        └── round_{N}/
            └── frames/
                ├── frame_0001.jpg  # 窗口1起始帧
                ├── frame_0002.jpg
                ├── ...
                ├── frame_0010.jpg  # 窗口1结束帧
                ├── frame_0011.jpg  # 窗口2起始帧
                ├── ...
                └── frame_0570.jpg  # 窗口57结束帧 (示例)
```

## 数据库表结构

### `training_windows` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `match_checksum` | TEXT | Demo checksum |
| `round_number` | INTEGER | 回合号 |
| `player_steam_id` | TEXT | 玩家 Steam ID |
| `player_name` | TEXT | 玩家名称 |
| `window_idx` | INTEGER | 窗口索引（从0开始） |
| `start_tick` | INTEGER | 起始 tick |
| `end_tick` | INTEGER | 结束 tick |
| `time_ms` | INTEGER | 时间（毫秒） |
| `start_frame_path` | TEXT | 起始帧路径 |
| `middle_frame_paths` | TEXT | 中间帧路径（JSON数组） |
| `end_frame_path` | TEXT | 结束帧路径 |
| `situation_text` | TEXT | 情况描述 |
| `events_json` | TEXT | 事件列表（JSON数组） |
| `events_zh` | TEXT | 事件中文描述 |
| `pos_x`, `pos_y`, `pos_z` | REAL | 玩家位置 |
| `view_pitch`, `view_yaw` | REAL | 视角 |
| `health` | INTEGER | 生命值 |
| `armor` | INTEGER | 护甲 |
| `weapon` | TEXT | 武器 |
| `team` | TEXT | 队伍（T/CT） |
| `money` | INTEGER | 金钱 |
| `is_alive` | BOOLEAN | 是否存活 |
| `is_crouching` | BOOLEAN | 是否蹲下 |
| `is_scoped` | BOOLEAN | 是否开镜 |
| `is_moving` | BOOLEAN | 是否移动 |
| `move_direction` | TEXT | 移动方向 |
| `move_speed` | INTEGER | 移动速度 |

## 注意事项

### 1. 录制要求
- ✅ CS2 已安装
- ✅ Steam 在运行
- ✅ 有足够的磁盘空间（每回合约 50-200MB）

### 2. 录制过程
- 🎮 CS2 会自动启动
- ⏱️ 录制时间取决于回合时长（通常 30-60秒/回合）
- 🚫 录制期间请勿操作游戏窗口
- ✅ 录制完成后游戏会自动关闭

### 3. 故障排查

#### 问题：CS2 启动但不进入回放
- **原因**：服务器插件未安装或配置错误
- **解决**：检查 `{CS2}/game/csgo/csdm/bin/server.dll` 是否存在

#### 问题：图片文件缺失
- **原因**：录制失败或被中断
- **解决**：重新运行 `generate-frames` 命令

#### 问题：数据库连接失败
- **原因**：PostgreSQL 未运行或配置错误
- **解决**：检查数据库服务和连接配置

## 性能优化

### 批量处理

```bash
# 处理多个玩家
for player in 76561198000000001 76561198000000002; do
  node scripts/complete-training-pipeline.mjs "demo.dem" $player
done

# 处理多个回合
for round in {1..10}; do
  node scripts/complete-training-pipeline.mjs "demo.dem" 76561198000000001 $round
done
```

### 并行处理

⚠️ **不建议**：由于 CS2 只能单实例运行，不支持并行录制。但可以并行导出元数据：

```bash
# 先批量导出元数据
for demo in *.dem; do
  node out/cli.js training-data "$demo" --players xxx &
done
wait

# 再串行录制
for checksum in ...; do
  node out/cli.js generate-frames --checksum $checksum
done
```

## 示例：完整工作流程

```bash
# 1. 收集训练数据
cd D:\myprogram\cs_learning\tools\cs-demo-manager

node scripts/complete-training-pipeline.mjs \
  "D:/myprogram/cs_learning/dataset/1/match.dem" \
  76561199138765870 \
  1

# 2. 验证数据
node out/cli.js query-training --limit 3

# 3. 在 Python 中使用
python scripts/cs2_training_loader.py

# 4. 开始训练
python your_training_script.py
```

## 许可证

MIT License

## 致谢

基于 [CS Demo Manager](https://github.com/akiver/cs-demo-manager) 构建。
