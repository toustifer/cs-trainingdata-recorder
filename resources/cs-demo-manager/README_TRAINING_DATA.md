# CS2 训练数据收集系统 - 使用指南

## 📋 概述

这是一个完整的 CS2 训练数据收集系统，能够从 demo 文件中提取：
- **视频帧**：每个时间窗口 10 帧（25fps，400ms）
- **玩家状态**：位置、血量、武器、移动方向等
- **游戏事件**：击杀、伤害、闪光弹等
- **情况描述**：Situation 文本（HP、护甲、武器、移动状态）

---

## 🚀 快速开始

### 前置要求

1. ✅ **PostgreSQL 数据库** - 端口 5432
2. ✅ **CS2 游戏已安装**
3. ✅ **Node.js 环境**
4. ✅ **已构建的 CLI 工具**

### 一键收集训练数据

```bash
cd D:\myprogram\cs_learning\tools\cs-demo-manager

# 收集某个玩家某回合的训练数据
node scripts/complete-training-pipeline.mjs \
  "D:/demos/match.dem" \
  76561199138765870 \
  1
```

**参数说明：**
- 第1个参数：Demo 文件路径
- 第2个参数：玩家 Steam ID
- 第3个参数：回合号

---

## 📁 必要文件清单

### 核心脚本（必需）

```
scripts/
├── complete-training-pipeline.mjs  # 完整流水线脚本（推荐使用）
└── cli-generate-frames.mjs         # 帧生成脚本（被流水线调用）
```

### CLI 工具（必需）

```
out/
└── cli.js                           # 构建后的 CLI 工具
```

**构建方法：**
```bash
cd D:\myprogram\cs_learning\tools\cs-demo-manager
node scripts/build-cli-only.mjs
```

### CS2 服务器插件（必需）

```
{CS2安装目录}/game/csgo/
├── csdm/
│   └── bin/
│       └── server.dll              # 服务器插件
└── gameinfo.gi                     # 已修改，包含 Game csgo/csdm
```

**插件来源：**
```
C:\Users\15775\AppData\Local\Programs\cs-demo-manager\resources\static\cs2\server.dll
```

### Python 数据加载器（可选）

```
scripts/
└── cs2_training_loader.py          # PyTorch/TensorFlow 数据加载器
```

---

## 🛠️ 使用方法

### 方法 1：完整流水线（推荐）✅

**一键完成所有步骤：**

```bash
node scripts/complete-training-pipeline.mjs \
  "D:/myprogram/cs_learning/dataset/1/match.dem" \
  76561199138765870 \
  1
```

**流程：**
1. ✅ 导出训练数据元数据到数据库
2. ✅ 启动 CS2 并录制视频帧
3. ✅ 验证数据完整性

### 方法 2：分步执行

#### 步骤 1：导出元数据

```bash
node out/cli.js training-data \
  "D:/demos/match.dem" \
  --players 76561199138765870 \
  --rounds 1
```

#### 步骤 2：查询 Checksum

```bash
node out/cli.js query-training --limit 1
# 输出：Demo Checksum: abc123def456
```

#### 步骤 3：录制视频帧

```bash
node scripts/cli-generate-frames.mjs \
  --checksum abc123def456 \
  --player 76561199138765870 \
  --round 1 \
  --demo "D:/demos/match.dem"
```

---

## 📊 输出数据格式

### 目录结构

```
dataset/1/training_data/
└── {player_name}_{steam_id}/
    └── round_{N}/
        └── frames/
            ├── frame_0001.jpg  # 窗口1 起始帧
            ├── frame_0002.jpg  # 窗口1 中间帧
            ├── ...
            ├── frame_0010.jpg  # 窗口1 结束帧
            ├── frame_0011.jpg  # 窗口2 起始帧
            └── ...
```

### 数据库表：`training_windows`

每个窗口包含：

| 字段 | 说明 | 示例 |
|------|------|------|
| `start_frame_path` | 起始帧路径 | `.../frames/frame_0001.jpg` |
| `middle_frame_paths` | 中间8帧路径（JSON数组） | `["frame_0002.jpg", ...]` |
| `end_frame_path` | 结束帧路径 | `.../frames/frame_0010.jpg` |
| `situation_text` | 情况描述 | `HP:100 | 护甲:100 | 武器:AK-47 | 移动中` |
| `events_json` | 事件列表（JSON） | `[{"type":"kill",...}]` |
| `pos_x, pos_y, pos_z` | 玩家位置 | `1234.5, 678.9, 100.0` |
| `health, armor` | 生命值、护甲 | `100, 100` |
| `weapon` | 武器名称 | `AK-47` |
| `is_moving` | 是否移动 | `true` |
| `move_direction` | 移动方向 | `W` (前进) |
| `move_speed` | 移动速度 | `250` |

---

## 🔍 查询数据

### 查询所有训练数据

```bash
node out/cli.js query-training
```

### 查询前 5 个窗口

```bash
node out/cli.js query-training --limit 5
```

### 查询特定玩家

```bash
node out/cli.js query-training --player 76561199138765870
```

---

## 🐍 Python 数据加载

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

# 加载样本
sample = dataset[0]
print(f"Frames shape: {sample['frames'].shape}")  # (10, H, W, 3)
print(f"Situation: {sample['situation']}")
print(f"Events: {sample['events']}")
```

### PyTorch DataLoader

```python
from torch.utils.data import DataLoader
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225]),
])

dataset = CS2TrainingDataset(db_config={...}, transform=transform)
dataloader = DataLoader(dataset, batch_size=16, shuffle=True)

