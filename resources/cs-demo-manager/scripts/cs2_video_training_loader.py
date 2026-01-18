#!/usr/bin/env python3
"""
CS2 训练数据加载器 - 视频版（方案三：Video + LRU Cache）

优势：
- 存储空间节省 80-90%
- LRU 缓存加速热数据访问
- 支持随机访问训练样本
- 自动视频解码和帧缓存

依赖：
    pip install opencv-python psycopg2-binary pillow numpy torch torchvision
"""

import os
import json
import cv2
import numpy as np
from collections import OrderedDict
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import psycopg2
from PIL import Image

try:
    import torch
    from torch.utils.data import Dataset
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    print("⚠️ PyTorch 未安装，仅支持 NumPy 输出")


class LRUCache:
    """简单的 LRU 缓存实现"""

    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return None
        # 移到末尾（最近使用）
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            # 更新并移到末尾
            self.cache.move_to_end(key)
        self.cache[key] = value
        # 如果超过容量，删除最旧的
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

    def __len__(self):
        return len(self.cache)


class VideoFrameCache:
    """视频帧缓存管理器"""

    def __init__(self, cache_size_mb: int = 1024):
        """
        Args:
            cache_size_mb: 缓存大小（MB），默认 1GB
        """
        # 假设每帧 640x480x3 = 921,600 bytes ≈ 0.9 MB
        # 1GB 可以缓存约 1100 帧
        self.frame_size_mb = 0.9
        self.max_frames = int(cache_size_mb / self.frame_size_mb)
        self.cache = LRUCache(self.max_frames)

        # 统计信息
        self.hits = 0
        self.misses = 0

        print(f"✓ 视频帧缓存初始化: {cache_size_mb} MB (约 {self.max_frames} 帧)")

    def get_cache_key(self, video_path: str, frame_idx: int) -> str:
        """生成缓存键"""
        return f"{video_path}:{frame_idx}"

    def get_frame(self, video_path: str, frame_idx: int) -> Optional[np.ndarray]:
        """获取帧（从缓存或解码）"""
        cache_key = self.get_cache_key(video_path, frame_idx)

        # 尝试从缓存获取
        cached_frame = self.cache.get(cache_key)
        if cached_frame is not None:
            self.hits += 1
            return cached_frame

        # 缓存未命中，解码视频帧
        self.misses += 1
        frame = self._decode_frame(video_path, frame_idx)

        if frame is not None:
            # 存入缓存
            self.cache.put(cache_key, frame)

        return frame

    def _decode_frame(self, video_path: str, frame_idx: int) -> Optional[np.ndarray]:
        """从视频解码指定帧"""
        try:
            cap = cv2.VideoCapture(video_path)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            cap.release()

            if not ret:
                return None

            # OpenCV 读取的是 BGR，转换为 RGB
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            return frame

        except Exception as e:
            print(f"⚠️ 解码失败: {video_path}[{frame_idx}]: {e}")
            return None

    def get_stats(self) -> Dict:
        """获取缓存统计信息"""
        total_requests = self.hits + self.misses
        hit_rate = (self.hits / total_requests * 100) if total_requests > 0 else 0

        return {
            'cache_size': len(self.cache),
            'max_size': self.max_frames,
            'hits': self.hits,
            'misses': self.misses,
            'hit_rate': f"{hit_rate:.1f}%"
        }


