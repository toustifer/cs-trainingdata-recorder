# 训练数据验证报告

## ✅ 当前状态

### 已完成
- **元数据导出**：57 个时间窗口已存储在数据库
- **玩家**：-shNz- (Steam ID: 76561199138765870)
- **回合**：第 1 回合
- **时长**：23 秒（57个窗口 × 400ms）

### 数据完整性

每个窗口包含以下**完整的训练标签**：

#### 1. 玩家状态（用于监督学习）
```
- 位置：(x, y, z)
- 视角：(pitch, yaw)
- 生命值：HP
- 护甲：Armor
- 武器：当前武器
- 队伍：T/CT
- 金钱：$$$
- 状态标志：存活/蹲下/开镜/拆弹/装弹
```

#### 2. 移动信息（用于动作预测）
```
- 是否移动：True/False
- 移动方向：W/A/S/D
- 移动速度：数值
```

#### 3. 情况描述（用于文本生成/理解）
```
示例："HP:100 | 护甲:100 | 武器:USP-S | 蹲下 | 静止"
示例："HP:100 | 护甲:100 | 武器:Decoy Grenade | 蹲下 | 右移(D) | 速度:210"
```

#### 4. 事件信息（用于事件检测）
```
- 击杀/被击杀
- 造成伤害/受到伤害
- 闪盲敌人/被闪盲
- 开火
```

#### 5. 帧路径（指向视频帧）
```
- 起始帧：frame_0001.jpg
- 中间帧：frame_0002.jpg ~ frame_0009.jpg（8帧）
- 结束帧：frame_0010.jpg

总计：10帧/窗口，25fps
```

## ❌ 缺失部分

**图片文件尚未生成！**

目前数据库中只有图片的**路径**，但文件本身不存在：
```
❌ D:\myprogram\cs_learning\dataset\1\training_data\-shNz-_76561199138765870\round_1\frames\frame_0001.jpg
❌ D:\myprogram\cs_learning\dataset\1\training_data\-shNz-_76561199138765870\round_1\frames\frame_0002.jpg
...
❌ (共 570 个图片文件缺失)
```

## 🎯 训练数据格式示例

如果图片存在，数据将是这样的：

### Python 数据加载示例

```python
import json
import psycopg2
from PIL import Image
import numpy as np

# 连接数据库
conn = psycopg2.connect("dbname=csdm user=...")
cursor = conn.cursor()

# 查询一个训练样本
cursor.execute("""
    SELECT
        start_frame_path,
        middle_frame_paths,
        end_frame_path,
        situation_text,
        events_json,
        pos_x, pos_y, pos_z,
        health, armor, weapon,
        is_moving, move_direction, move_speed
    FROM training_windows
    WHERE window_idx = 0
""")

row = cursor.fetchone()

# 加载10帧图片
frames = []
frames.append(Image.open(row[0]))  # 起始帧
for middle_frame in json.loads(row[1]):  # 中间8帧
    frames.append(Image.open(middle_frame))
frames.append(Image.open(row[2]))  # 结束帧

# 转换为numpy数组 (10, H, W, 3)
frames_array = np.array([np.array(f) for f in frames])

# 标签
labels = {
    'situation': row[3],
    'events': json.loads(row[4]),
    'position': [row[5], row[6], row[7]],
    'health': row[8],
    'armor': row[9],
    'weapon': row[10],
    'is_moving': row[11],
    'move_direction': row[12],
    'move_speed': row[13]
}

print(f"输入形状: {frames_array.shape}")  # (10, 1080, 1920, 3)
print(f"标签: {labels}")
```

### PyTorch Dataset 示例

