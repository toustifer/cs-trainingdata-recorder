"""
CS2 训练数据加载器

使用方法：
    from cs2_training_loader import CS2TrainingDataset

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
    print(sample['frames'].shape)  # (10, H, W, 3)
    print(sample['situation'])      # "HP:100 | 护甲:100 | ..."
    print(sample['events'])          # [{'tick': 9900, 'type': 'kill', ...}]
"""

import json
import psycopg2
from PIL import Image
import numpy as np
from typing import Dict, List, Optional
from torch.utils.data import Dataset
import torch


class CS2TrainingDataset(Dataset):
    """CS2 训练数据集加载器

    数据格式：
        每个样本包含：
        - frames: (10, H, W, 3) - 10帧图片（400ms窗口，25fps）
        - situation: str - 起始帧之前的情况描述
        - events: List[Dict] - 窗口内发生的事件
        - player_state: Dict - 玩家状态（位置、血量、武器等）
        - move_state: Dict - 移动状态（方向、速度）
    """

    def __init__(
        self,
        db_config: Dict[str, str],
        transform=None,
        player_steam_id: Optional[str] = None,
        round_number: Optional[int] = None
    ):
        """
        Args:
            db_config: 数据库配置 {'host', 'port', 'user', 'password', 'database'}
            transform: 图片变换（例如 torchvision.transforms）
            player_steam_id: 过滤特定玩家（可选）
            round_number: 过滤特定回合（可选）
        """
        self.db_config = db_config
        self.transform = transform
        self.conn = self._connect()

        # 构建查询
        query = "SELECT COUNT(*) FROM training_windows WHERE 1=1"
        params = []

        if player_steam_id:
            query += " AND player_steam_id = %s"
            params.append(player_steam_id)

        if round_number is not None:
            query += " AND round_number = %s"
            params.append(round_number)

        cursor = self.conn.cursor()
        cursor.execute(query, params)
        self.length = cursor.fetchone()[0]
        cursor.close()

        self.player_steam_id = player_steam_id
        self.round_number = round_number

        print(f"✓ 数据集已加载: {self.length} 个时间窗口")

    def _connect(self):
        """连接数据库"""
        return psycopg2.connect(
            host=self.db_config['host'],
            port=self.db_config['port'],
            user=self.db_config['user'],
            password=self.db_config['password'],
            database=self.db_config['database']
        )

    def __len__(self):
        return self.length

    def __getitem__(self, idx):
        """获取一个训练样本"""
        cursor = self.conn.cursor()

        # 构建查询
        query = """
            SELECT
                start_frame_path,
                middle_frame_paths,
                end_frame_path,
                situation_text,
                events_json,
                events_zh,
                pos_x, pos_y, pos_z,
                view_pitch, view_yaw,
                health, armor, weapon, team, money,
                is_alive, is_crouching, is_scoped,
                is_moving, move_direction, move_speed,
                start_tick, end_tick, time_ms,
                player_name, round_number
            FROM training_windows
            WHERE 1=1
        """
        params = []

        if self.player_steam_id:
            query += " AND player_steam_id = %s"
            params.append(self.player_steam_id)

        if self.round_number is not None:
            query += " AND round_number = %s"
            params.append(self.round_number)

        query += " ORDER BY round_number, window_idx LIMIT 1 OFFSET %s"
        params.append(idx)

        cursor.execute(query, params)
        row = cursor.fetchone()
        cursor.close()

        if row is None:
            raise IndexError(f"Index {idx} out of range")

        # 解析数据
        (
            start_frame_path,
            middle_frame_paths_json,
            end_frame_path,
            situation_text,
            events_json,
            events_zh,
            pos_x, pos_y, pos_z,
            view_pitch, view_yaw,
            health, armor, weapon, team, money,
            is_alive, is_crouching, is_scoped,
            is_moving, move_direction, move_speed,
            start_tick, end_tick, time_ms,
            player_name, round_number
        ) = row

        # 加载 10 帧图片
        middle_frame_paths = json.loads(middle_frame_paths_json)
        frame_paths = [start_frame_path] + middle_frame_paths + [end_frame_path]

        frames = []
        for path in frame_paths:
            try:
                img = Image.open(path).convert('RGB')
                if self.transform:
                    img = self.transform(img)
                frames.append(img)
            except FileNotFoundError:
                # 如果图片不存在，返回黑色图片作为占位符
                print(f"⚠ 警告: 图片不存在 {path}")
                if self.transform:
                    # 创建一个黑色占位符
                    img = Image.new('RGB', (1920, 1080), (0, 0, 0))
                    img = self.transform(img)
                    frames.append(img)
                else:
                    frames.append(np.zeros((1080, 1920, 3), dtype=np.uint8))

        # 解析事件
        events = json.loads(events_json)

        # 构建样本
        sample = {
            # 输入：10 帧图片
            'frames': frames if self.transform else np.array(frames),

            # 标签：情况描述
            'situation': situation_text,
            'situation_zh': events_zh,  # 中文描述（如果有）

            # 标签：事件列表
            'events': events,

            # 标签：玩家状态
            'player_state': {
                'position': np.array([pos_x, pos_y, pos_z], dtype=np.float32),
                'view': np.array([view_pitch, view_yaw], dtype=np.float32),
                'health': health,
                'armor': armor,
                'weapon': weapon,
                'team': team,
                'money': money,
                'is_alive': is_alive,
                'is_crouching': is_crouching,
                'is_scoped': is_scoped,
            },

            # 标签：移动状态
            'move_state': {
                'is_moving': is_moving,
                'direction': move_direction,
                'speed': move_speed,
            },

            # 元信息
            'meta': {
                'player_name': player_name,
                'round_number': round_number,
                'start_tick': start_tick,
                'end_tick': end_tick,
                'time_ms': time_ms,
            }
        }

        return sample

    def __del__(self):
        """关闭数据库连接"""
        if hasattr(self, 'conn') and self.conn:
            self.conn.close()


