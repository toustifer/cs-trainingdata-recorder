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
false_requested = False
false_button_rect = None  # (x1, y1, x2, y2)

def mouse_callback(event, x, y, flags, param):
    global delete_requested, delete_button_rect, false_requested, false_button_rect
    if event == cv2.EVENT_LBUTTONDOWN:
        # 检查是否点击了删除按钮
        if delete_button_rect:
            x1, y1, x2, y2 = delete_button_rect
            if x1 <= x <= x2 and y1 <= y <= y2:
                delete_requested = True
        # 检查是否点击了FALSE按钮
        if false_button_rect:
            x1, y1, x2, y2 = false_button_rect
            if x1 <= x <= x2 and y1 <= y <= y2:
                false_requested = True

def visualize_round(round_folder):
    global delete_requested, delete_button_rect, false_requested, false_button_rect
    delete_requested = False
    false_requested = False

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
    print("Controls: SPACE=pause, RIGHT=next, LEFT=prev, ESC=quit")
    print("  T=Mark as Good (approved), E/F=Mark as Error (rejected), DELETE=Delete")

    window_name = "Training Data Playback"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL | cv2.WINDOW_KEEPRATIO)

    # 获取屏幕大小并设置合适的初始窗口大小
    try:
        import tkinter as tk
        root = tk.Tk()
        screen_width = root.winfo_screenwidth()
        screen_height = root.winfo_screenheight()
        root.destroy()

        # 设置窗口为屏幕的80%大小
        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.8)
        cv2.resizeWindow(window_name, window_width, window_height)
        print(f"[INFO] Window size: {window_width}x{window_height} (80% of screen)")
    except:
        # 如果获取屏幕大小失败，使用默认值
        cv2.resizeWindow(window_name, 1600, 900)
        print(f"[INFO] Window size: 1600x900 (default)")

    cv2.setMouseCallback(window_name, mouse_callback)

    paused = False
    window_idx = 0
    skipped_windows = 0  # 统计跳过的窗口数量
    total_windows = len(windows)

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
            skipped_windows += 1
            window_idx += 1

            # 检查丢帧比例，如果超过50%，提示删除
            skip_ratio = skipped_windows / total_windows
            if skip_ratio > 0.5 and skipped_windows > 5:  # 超过50%且至少5个窗口丢失
                print(f"\n[WARNING] Too many frames missing: {skipped_windows}/{total_windows} ({skip_ratio*100:.1f}%)")
                print(f"[WARNING] This data seems corrupted. Auto-deleting: {round_folder}")
                try:
                    cv2.destroyAllWindows()
                    cv2.waitKey(1)
                    import gc
                    gc.collect()
                    time.sleep(0.5)
                    shutil.rmtree(round_folder)
                    print("[OK] Folder deleted successfully")
                    print("__DELETED__")
                    sys.stdout.flush()
                    return
                except Exception as e:
                    print(f"[ERROR] Failed to delete: {e}")
                    return
            continue

        # Play frames in this window
        for i, frame_path in enumerate(valid_frames):
            img = cv2.imread(frame_path)
            if img is None:
                continue

            # Create a canvas: Image on left, Info on right
            h, w = img.shape[:2]
            info_w = 500  # 增加信息面板宽度
            canvas = np.zeros((h, w + info_w, 3), dtype=np.uint8)
            canvas[:, :w] = img

            # Fill Info Panel (Dark background)
            canvas[:, w:] = (30, 30, 30) 

            # Helper to draw text
            y_offset = 30
            line_height = 22

            def draw_text(text, color=(200, 200, 200), font_scale=0.55, thickness=1):
                nonlocal y_offset
                # 限制文本长度，避免超出边界
                max_chars = 55
                if len(text) > max_chars:
                    text = text[:max_chars-3] + '...'
                cv2.putText(canvas, text, (w + 10, y_offset),
                           cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)
                y_offset += line_height

            # 显示文件路径（最顶部）
            draw_text("=== DATA PATH ===", (100, 200, 255), 0.6, 2)
            # 显示文件夹名称
            folder_name = os.path.basename(round_folder)
            draw_text(f"Folder: {folder_name}", (180, 180, 180), 0.5)
            draw_text(f"File: data.json", (180, 180, 180), 0.5)
            y_offset += 5

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

            # 绘制FALSE按钮 (橙色按钮在右下角上方)
            btn_w, btn_h = 120, 40
            btn_x1 = w + info_w - btn_w - 20  # 右边距 20
            btn_y1 = h - btn_h * 2 - 30  # 在DELETE按钮上方
            btn_x2 = btn_x1 + btn_w
            btn_y2 = btn_y1 + btn_h
            false_button_rect = (btn_x1, btn_y1, btn_x2, btn_y2)

            # 按钮背景 (橙色)
            cv2.rectangle(canvas, (btn_x1, btn_y1), (btn_x2, btn_y2), (0, 140, 255), -1)
            # 按钮边框
            cv2.rectangle(canvas, (btn_x1, btn_y1), (btn_x2, btn_y2), (0, 165, 255), 2)
            # 按钮文字
            cv2.putText(canvas, "FALSE", (btn_x1 + 25, btn_y1 + 28),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

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
                paused = True  # 暂停播放

                # 显示确认对话框 (在 OpenCV 窗口中)
                confirm_canvas = canvas.copy()
                h_c, w_c = confirm_canvas.shape[:2]

                # 半透明黑色背景
                overlay = confirm_canvas.copy()
                cv2.rectangle(overlay, (0, 0), (w_c, h_c), (0, 0, 0), -1)
                cv2.addWeighted(overlay, 0.7, confirm_canvas, 0.3, 0, confirm_canvas)

                # 对话框
                box_w, box_h = 400, 150
                box_x = (w_c - box_w) // 2
                box_y = (h_c - box_h) // 2
                cv2.rectangle(confirm_canvas, (box_x, box_y), (box_x + box_w, box_y + box_h), (40, 40, 40), -1)
                cv2.rectangle(confirm_canvas, (box_x, box_y), (box_x + box_w, box_y + box_h), (0, 0, 255), 2)

                # 文字
                cv2.putText(confirm_canvas, "DELETE THIS DATA?", (box_x + 80, box_y + 50),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                cv2.putText(confirm_canvas, "Press Y to confirm, N to cancel", (box_x + 50, box_y + 100),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

                cv2.imshow(window_name, confirm_canvas)
                cv2.waitKey(1)  # 确保显示更新
                print("\n[!] Press Y to delete, N to cancel...")

                # 等待用户按键 (使用循环确保捕获按键)
                confirmed = None
                while confirmed is None:
                    confirm_key = cv2.waitKey(100) & 0xFF  # 100ms 超时，循环检查
                    if confirm_key == ord('y') or confirm_key == ord('Y'):
                        confirmed = True
                    elif confirm_key == ord('n') or confirm_key == ord('N') or confirm_key == 27:
                        confirmed = False

                if confirmed:
                    print(f"[Deleting] {round_folder}")
                    try:
                        cv2.destroyAllWindows()
                        cv2.waitKey(1)

                        import gc
                        gc.collect()

                        import time
                        time.sleep(0.5)

                        shutil.rmtree(round_folder)
                        print("[OK] Folder deleted successfully")
                        # 输出特殊标记，让Electron知道已删除
                        print("__DELETED__")
                        sys.stdout.flush()
                        return
                    except Exception as e:
                        print(f"[ERROR] Failed to delete: {e}")
                else:
                    print("[OK] Deletion cancelled")
                    paused = False  # 恢复播放

            # 检查是否点击了FALSE按钮
            if false_requested:
                false_requested = False
                # 直接标记为rejected并跳到下一个，无需确认
                try:
                    data['review_status'] = 'rejected'
                    # 向后兼容：移除旧字段
                    data.pop('states', None)
                    data.pop('error', None)
                    with open(data_json_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    print("[OK] Marked as rejected via FALSE button")

                    # 重命名文件夹，加上 false 前缀
                    parent_dir = os.path.dirname(round_folder)
                    folder_name = os.path.basename(round_folder)

                    # 如果文件夹名称还没有 false 前缀，则添加
                    if not folder_name.startswith('false_'):
                        new_folder_name = f'false_{folder_name}'
                        new_folder_path = os.path.join(parent_dir, new_folder_name)

                        # 关闭窗口后再重命名
                        cv2.destroyAllWindows()
                        cv2.waitKey(1)
                        time.sleep(0.2)

                        try:
                            os.rename(round_folder, new_folder_path)
                            print(f"[OK] Renamed folder to: {new_folder_name}")
                        except Exception as rename_err:
                            print(f"[WARNING] Failed to rename folder: {rename_err}")

                    # 输出特殊标记并自动跳到下一个
                    print("__ERROR_MARKED__")
                    sys.stdout.flush()
                    return
                except Exception as e:
                    print(f"[ERROR] Failed to mark as rejected: {e}")

            # Control Logic
            key = cv2.waitKey(40 if not paused else 0) & 0xFF # 40ms = 25fps (原速)

            if key == 27: # ESC
                cv2.destroyAllWindows()
                return
            elif key == 32: # SPACE
                paused = not paused
            elif key == ord('t') or key == ord('T'): # T键 - 标记为已处理
                # 修改data.json，设置 review_status: "approved"
                try:
                    data['review_status'] = 'approved'
                    # 向后兼容：移除旧字段
                    data.pop('states', None)
                    data.pop('error', None)
                    with open(data_json_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    print("[OK] Marked as approved (review_status: approved)")
                    # 输出特殊标记并自动跳到下一个
                    print("__MARKED__")
                    sys.stdout.flush()
                    cv2.destroyAllWindows()
                    return
                except Exception as e:
                    print(f"[ERROR] Failed to mark: {e}")
            elif key == ord('f') or key == ord('F') or key == ord('e') or key == ord('E'): # F键或E键 - 标记为错误数据
                # 修改data.json，设置 review_status: "rejected"
                try:
                    data['review_status'] = 'rejected'
                    # 向后兼容：移除旧字段
                    data.pop('states', None)
                    data.pop('error', None)
                    with open(data_json_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    print("[OK] Marked as rejected (review_status: rejected)")

                    # 重命名文件夹，加上 false 前缀
                    parent_dir = os.path.dirname(round_folder)
                    folder_name = os.path.basename(round_folder)

                    # 如果文件夹名称还没有 false 前缀，则添加
                    if not folder_name.startswith('false_'):
                        new_folder_name = f'false_{folder_name}'
                        new_folder_path = os.path.join(parent_dir, new_folder_name)

                        # 关闭窗口后再重命名
                        cv2.destroyAllWindows()
                        cv2.waitKey(1)
                        time.sleep(0.2)

                        try:
                            os.rename(round_folder, new_folder_path)
                            print(f"[OK] Renamed folder to: {new_folder_name}")
                        except Exception as rename_err:
                            print(f"[WARNING] Failed to rename folder: {rename_err}")

                    # 输出特殊标记并自动跳到下一个
                    print("__ERROR_MARKED__")
                    sys.stdout.flush()
                    return
                except Exception as e:
                    print(f"[ERROR] Failed to mark as error: {e}")
            elif key == 83 or key == 100 or key == 3: # Right Arrow (83=Right, 100=d, 3=Ctrl+Right)
                # 输出特殊标记，让Electron知道需要切换到下一个
                print("__NEXT__")
                sys.stdout.flush()
                cv2.destroyAllWindows()
                return
            elif key == 81 or key == 97: # Left Arrow (81=Left, 97=a)
                # 输出特殊标记，让Electron知道需要切换到上一个
                print("__PREV__")
                sys.stdout.flush()
                cv2.destroyAllWindows()
                return
            elif key == 8: # Backspace - 也可以触发删除
                delete_requested = True

        if not paused:
            window_idx += 1

    cv2.destroyAllWindows()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        print("错误: 未提供数据目录路径")
        print("用法: python visualize_playback.py <数据目录路径>")
        sys.exit(1)

    visualize_round(target_dir)
