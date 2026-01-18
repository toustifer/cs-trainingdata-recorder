import os
import json
import cv2
import numpy as np
from pathlib import Path

def process_clips(folder_path):
    print(f"Processing clips for: {folder_path}")
    data_json_path = os.path.join(folder_path, 'data.json')
    full_video_path = os.path.join(folder_path, 'full_round.mp4')
    clips_dir = os.path.join(folder_path, 'clips')
    
    if not os.path.exists(data_json_path) or not os.path.exists(full_video_path):
        print("Error: Missing data.json or full_round.mp4")
        return

    os.makedirs(clips_dir, exist_ok=True)

    with open(data_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    tickrate = data['tickrate']
    windows = data['windows']
    # HLAE 录制的视频通常是 25fps (根据之前的 node 脚本)
    fps = 25 
    
    cap = cv2.VideoCapture(full_video_path)
    if not cap.isOpened():
        print("Error: Could not open full_round.mp4")
        return

    actual_fps = cap.get(cv2.CAP_PROP_FPS)
    print(f"Video FPS: {actual_fps}")
    
    # 获取第一个 tick
    first_tick = min(w['start_tick'] for w in windows)

    for i, window in enumerate(windows):
        idx = window['window_index']
        start_tick = window['start_tick']
        
        # 计算在视频中的起始时间 (秒)
        start_time_sec = (start_tick - first_tick) / tickrate
        
        # 计算起始帧索引
        start_frame_idx = int(start_time_sec * actual_fps)
        
        # 切片保存路径
        clip_path = os.path.join(clips_dir, f"window_{idx}.mp4")
        
        # 使用 OpenCV 提取 10 帧并保存
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(clip_path, fourcc, actual_fps, (640, 480))
        
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame_idx)
        
        for _ in range(10): # 400ms @ 25fps = 10 frames
            ret, frame = cap.read()
            if ret:
                # Resize if needed (HLAE was set to 640x480)
                if frame.shape[1] != 640 or frame.shape[0] != 480:
                    frame = cv2.resize(frame, (640, 480))
                out.write(frame)
            else:
                break
        
        out.release()
        if i % 20 == 0:
            print(f"Progress: {i}/{len(windows)} clips processed")

    cap.release()
    print("✅ All clips processed and saved using OpenCV.")

if __name__ == "__main__":
    base_dir = "F:/cs_data/traindata"
    # 获取最新文件夹
    import os
    folders = [os.path.join(base_dir, d) for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    if folders:
        latest_folder = max(folders, key=os.path.getmtime)
        process_clips(latest_folder)