for batch in dataloader:
    frames = batch['frames']        # (B, 10, 3, 224, 224)
    situation = batch['situation']  # (B,)
    events = batch['events']        # (B, N)
    # 训练模型...
```

---

## ⚙️ 配置说明

### 数据库配置

**位置：** 硬编码在脚本中

```javascript
// scripts/cli-generate-frames.mjs
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '88683139',
  database: 'csdm',
});
```

### CS2 路径配置

**位置：** `scripts/cli-generate-frames.mjs`

```javascript
const cs2Path = 'D:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/bin/win64/cs2.exe';
```

### 录制参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 时间窗口 | 400ms | 每个训练样本的时间长度 |
| 帧率 | 25fps | 录制帧率 |
| 每窗口帧数 | 10 | 400ms × 25fps = 10帧 |
| 分辨率 | 1280×720 | 窗口模式 |

---

## 🐛 故障排查

### 问题 1：CS2 启动但不进入回放

**原因：** 服务器插件未安装或配置错误

**解决：**
```bash
# 检查插件是否存在
ls "/d/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/csdm/bin/server.dll"

# 检查 gameinfo.gi 配置
grep "csgo/csdm" "/d/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/gameinfo.gi"
```

### 问题 2：图片文件缺失

**原因：** 录制失败或被中断

**图片生成位置：**
```
{CS2目录}/game/csgo/csdm/movie/{timestamp}/frames*.jpg
```

**解决：** 手动移动图片到正确目录

### 问题 3：数据库连接失败

**原因：** PostgreSQL 未运行或版本不匹配

**解决：**
```bash
# 检查数据库版本
export PGPASSWORD='88683139'
psql -h 127.0.0.1 -U postgres -d csdm -c "SELECT * FROM migrations;"

# 应该显示 schema_version = 10
```

### 问题 4：插件日志显示 "Sequence with 0 actions loaded"

**原因：** JSON 格式错误

**检查 JSON 格式：**
```bash
cat /d/myprogram/cs_learning/dataset/1/match.dem.json
```

**正确格式：**
```json
[
  {
    "actions": [
      { "tick": 1, "cmd": "sv_cheats 1" },
      { "tick": 9813, "cmd": "startmovie \"frames\" jpg" },
      { "tick": 11359, "cmd": "endmovie" }
    ]
  }
]
```

---

## 📈 性能优化

### 批量处理多个玩家

```bash
for player in 76561198000000001 76561198000000002; do
  node scripts/complete-training-pipeline.mjs "demo.dem" $player 1
done
```

### 批量处理多个回合

```bash
for round in {1..10}; do
  node scripts/complete-training-pipeline.mjs "demo.dem" 76561198000000001 $round
done
```

### 预估资源消耗

| 项目 | 估算值 |
|------|--------|
| 每回合时长 | 30-60 秒 |
| 每回合窗口数 | 50-100 个 |
| 每窗口帧数 | 10 帧 |
| 每帧大小 | 50-200 KB |
| **总磁盘占用** | **25-200 MB/回合** |

---

## 🗂️ 完整文件树

```
cs-demo-manager/
├── scripts/                        # 脚本目录
│   ├── complete-training-pipeline.mjs  # ✅ 完整流水线（主要使用）
│   ├── cli-generate-frames.mjs         # ✅ 帧生成器
│   └── cs2_training_loader.py          # Python 数据加载器
│
├── out/
│   └── cli.js                      # ✅ CLI 工具（必需构建）
│
├── src/                            # 源代码（用于构建，不直接使用）
│   ├── cli/
│   ├── node/
│   └── server/
│
└── README_TRAINING_DATA.md         # 本文档
```

---

## 📞 常见命令速查

```bash
# 1. 构建 CLI 工具
node scripts/build-cli-only.mjs

# 2. 完整流水线（推荐）
node scripts/complete-training-pipeline.mjs "demo.dem" 76561198000000001 1

# 3. 查询训练数据
node out/cli.js query-training --limit 5

# 4. 导出元数据
node out/cli.js training-data "demo.dem" --players 76561198000000001 --rounds 1

# 5. 录制帧
node scripts/cli-generate-frames.mjs --checksum abc123 --player 76561198000000001 --round 1 --demo "demo.dem"

# 6. 数据库查询
export PGPASSWORD='88683139'
psql -h 127.0.0.1 -U postgres -d csdm -c "SELECT COUNT(*) FROM training_windows;"
```

---

## ✅ 成功验证

运行以下命令验证系统正常：

```bash
# 1. 检查数据库
node out/cli.js query-training --limit 1

# 2. 检查图片
ls "D:/myprogram/cs_learning/dataset/1/training_data/"*/*/*/*jpg | wc -l

# 3. Python 加载测试
python -c "from scripts.cs2_training_loader import CS2TrainingDataset; print('OK')"
```

---

## 📝 完整示例

```bash
cd D:\myprogram\cs_learning\tools\cs-demo-manager

# 步骤 1: 收集训练数据
node scripts/complete-training-pipeline.mjs \
  "D:/myprogram/cs_learning/dataset/1/match.dem" \
  76561199138765870 \
  1

# 步骤 2: 验证数据
node out/cli.js query-training --limit 3

# 步骤 3: Python 加载
python scripts/cs2_training_loader.py

# 输出：
# ✓ 57 个时间窗口
# ✓ 570 帧图片 (57 × 10)
# ✓ 包含 situation + events + 玩家状态
```

---

## 📄 许可证

MIT License

---

## 🙏 致谢

基于 [CS Demo Manager](https://github.com/akiver/cs-demo-manager) 构建。
