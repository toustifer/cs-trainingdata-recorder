#!/bin/bash

# 批量处理所有玩家所有回合的训练数据
# 10个玩家 x 23个回合 = 230个任务

# 设置路径
DEMO_PATH="/d/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem"
SCRIPT_DIR="/d/myprogram/cs_learning/tools/cs-demo-manager"
OUTPUT_DIR="/d/training_data_output"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

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
LOG_FILE="$OUTPUT_DIR/batch_process_$(date +%Y%m%d_%H%M%S).log"

echo "======================================" | tee -a "$LOG_FILE"
echo "批量训练数据收集开始" | tee -a "$LOG_FILE"
echo "开始时间: $(date)" | tee -a "$LOG_FILE"
echo "总任务数: $TOTAL_TASKS" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 双重循环：每个玩家的每个回合
for i in "${!players[@]}"; do
  player="${players[$i]}"
  player_name="${player_names[$i]}"

  echo "" | tee -a "$LOG_FILE"
  echo "========================================" | tee -a "$LOG_FILE"
  echo "玩家 $((i+1))/10: $player_name ($player)" | tee -a "$LOG_FILE"
  echo "========================================" | tee -a "$LOG_FILE"

  for round in {1..23}; do
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

    # 执行任务
    cd "$SCRIPT_DIR"
    node scripts/complete-training-pipeline.mjs "$DEMO_PATH" "$player" "$round" >> "$LOG_FILE" 2>&1
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
      echo "✓ 完成: 玩家 $player_name 回合 $round" | tee -a "$LOG_FILE"
    else
      echo "✗ 失败: 玩家 $player_name 回合 $round (退出码: $EXIT_CODE)" | tee -a "$LOG_FILE"
      echo "继续处理下一个任务..." | tee -a "$LOG_FILE"
    fi
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
echo "日志文件: $LOG_FILE" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"
