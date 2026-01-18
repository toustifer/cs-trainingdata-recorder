import cv2
import json
import os
import sys
import time
import numpy as np
import shutil

# 全局变量用于鼠标回调
delete_requested = False
delete_button_rect = None  # (x1, y1, x2, y2)

def mouse_callback(event, x, y, flags, param):
    global delete_requested, delete_button_rect
    if event == cv2.EVENT_LBUTTONDOWN and delete_button_rect:
        x1, y1, x2, y2 = delete_button_rect
        if x1 <= x <= x2 and y1 <= y <= y2:
            delete_requested = True

def visualize_round(round_folder):
    global delete_requested, delete_button_rect
    delete_requested = False

    data_json_path = os.path.join(round_folder, 'data.json')
    if not os.path.exists(data_json_path):
        print(f"Error: data.json not found in {round_folder}")
        return

    print(f"Loading data from: {data_json_path}")
    with open(data_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    windows = data['windows']
    player_name = data.get('player_name', 'Unknown')
    print(f"Player: {player_name}")
    print(f"Total Windows: {len(windows)}")
    print("Controls: SPACE=pause, RIGHT=next, ESC=quit, or click DELETE button")

    window_name = "Training Data Playback"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name, 1024, 768)
    cv2.setMouseCallback(window_name, mouse_callback)

    paused = False
    window_idx = 0
    
    while window_idx < len(windows):
        window = windows[window_idx]
        
        # Collect all 10 frames for this window
        frame_paths = [window['start_frame']] + window['middle_frames'] + [window['end_frame']]
        
        # State info
        state = window['player_state']
        situation = window['situation']
        events = window['events']
        
        # Check if frames exist
        valid_frames = []
        for rel_path in frame_paths:
            # Handle potential path variations
            # 1. Direct path
            abs_path = os.path.join(round_folder, rel_path)
            if not os.path.exists(abs_path):
                # 2. Try removing parent folder prefix from relative path
                # e.g. "Hermes_..._round7/frames/xxx.jpg" -> "frames/xxx.jpg"
                parts = rel_path.split('/')
                if 'frames' in parts:
                    idx = parts.index('frames')
                    short_path = '/'.join(parts[idx:])
                    abs_path = os.path.join(round_folder, short_path)
            
            if os.path.exists(abs_path):
                valid_frames.append(abs_path)
            else:
                print(f"Missing frame: {rel_path}")

        if not valid_frames:
            print(f"Skipping window {window['window_index']} (No frames found)")
            window_idx += 1
            continue

        # Play frames in this window
        for i, frame_path in enumerate(valid_frames):
            img = cv2.imread(frame_path)
            if img is None:
                continue

            # Create a canvas: Image on left, Info on right
            h, w = img.shape[:2]
            info_w = 400
            canvas = np.zeros((h, w + info_w, 3), dtype=np.uint8)
            canvas[:, :w] = img
            
            # Fill Info Panel (Dark background)
            canvas[:, w:] = (30, 30, 30) 

            # Helper to draw text
            y_offset = 30
            line_height = 25
            
            def draw_text(text, color=(200, 200, 200), font_scale=0.6, thickness=1):
                nonlocal y_offset
                cv2.putText(canvas, text, (w + 10, y_offset), 
                           cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
                y_offset += line_height

            # Header
            draw_text(f"Window: {window['window_index']} / {len(windows)}", (0, 255, 255), 0.7, 2)
            draw_text(f"Frame: {i+1} / 10")
            draw_text(f"Tick: {window['start_tick']} -> {window['end_tick']}")
            y_offset += 10

            # Player State
            draw_text("--- Player State ---", (150, 150, 150))
            draw_text(f"Health: {state['health']}", (0, 0, 255) if state['health'] < 20 else (0, 255, 0))
            draw_text(f"Armor: {state['armor']}")
            draw_text(f"Weapon: {state['weapon']}")
            draw_text(f"Moving: {state['is_moving']}")
            if state['is_moving']:
                draw_text(f"Dir: {state['move_direction']}")
                draw_text(f"Speed: {state['move_speed']:.1f}")
            
            y_offset += 10
            draw_text("--- Position ---", (150, 150, 150))
            pos = state['position']
            draw_text(f"X: {pos['x']:.1f}")
            draw_text(f"Y: {pos['y']:.1f}")
            draw_text(f"Z: {pos['z']:.1f}")

            y_offset += 10
            draw_text("--- Situation ---", (150, 150, 150))
            # Wrap long situation text
            sit_words = situation.split('|')
            for part in sit_words:
                draw_text(part.strip(), (255, 200, 100))

            y_offset += 10
            if events and events != "[]":
                draw_text("--- EVENTS ---", (0, 0, 255), 0.7, 2)
                try:
                    event_list = json.loads(events) if isinstance(events, str) else events
                    for evt in event_list:
                        draw_text(str(evt), (0, 0, 255))
                except:
                    draw_text(str(events), (0, 0, 255))

            # 绘制删除按钮 (红色按钮在右下角)
            btn_w, btn_h = 120, 40
            btn_x1 = w + info_w - btn_w - 20  # 右边距 20
            btn_y1 = h - btn_h - 20  # 下边距 20
            btn_x2 = btn_x1 + btn_w
            btn_y2 = btn_y1 + btn_h
            delete_button_rect = (btn_x1, btn_y1, btn_x2, btn_y2)

            # 按钮背景 (红色)
            cv2.rectangle(canvas, (btn_x1, btn_y1), (btn_x2, btn_y2), (0, 0, 180), -1)
            # 按钮边框
            cv2.rectangle(canvas, (btn_x1, btn_y1), (btn_x2, btn_y2), (0, 0, 255), 2)
            # 按钮文字
            cv2.putText(canvas, "DELETE", (btn_x1 + 15, btn_y1 + 28),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            # Show Canvas
            cv2.imshow(window_name, canvas)

            # 检查是否点击了删除按钮
            if delete_requested:
                delete_requested = False
                print("\n" + "="*60)
                print(f"⚠️  DELETE requested for: {round_folder}")
                print("="*60)
                confirm = input("Type 'DELETE' to confirm (or press Enter to cancel): ")

                if confirm.strip().upper() == 'DELETE':
                    print(f"\n🗑️  Deleting folder: {round_folder}")
                    try:
                        shutil.rmtree(round_folder)
                        print("✓ Folder deleted successfully")
                        cv2.destroyAllWindows()
                        return
                    except Exception as e:
                        print(f"✗ Failed to delete: {e}")
                else:
                    print("✓ Deletion cancelled")

            # Control Logic
            key = cv2.waitKey(40 if not paused else 0) & 0xFF # 40ms = 25fps

            if key == 27: # ESC
                cv2.destroyAllWindows()
                return
            elif key == 32: # SPACE
                paused = not paused
            elif key == 83 or key == 100 or key == 3: # Right Arrow (83=Right, 100=d, 3=Ctrl+Right)
                break
            elif key == 8: # Backspace - 也可以触发删除
                delete_requested = True

        if not paused:
            window_idx += 1

    cv2.destroyAllWindows()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        # Auto-find latest
        base_dir = "F:/cs_data/traindata"
        if os.path.exists(base_dir):
            folders = [os.path.join(base_dir, d) for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
            if folders:
                target_dir = max(folders, key=os.path.getmtime)
            else:
                print("No data folders found.")
                sys.exit(1)
        else:
            print(f"Dir not found: {base_dir}")
            sys.exit(1)

    visualize_round(target_dir)
