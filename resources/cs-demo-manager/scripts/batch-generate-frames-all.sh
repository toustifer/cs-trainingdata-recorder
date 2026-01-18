#!/bin/bash

# 批量生成所有玩家所有回合的视频帧
# 10个玩家 x 23个回合 = 230个任务
# 输出到 F:\cs_data\traindata

# ============= 可控退出机制 =============
# 创建PID文件
SCRIPT_DIR="/d/myprogram/cs_learning/tools/cs-demo-manager/scripts"
PID_FILE="/f/cs_data/batch_process.pid"
STOP_FILE="/f/cs_data/batch_process.stop"

# 记录当前进程ID  
echo $$ > "$PID_FILE"

# 删除停止标记文件（如果存在）
rm -f "$STOP_FILE"

# 信号处理函数
cleanup() {
    echo ""
    echo "======================================" | tee -a "$LOG_FILE"
    echo "收到停止信号，正在清理..." | tee -a "$LOG_FILE"
    echo "======================================" | tee -a "$LOG_FILE"

    # 关闭CS2
    cmd.exe /c "taskkill /F /IM cs2.exe" 2>/dev/null

    # 删除PID文件
    rm -f "$PID_FILE"

    echo "已停止。可以通过以下命令查看进度：" | tee -a "$LOG_FILE"
    echo "  tail -f $LOG_FILE" | tee -a "$LOG_FILE"

    exit 0
}

# 注册信号处理
trap cleanup SIGTERM SIGINT

# 检查停止标记的函数
check_stop() {
    if [ -f "$STOP_FILE" ]; then
        echo "检测到停止标记文件，正在退出..." | tee -a "$LOG_FILE"
        cleanup
    fi
}

echo "======================================" | tee -a "$LOG_FILE"
echo "进程控制说明：" | tee -a "$LOG_FILE"
echo "  - PID文件: $PID_FILE" | tee -a "$LOG_FILE"
echo "  - 停止方法1: 创建文件 $STOP_FILE" | tee -a "$LOG_FILE"
echo "  - 停止方法2: kill -TERM \$(cat $PID_FILE)" | tee -a "$LOG_FILE"
echo "  - 停止方法3: Ctrl+C" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo ""

# ============= 设置路径 =============
DEMO_PATH="/d/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem"
CHECKSUM="c6c0a055158ff5fe"

# 10个玩家的Steam ID
players=(
  76561199138765870  # -shNz-
  76561198874529807  # -Kunai
  76561198883511494  # -dyym
  76561198356894004  # Hermes
  76561198386265483  # looooooooI
  76561199063238565  # suns1de1437-
  76561198971749043  # keeeeeeekw
  76561198081687729  # KEiiiii
  76561198076696741  # Kylar
  76561199167929819  # K00R-I
)

# 玩家名称（用于显示）
player_names=(
  "-shNz-"
  "-Kunai"
  "-dyym"
  "Hermes"
  "looooooooI"
  "suns1de1437-"
  "keeeeeeekw"
  "KEiiiii"
  "Kylar"
  "K00R-I"
)

# 进度跟踪
TOTAL_TASKS=230
CURRENT_TASK=0
START_TIME=$(date +%s)

# 日志文件
LOG_FILE="/f/cs_data/batch_process_$(date +%Y%m%d_%H%M%S).log"

echo "======================================" | tee "$LOG_FILE"
echo "批量视频帧生成开始" | tee -a "$LOG_FILE"
echo "开始时间: $(date)" | tee -a "$LOG_FILE"
echo "总任务数: $TOTAL_TASKS" | tee -a "$LOG_FILE"
echo "输出目录: F:\cs_data\traindata" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 双重循环：每个玩家的每个回合
for i in "${!players[@]}"; do
  check_stop  # 检查停止标记

  player="${players[$i]}"
  player_name="${player_names[$i]}"

  echo "" | tee -a "$LOG_FILE"
  echo "========================================" | tee -a "$LOG_FILE"
  echo "玩家 $((i+1))/10: $player_name ($player)" | tee -a "$LOG_FILE"
  echo "========================================" | tee -a "$LOG_FILE"

  for round in {1..23}; do
    check_stop  # 检查停止标记

    CURRENT_TASK=$((CURRENT_TASK + 1))

    # 计算进度
    PERCENT=$((CURRENT_TASK * 100 / TOTAL_TASKS))

    # 计算预估剩余时间
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    if [ $CURRENT_TASK -gt 1 ]; then
      AVG_TIME=$((ELAPSED / (CURRENT_TASK - 1)))
      REMAINING_TASKS=$((TOTAL_TASKS - CURRENT_TASK))
      ETA=$((AVG_TIME * REMAINING_TASKS))
      ETA_MIN=$((ETA / 60))
      ETA_HOUR=$((ETA_MIN / 60))
      ETA_MIN=$((ETA_MIN % 60))
    else
      ETA_HOUR=0
      ETA_MIN=0
    fi

    echo "" | tee -a "$LOG_FILE"
    echo "[$CURRENT_TASK/$TOTAL_TASKS] ($PERCENT%) 回合 $round - 预估剩余: ${ETA_HOUR}h ${ETA_MIN}m" | tee -a "$LOG_FILE"
    echo "开始时间: $(date)" | tee -a "$LOG_FILE"

    # 执行任务：生成视频帧
    cd "$SCRIPT_DIR/.."
    node scripts/cli-generate-frames.mjs \
      --checksum "$CHECKSUM" \
      --player "$player" \
      --round "$round" \
      --demo "$DEMO_PATH" >> "$LOG_FILE" 2>&1
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
      echo "✓ 完成: 玩家 $player_name 回合 $round" | tee -a "$LOG_FILE"
    else
      echo "✗ 失败: 玩家 $player_name 回合 $round (退出码: $EXIT_CODE)" | tee -a "$LOG_FILE"
      echo "继续处理下一个任务..." | tee -a "$LOG_FILE"
    fi

    # 短暂暂停，让CS2完全退出
    sleep 2
  done
done

# 完成统计
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))
TOTAL_HOUR=$((TOTAL_TIME / 3600))
TOTAL_MIN=$(((TOTAL_TIME % 3600) / 60))

echo "" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo "批量处理完成！" | tee -a "$LOG_FILE"
echo "结束时间: $(date)" | tee -a "$LOG_FILE"
echo "总耗时: ${TOTAL_HOUR}h ${TOTAL_MIN}m" | tee -a "$LOG_FILE"
echo "已处理: $CURRENT_TASK 个任务" | tee -a "$LOG_FILE"
echo "输出目录: F:\cs_data\traindata" | tee -a "$LOG_FILE"
echo "日志文件: $LOG_FILE" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"

# 验证数据
echo "" | tee -a "$LOG_FILE"
echo "验证数据完整性..." | tee -a "$LOG_FILE"
cd "$SCRIPT_DIR/.."
node out/cli.js query-training | tee -a "$LOG_FILE"

# 清理PID文件
rm -f "$PID_FILE"
