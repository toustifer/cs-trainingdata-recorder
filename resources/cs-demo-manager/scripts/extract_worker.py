import cv2
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

def run_extraction(config_path):
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            cfg = json.load(f)
        
        video_path = cfg['video_path']
        video_start_tick = cfg['video_start_tick']
        tickrate = cfg['tickrate']
        fps = cfg['fps']
        output_root = cfg['output_root']
        force_overwrite = cfg.get('force_overwrite', False)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"Error: Could not open video at {video_path}")
            sys.exit(1)

        total_rounds = len(cfg['rounds'])
        print(f"Video loaded. Processing {total_rounds} rounds...")

        # 初始化后台写入线程池
        writer_pool = ThreadPoolExecutor(max_workers=4)
        current_frame_pos = -1 # 记录当前解码器位置

        for r_idx, round_data in enumerate(cfg['rounds']):
            r_num = round_data['round_number']
            r_dir = os.path.join(output_root, round_data['folder_name'])
            f_dir = os.path.join(r_dir, 'frames')
            os.makedirs(f_dir, exist_ok=True)
            
            print(f"\n[{r_idx+1}/{total_rounds}] Round {r_num}")
            final_windows = []
            
            start_time = time.time()
            windows = round_data['windows']
            total_windows = len(windows)

            for w_idx, w in enumerate(windows):
                # 对齐逻辑
                time_offset = (w['start_tick'] - video_start_tick) / tickrate
                start_frame_idx = int(time_offset * fps)
                
                frame_rel_paths = []
                for i in range(10):
                    target_idx = start_frame_idx + i
                    img_name = f"frame_{w['window_idx'] * 10 + i + 1:04d}.jpg"
                    img_path = os.path.join(f_dir, img_name)
                    rel_path = f"{round_data['folder_name']}/frames/{img_name}"
                    
                    # 智能跳过
                    if not force_overwrite and os.path.exists(img_path) and os.path.getsize(img_path) > 0:
                        frame_rel_paths.append(rel_path)
                        current_frame_pos = -1 # 跳过时重置位置
                        continue
                    
                    # 顺序读取优化
                    if target_idx != current_frame_pos:
                        cap.set(cv2.CAP_PROP_POS_FRAMES, target_idx)
                    
                    ret, frame = cap.read()
                    if ret:
                        current_frame_pos = target_idx + 1
                        if frame.shape[1] != 640 or frame.shape[0] != 480:
                            frame = cv2.resize(frame, (640, 480))
                        
                        # 提交到线程池
                        writer_pool.submit(cv2.imwrite, img_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
                        frame_rel_paths.append(rel_path)
                    else:
                        current_frame_pos = -1
                
                if len(frame_rel_paths) == 10:
                    final_windows.append({
                        "window_index": w['window_idx'],
                        "start_tick": w['start_tick'],
                        "end_tick": w['end_tick'],
                        "start_frame": frame_rel_paths[0],
                        "middle_frames": frame_rel_paths[1:9],
                        "end_frame": frame_rel_paths[9],
                        "situation": w['situation_text'],
                        "events": w['events_json'],
                        "player_state": {
                            "position": {"x": w['pos_x'], "y": w['pos_y'], "z": w['pos_z']},
                            "health": w['health'], "armor": w['armor'], "weapon": w['weapon'],
                            "is_moving": w['is_moving'], "move_direction": w['move_direction'], "move_speed": w['move_speed']
                        }
                    })
                
                # 实时速度统计
                if (w_idx + 1) % 10 == 0 or (w_idx + 1) == total_windows:
                    elapsed = time.time() - start_time
                    speed = (w_idx + 1) / elapsed if elapsed > 0 else 0
                    remaining = total_windows - (w_idx + 1)
                    eta = int(remaining / speed) if speed > 0 else 0
                    sys.stdout.write(f"\r  Window {w_idx+1}/{total_windows} | Speed: {speed:.1f} win/s | ETA: {eta}s")
                    sys.stdout.flush()

            # 保存 data.json
            with open(os.path.join(r_dir, 'data.json'), 'w', encoding='utf-8') as f:
                json.dump({
                    "demo_checksum": cfg['checksum'],
                    "player_name": cfg['playerName'],
                    "player_steam_id": cfg['playerSteamId'],
                    "round_number": r_num,
                    "tickrate": tickrate,
                    "total_windows": len(final_windows),
                    "total_frames": len(final_windows) * 10,
                    "windows": final_windows
                }, f, indent=2, ensure_ascii=False)
        
        # 等待写入完成
        print("\n\nWaiting for image writes to complete...")
        writer_pool.shutdown(wait=True)
        cap.release()
        print("Extraction completed successfully.")
        
    except Exception as e:
        print(f"\nError in Python Worker: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    run_extraction(sys.argv[1])
