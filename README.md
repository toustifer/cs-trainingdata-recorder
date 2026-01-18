# CS2 训练数据高精度采集工具

一键式 CS2 Demo 分析、录制、可视化工具。基于 Electron + Node.js + Python，实现完全自动化的训练数据采集流程。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)](https://www.microsoft.com/windows)

---

## 📖 目录

- [功能特性](#功能特性)
- [环境要求](#环境要求)
- [安装指南](#安装指南)
- [配置说明](#配置说明)
- [使用指南](#使用指南)
- [工作流程](#工作流程)
- [常见问题](#常见问题)
- [项目结构](#项目结构)
- [开发说明](#开发说明)

---

## ✨ 功能特性

### 核心功能

- **智能Demo分析**: 自动解析CS2 demo文件，提取训练窗口数据
- **自动化录制**: 使用HLAE自动录制游戏画面，支持批量处理
- **视频切片**: FFmpeg自动按训练窗口切片，提取关键帧
- **可视化审核**: 交互式播放和审核训练数据
- **进度追踪**: 实时显示处理进度，智能跳过已完成任务
- **容错机制**: 自动检测损坏demo文件，fallback机制保证稳定性

### 智能特性

- **双重分析策略**: 快速扫描 + 完整分析，优化性能
- **智能去重**: 自动跳过已完成的回合，支持断点续传
- **自动清理**: 检测并清理失败的分析数据
- **配置自适应**: 自动从CSDM配置读取FFmpeg和CS2路径

---

## 🔧 环境要求

### 必需组件

| 组件 | 版本要求 | 用途 |
|------|---------|------|
| **Windows** | 10/11 | 运行平台 |
| **Node.js** | v18+ | 运行Electron和CLI工具 |
| **Python** | 3.10+ | 可视化回放脚本 |
| **PostgreSQL** | 12+ | 存储demo元数据和训练窗口 |
| **HLAE** | 最新版 | 录制CS2游戏视频 |
| **FFmpeg** | 最新版 | 视频切片和帧提取 |
| **CS2** | 最新版 | 游戏本体 |

### Python依赖

```bash
pip install opencv-python numpy
```

---

## 📦 安装指南

### 1. 下载Release

从 [Releases](https://github.com/toustifer/cs-trainingdata-recorder/releases) 下载最新版本的压缩包并解压。

### 2. 安装Node.js依赖

```bash
cd resources/app
npm install
```

### 3. 配置PostgreSQL数据库

```bash
# 创建数据库
createdb csdm

# 数据库会在首次运行时自动初始化表结构
```

### 4. 安装HLAE

从 [AdvancedFX官网](https://www.advancedfx.org/) 下载并安装最新版HLAE。

### 5. 下载FFmpeg

从 [FFmpeg官网](https://ffmpeg.org/download.html) 下载essentials build并解压到任意位置。

---

## ⚙️ 配置说明

### 应用配置文件

配置文件位置: `C:\Users\你的用户名\Documents\cs2_reaper_settings.json`

参考 `config/settings.example.json` 创建配置文件:

```json
{
  "demoDir": "F:\\your\\path\\to\\demo\\files",
  "outputDir": "F:\\your\\path\\to\\output",
  "playerSteamId": "",
  "selectedFile": null,
  "rounds": "",
  "dbUser": "postgres",
  "dbPass": "your_database_password",
  "speed": "1",
  "framesPerWindow": "10"
}
```

**配置项说明:**

- `demoDir`: Demo文件总目录（所有.dem文件的根目录）
- `outputDir`: 录制数据输出目录
- `dbUser`: PostgreSQL数据库用户名
- `dbPass`: PostgreSQL数据库密码
- `speed`: 录制倍速（1=实时，8=8倍速，推荐8-16）
- `framesPerWindow`: 每个训练窗口提取的帧数（默认10）

### CSDM配置文件

配置文件位置: `C:\Users\你的用户名\.csdm\settings.json`

参考 `config/csdm-settings.example.json` 配置，重点配置:

1. **数据库连接**:
```json
"database": {
  "hostname": "127.0.0.1",
  "port": 5432,
  "username": "postgres",
  "password": "your_password",
  "database": "csdm"
}
```

2. **CS2路径**:
```json
"playback": {
  "customCs2LocationEnabled": true,
  "cs2ExecutablePath": "你的Steam路径\\Counter-Strike Global Offensive\\game\\bin\\win64\\cs2.exe"
}
```

3. **FFmpeg路径**:
```json
"video": {
  "ffmpegSettings": {
    "customLocationEnabled": true,
    "customExecutableLocation": "F:\\ffmpeg\\bin\\ffmpeg.exe"
  }
}
```

---

## 🚀 使用指南

### 启动应用

双击 `CS2 Data Reaper Pro.exe` 启动应用。

或者使用命令行:
```bash
cd resources/app
npm start
```

### 基本工作流

#### 1. 准备Demo文件

将所有 `.dem` 文件放入配置的 `demoDir` 目录。

#### 2. 分析Demo

- 点击侧边栏 "✅ 全部文件" 选择所有demo
- 点击 "1. 分析入库" 按钮
- 等待分析完成，查看日志输出

#### 3. 录制训练数据

- 确保 "✅ 全部文件" 仍处于选中状态
- 留空 "玩家 Steam ID" 和 "回合号" （录制所有玩家和回合）
- 点击 "2. 启动录制收割" 按钮
- ⚠️ 录制过程中不要操作电脑，CS2会自动启动和关闭

#### 4. 可视化审核

- 点击 "🎬 选择Demo浏览"
- 使用快捷键审核数据:
  - `T`: 标记为合格
  - `E`/`F`: 标记为错误
  - `→`/`D`: 下一个窗口
  - `←`/`A`: 上一个窗口
  - `SPACE`: 暂停/继续
  - `ESC`: 退出

### 高级功能

#### 只录制特定玩家

1. 选中单个Demo
2. 点击侧边栏玩家名（自动复制Steam ID到输入框）
3. 点击 "2. 启动录制收割"

#### 补录缺失回合

1. 点击 "🔄 刷新进度" 查看完成情况
2. 在 "回合号" 输入框填入缺失回合（如 `5,12,18`）
3. 点击 "2. 启动录制收割"

#### 调整录制速度

- 在UI右上角 "录制倍速" 输入框调整
- 推荐值: 8-16倍速
- 过高倍速可能导致丢帧

---

## 🔄 工作流程

### 智能分析机制

系统使用双重分析策略:

#### 1. 快速扫描（自动触发）
- **触发时机**: 选中demo文件、刷新文件列表
- **速度**: 1-3秒/demo
- **功能**: 只显示玩家列表，不生成训练数据
- **命令**: `--list-players`

#### 2. 完整分析（手动触发）
- **触发时机**: 点击 "分析入库" 按钮
- **速度**: 10-30秒/demo
- **功能**: 深度解析，生成training_windows表数据
- **智能**: 自动跳过已有完整数据的demo

#### 3. Fallback容错机制
```
分析 → 插入数据库 → 失败（CSV丢失/异步问题）
  ↓
等待3秒 → 查询数据库 → 失败（5次重试）
  ↓
Fallback → 直接读取demo文件 → 获取tickrate
  ↓
继续导出training_windows → 成功
```

### 输出目录结构

```
输出主目录/
└── Demo名称/
    ├── 玩家名_SteamID_round1/
    │   ├── full_round.mp4        # 完整回合视频
    │   ├── frames/                # 提取的帧
    │   │   ├── frame_0000.jpg
    │   │   ├── frame_0001.jpg
    │   │   └── ...
    │   └── data.json              # 窗口元数据
    ├── 玩家名_SteamID_round2/
    └── ...
```

### data.json 格式

```json
{
  "demo_file": "demo名称.dem",
  "player_name": "玩家名",
  "player_steam_id": "76561...",
  "round_number": 1,
  "windows": [
    {
      "window_idx": 0,
      "start_tick": 12345,
      "end_tick": 12595,
      "frames": ["frames/frame_0000.jpg", ...],
      "player_state": {...},
      "events": [...]
    }
  ],
  "review_status": "approved"  // or "rejected" or null
}
```

---

## ❓ 常见问题

### Q1: 录制时CS2无法启动？

**A**: 检查以下几点:
- HLAE是否正确安装
- CS2是否已安装并可正常启动
- CSDM配置中CS2路径是否正确
- 数据库中是否有该Demo的训练窗口数据（需先执行"分析入库"）

### Q2: 进度显示一直是0/X？

**A**: 可能原因:
- 输出目录路径不正确
- 点击 "🔄 刷新进度" 重新检测
- 检查是否有 `full_round.mp4` 文件

### Q3: 可视化时提示找不到帧文件？

**A**: 检查 `data.json` 中的路径是否正确:
- 路径格式应为相对路径: `frames/frame_0000.jpg`
- 不应包含父级目录前缀

### Q4: 数据库连接失败？

**A**: 确认:
- PostgreSQL服务是否运行
- 数据库密码是否正确
- 数据库名称是否为 `csdm`

### Q5: FFmpeg路径错误？

**A**: 在CSDM配置中设置FFmpeg路径:
- 打开CSDM GUI
- 设置 → 视频 → FFmpeg设置
- 勾选 "自定义位置"
- 填入ffmpeg.exe的完整路径

### Q6: 录制速度太慢/太快？

**A**: 调整以下参数:
- 提高/降低 "录制倍速" (推荐8-16)
- 检查 `host_timescale` 是否生效（需要 `sv_cheats 1`）
- 确认配置文件中的speed值

---

## 📁 项目结构

```
.
├── CS2 Data Reaper Pro.exe    # Electron主程序
├── resources/
│   └── app/
│       ├── main.js             # Electron主进程
│       ├── index.html          # UI界面
│       ├── README.md           # 详细文档
│       ├── out/                # CSDM CLI编译输出
│       │   └── cli.js          # Demo分析引擎
│       └── scripts/
│           ├── smart-batch-hlae.mjs        # 批量录制主控脚本
│           ├── cli-generate-hlae-video.mjs # 单回合录制脚本
│           ├── visualize_playback.py       # 可视化工具
│           └── install-plugin.mjs          # CS2插件安装
├── config/
│   ├── settings.example.json           # 应用配置示例
│   └── csdm-settings.example.json      # CSDM配置示例
└── README.md                   # 本文件
```

---

## 🔨 开发说明

### 修改UI

编辑 `resources/app/index.html` 和 `resources/app/main.js`，重启应用即可看到效果。

### 修改录制脚本

编辑 `resources/app/scripts/` 下的脚本文件，无需重启应用，下次录制时自动使用新代码。

### 调试模式

```bash
cd resources/app
npm start
```

打开开发者工具: `Ctrl + Shift + I`

### 数据库查询

```sql
-- 查看所有demo
SELECT checksum, name, created_at FROM matches;

-- 查看训练窗口数量
SELECT COUNT(*) FROM training_windows;

-- 查看某个demo的训练窗口
SELECT * FROM training_windows WHERE match_checksum = 'xxx';
```

---

## 📄 许可证

内部使用工具，请勿外传。

---

## 👥 维护者

CS2-AI-Team

---

## 🙏 致谢

- [cs-demo-manager](https://github.com/akiver/cs-demo-manager) - 核心demo分析引擎
- [HLAE](https://www.advancedfx.org/) - 游戏录制工具
- [FFmpeg](https://ffmpeg.org/) - 视频处理工具

---

**Happy Training! 🚀**