```python
import torch
from torch.utils.data import Dataset

class CS2TrainingDataset(Dataset):
    def __init__(self, db_conn, transform=None):
        self.conn = db_conn
        self.transform = transform
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM training_windows")
        self.length = cursor.fetchone()[0]

    def __len__(self):
        return self.length

    def __getitem__(self, idx):
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT
                start_frame_path, middle_frame_paths, end_frame_path,
                pos_x, pos_y, pos_z, health, armor,
                is_moving, move_direction, move_speed
            FROM training_windows
            WHERE window_idx = %s
        """, (idx,))

        row = cursor.fetchone()

        # 加载10帧
        frames = []
        frames.append(Image.open(row[0]))
        for path in json.loads(row[1]):
            frames.append(Image.open(path))
        frames.append(Image.open(row[2]))

        # 转换
        if self.transform:
            frames = [self.transform(f) for f in frames]

        frames_tensor = torch.stack(frames)  # (10, C, H, W)

        # 标签
        labels = {
            'position': torch.tensor([row[3], row[4], row[5]]),
            'health': torch.tensor(row[6]),
            'is_moving': torch.tensor(row[8]),
            'move_speed': torch.tensor(row[10])
        }

        return frames_tensor, labels

# 使用
dataset = CS2TrainingDataset(conn)
dataloader = DataLoader(dataset, batch_size=16, shuffle=True)

for frames, labels in dataloader:
    # frames: (16, 10, 3, 1080, 1920)
    # labels: dict of tensors
    output = model(frames)
    loss = criterion(output, labels)
    ...
```

## 📋 数据可用性评估

### ✅ 可用于以下训练任务

1. **视频理解/分类**
   - 输入：10帧视频片段
   - 输出：玩家动作分类（移动/静止/开火等）

2. **位置/状态预测**
   - 输入：10帧 + 当前状态
   - 输出：下一时刻的位置/状态

3. **事件检测**
   - 输入：10帧
   - 输出：是否发生击杀/受伤等事件

4. **游戏策略学习**
   - 输入：10帧 + 当前situation
   - 输出：下一步应该采取的动作

5. **视频描述生成**
   - 输入：10帧
   - 输出：自然语言描述（situation_text）

### ❓ 数据格式验证

- ✅ **时间连续性**：每个窗口间隔400ms，符合 ✓
- ✅ **帧率正确**：10帧/400ms = 25fps ✓
- ✅ **标签完整**：状态/事件/描述 ✓
- ❌ **图片存在**：0/570 图片文件 ✗

## 🚀 下一步：生成图片

### 方案1：测试单个窗口（推荐，快速验证）

```bash
# 需要安装 CS2 + HLAE
# 预计耗时：~30秒

cd D:\myprogram\cs_learning\tools\cs-demo-manager

# 获取 checksum（从现有数据）
# 假设 checksum 是：abc123def456

node out/cli.js generate-frames \
  --checksum abc123def456 \
  --players 76561199138765870 \
  --rounds 1
```

### 方案2：完整流水线（重新开始）

```bash
node scripts/full-training-pipeline.mjs \
  "D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem" \
  --players 76561199138765870 \
  --rounds 1
```

### 方案3：手动录制（如果自动失败）

1. 安装 HLAE：https://www.advancedfx.org/
2. 启动 CS2
3. 加载 demo
4. 跳转到 tick 9877
5. 开始录制 25fps
6. 录制到 tick 11359
7. 提取帧到指定目录

## ⚠️ 重要提示

1. **录制需要时间**：每个回合约 30-60秒（取决于回合时长）
2. **需要游戏环境**：必须安装 CS2 + Steam
3. **自动化程度**：generate-frames 会自动启动游戏、重放、录制、提取帧
4. **建议先测试**：先测试单回合，确认流程正常再批量处理

## 📊 预期结果

完成录制后，你将得到：

```
training_data/
└── -shNz-_76561199138765870/
    └── round_1/
        └── frames/
            ├── frame_0001.jpg  ✅ (窗口0起始)
            ├── frame_0002.jpg  ✅
            ├── ...
            ├── frame_0010.jpg  ✅ (窗口0结束)
            ├── frame_0011.jpg  ✅ (窗口1起始)
            ├── ...
            └── frame_0570.jpg  ✅ (窗口56结束)
```

**+ 数据库中的 57 条完整标签记录 ✅**

**= 完整的训练数据集！🎉**

---

**结论**：数据格式和标签都已就绪，只差图片文件。一旦生成图片，数据即可直接用于训练！
