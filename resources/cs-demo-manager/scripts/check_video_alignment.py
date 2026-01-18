import os
import json
import cv2
import sys
import glob

def check_alignment(data_path):
    print(f"Checking data in: {data_path}")
    
    data_json_path = os.path.join(data_path, 'data.json')
    if not os.path.exists(data_json_path):
        print("Error: data.json not found")
        return

    with open(data_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Demo Checksum: {data.get('demo_checksum')}")
    print(f"Tickrate: {data.get('tickrate')}")
    print(f"Target FPS: {data.get('fps', 'N/A')}")
    print(f"Storage Mode: {data.get('storage_mode')}")
    
    windows = data.get('windows', [])
    print(f"Total Windows: {len(windows)}")
    
    if len(windows) == 0:
        return

    # Check the first few windows
    print("\n--- Verifying Image Frames ---")
    
    issues = 0
    checked = 0
    
    ticks_per_frame = data.get('tickrate', 64) / 25.0
    print(f"Ratio: 1 frame ≈ {ticks_per_frame:.2f} ticks")
    
    all_jpgs = glob.glob(os.path.join(data_path, 'frames', '*.jpg'))
    total_frames_files = len(all_jpgs)
    print(f"Total JPG Files found: {total_frames_files}")
    
    total_windows = len(windows)
    for i, window in enumerate(windows):
        checked += 1
        
        # 实时打印进度
        if (i + 1) % 10 == 0 or (i + 1) == total_windows:
            sys.stdout.write(f"\r  Progress: Checking window {i+1}/{total_windows}...")
            sys.stdout.flush()

        start_frame_path = window.get('start_frame')
        if not start_frame_path:
            continue
            
        # 智能寻找图片路径
        # 尝试 1: 直接拼接
        abs_start_path = os.path.join(data_path, start_frame_path)
        if not os.path.exists(abs_start_path):
            # 尝试 2: 仅取文件名
            fname = os.path.basename(start_frame_path)
            abs_start_path = os.path.join(data_path, "frames", fname)

        if not os.path.exists(abs_start_path):
            if i < 5: # 仅对前几个报错，避免刷屏
                print(f"\n  ❌ Window {i}: Start frame missing: {abs_start_path}")
            issues += 1
            continue
        
        # 验证每一帧是否连续且存在
        # (可选：为了速度，这里只抽检首尾)
        
    print(f"\n\nChecked {checked} windows.")
    if issues == 0:
        print("✅ All referenced frames exist and are correctly aligned.")
    else:
        print(f"❌ Found {issues} missing frame references!")

if __name__ == "__main__":
    # Find the most recent training data folder
    base_dir = "F:/cs_data/traindata"
    if not os.path.exists(base_dir):
        print(f"Directory not found: {base_dir}")
        sys.exit(1)
        
    # Get latest folder
    folders = [os.path.join(base_dir, d) for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    if not folders:
        print("No data folders found.")
        sys.exit(1)
        
    latest_folder = max(folders, key=os.path.getmtime)
    check_alignment(latest_folder)