# ============================================================================
# PyTorch 示例
# ============================================================================

def create_pytorch_dataset():
    """创建 PyTorch 数据集示例"""
    from torchvision import transforms

    # 定义图片变换
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # 调整大小
        transforms.ToTensor(),           # 转换为 Tensor
        transforms.Normalize(            # 归一化
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])

    # 创建数据集
    dataset = CS2TrainingDataset(
        db_config={
            'host': '127.0.0.1',
            'port': 5432,
            'user': 'postgres',
            'password': '88683139',
            'database': 'csdm'
        },
        transform=transform
    )

    # 创建 DataLoader
    from torch.utils.data import DataLoader
    dataloader = DataLoader(
        dataset,
        batch_size=16,
        shuffle=True,
        num_workers=4
    )

    return dataloader


# ============================================================================
# 使用示例
# ============================================================================

if __name__ == '__main__':
    print("CS2 训练数据加载器示例")
    print("=" * 80)

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

    print(f"\n数据集大小: {len(dataset)} 个样本")

    if len(dataset) > 0:
        # 加载第一个样本
        sample = dataset[0]

        print("\n样本结构：")
        print(f"  frames: {sample['frames'].shape if isinstance(sample['frames'], np.ndarray) else len(sample['frames'])} 帧")
        print(f"  situation: {sample['situation']}")
        print(f"  events: {len(sample['events'])} 个事件")
        print(f"  player_state: {sample['player_state']}")
        print(f"  move_state: {sample['move_state']}")
        print(f"  meta: {sample['meta']}")

        print("\n详细信息：")
        print(f"  玩家: {sample['meta']['player_name']}")
        print(f"  回合: {sample['meta']['round_number']}")
        print(f"  时间: {sample['meta']['time_ms']}ms")
        print(f"  Tick: {sample['meta']['start_tick']} - {sample['meta']['end_tick']}")

        if sample['events']:
            print(f"\n  事件:")
            for event in sample['events']:
                print(f"    - [Tick {event['tick']}] {event['type']}: {event['description']}")

    print("\n" + "=" * 80)
    print("✓ 数据加载测试完成")