class CS2VideoTrainingDataset:
    """CS2 训练数据集 - 视频版"""

    def __init__(
        self,
        data_root: str = "F:/cs_data/traindata",
        cache_size_mb: int = 1024,
        transform=None
    ):
        """
        Args:
            data_root: 数据根目录
            cache_size_mb: 帧缓存大小（MB）
            transform: 可选的数据增强变换
        """
        self.data_root = Path(data_root)
        self.transform = transform

        # 初始化帧缓存
        self.frame_cache = VideoFrameCache(cache_size_mb)

        # 扫描所有视频数据
        self.samples = []
        self._scan_data()

        print(f"✓ 数据集加载完成: {len(self.samples)} 个训练窗口")

    def _scan_data(self):
        """扫描数据目录，加载所有 data.json"""
        print(f"扫描数据目录: {self.data_root}")

        for round_dir in self.data_root.iterdir():
            if not round_dir.is_dir():
                continue

            data_json_path = round_dir / 'data.json'
            if not data_json_path.exists():
                continue

            # 读取 data.json
            with open(data_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 检查是否是视频模式
            if data.get('storage_mode') != 'video':
                continue

            # 视频路径（相对路径 -> 绝对路径）
            video_rel_path = data['video_path']
            video_abs_path = str(self.data_root / video_rel_path)

            if not os.path.exists(video_abs_path):
                print(f"⚠️ 视频文件不存在: {video_abs_path}")
                continue

            # 添加所有窗口样本
            for window in data['windows']:
                sample = {
                    'video_path': video_abs_path,
                    'demo_checksum': data['demo_checksum'],
                    'player_name': data['player_name'],
                    'player_steam_id': data['player_steam_id'],
                    'round_number': data['round_number'],
                    'window_index': window['window_index'],

                    # 帧索引
                    'start_frame_idx': window['start_frame_idx'],
                    'middle_frame_indices': window['middle_frame_indices'],
                    'end_frame_idx': window['end_frame_idx'],

                    # 标签
                    'situation': window.get('situation', ''),
                    'events': window.get('events', []),
                    'player_state': window.get('player_state', {}),
                }

                self.samples.append(sample)

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        """获取训练样本"""
        sample = self.samples[idx]

        # 从视频解码10帧（使用缓存）
        frames = []
        frame_indices = (
            [sample['start_frame_idx']] +
            sample['middle_frame_indices'] +
            [sample['end_frame_idx']]
        )

        for frame_idx in frame_indices:
            frame = self.frame_cache.get_frame(sample['video_path'], frame_idx)
            if frame is None:
                # 如果解码失败，使用黑色占位
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
            frames.append(frame)

        # 堆叠为 (10, H, W, 3)
        frames_array = np.stack(frames, axis=0)

        # 应用变换
        if self.transform is not None:
            frames_array = self.transform(frames_array)

        # 返回样本
        result = {
            'frames': frames_array,
            'situation': sample['situation'],
            'events': sample['events'],
            'player_state': sample['player_state'],

            # 元数据
            'demo_checksum': sample['demo_checksum'],
            'player_name': sample['player_name'],
            'round_number': sample['round_number'],
            'window_index': sample['window_index'],
        }

        return result

    def get_cache_stats(self):
        """获取缓存统计信息"""
        return self.frame_cache.get_stats()


# PyTorch Dataset 包装器
if HAS_TORCH:
    class CS2VideoTorchDataset(CS2VideoTrainingDataset, torch.utils.data.Dataset):
        """PyTorch 兼容的数据集"""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

        def __getitem__(self, idx):
            sample = super().__getitem__(idx)

            # 转换为 PyTorch 张量
            frames = sample['frames']  # (10, H, W, 3)

            # 转换为 (10, 3, H, W) 并归一化到 [0, 1]
            frames = torch.from_numpy(frames).float() / 255.0
            frames = frames.permute(0, 3, 1, 2)  # (10, H, W, 3) -> (10, 3, H, W)

            sample['frames'] = frames
            return sample


def test_video_dataset():
    """测试视频数据集加载器"""

    print("=" * 80)
    print("测试 CS2 视频训练数据集")
    print("=" * 80)
    print()

    # 创建数据集
    dataset = CS2VideoTorchDataset(
        data_root="F:/cs_data/traindata",
        cache_size_mb=512  # 512MB 缓存
    )

    if len(dataset) == 0:
        print("⚠️ 数据集为空")
        return

    # 测试加载
    print("\n测试样本加载...")
    for i in range(min(5, len(dataset))):
        sample = dataset[i]

        print(f"\n样本 {i}:")
        print(f"  帧形状: {sample['frames'].shape}")
        print(f"  玩家: {sample['player_name']}")
        print(f"  回合: {sample['round_number']}")
        print(f"  窗口: {sample['window_index']}")
        print(f"  情况: {sample['situation'][:50]}...")

    # 显示缓存统计
    print("\n" + "=" * 80)
    print("缓存统计:")
    print("=" * 80)
    stats = dataset.get_cache_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")

    # 测试批量加载（如果有 PyTorch）
    if HAS_TORCH:
        print("\n" + "=" * 80)
        print("测试批量加载 (DataLoader):")
        print("=" * 80)

        from torch.utils.data import DataLoader

        dataloader = DataLoader(
            dataset,
            batch_size=4,
            shuffle=True,
            num_workers=0  # 视频解码不适合多进程
        )

        for batch_idx, batch in enumerate(dataloader):
            print(f"\n批次 {batch_idx}:")
            print(f"  帧形状: {batch['frames'].shape}")  # (B, 10, 3, H, W)
            print(f"  玩家: {batch['player_name']}")

            if batch_idx >= 2:
                break

        # 最终缓存统计
        print("\n" + "=" * 80)
        print("最终缓存统计:")
        print("=" * 80)
        stats = dataset.get_cache_stats()
        for key, value in stats.items():
            print(f"  {key}: {value}")


if __name__ == '__main__':
    test_video_dataset()
