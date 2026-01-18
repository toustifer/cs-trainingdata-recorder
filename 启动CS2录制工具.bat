@echo off
chcp 65001 >nul
title CS2 Data Reaper Pro - 启动器

echo ================================================
echo CS2 Data Reaper Pro 智能启动器
echo ================================================
echo.

REM 配置路径
set "CS2_PATH=F:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive"
set "PLUGIN_SOURCE=F:\cs\csdata\win-unpacked\win-unpacked\resources\static\cs2\server_14112.dll"
set "PLUGIN_DEST=%CS2_PATH%\game\csgo\csdm\bin\server.dll"
set "GAMEINFO=%CS2_PATH%\game\csgo\gameinfo.gi"
set "APP_PATH=%~dp0CS2 Data Reaper Pro.exe"

echo [1/3] 检查并安装 CS2 插件...
if not exist "%PLUGIN_SOURCE%" (
    echo ⚠ 警告：插件源文件不存在
    echo 路径：%PLUGIN_SOURCE%
    goto SKIP_PLUGIN
)

REM 创建插件目录
if not exist "%CS2_PATH%\game\csgo\csdm\bin" (
    echo   创建插件目录...
    mkdir "%CS2_PATH%\game\csgo\csdm\bin" 2>nul
)

REM 安装插件
echo   复制插件文件...
copy /Y "%PLUGIN_SOURCE%" "%PLUGIN_DEST%" >nul 2>&1
if errorlevel 1 (
    echo   ⚠ 插件复制失败（可能需要管理员权限）
    goto SKIP_PLUGIN
)

echo   ✓ 插件已安装
goto CHECK_GAMEINFO

:SKIP_PLUGIN
echo   → 跳过插件安装

:CHECK_GAMEINFO
echo.
echo [2/3] 检查并修正 gameinfo.gi...
if not exist "%GAMEINFO%" (
    echo   ⚠ 警告：gameinfo.gi 不存在
    goto START_APP
)

REM 检查是否包含 csgo/csdm
findstr /C:"csgo/csdm" "%GAMEINFO%" >nul 2>&1
if errorlevel 1 (
    echo   ⚠ gameinfo.gi 中未找到 csgo/csdm 配置
    echo   需要手动添加插件路径到 gameinfo.gi
    goto START_APP
)

REM 检查顺序是否正确（csgo/csdm 应该在 csgo 之前）
powershell -Command "$lines = Get-Content '%GAMEINFO%'; $csdmIndex = -1; $csgoIndex = -1; for ($i=0; $i -lt $lines.Length; $i++) { if ($lines[$i] -match 'Game\s+csgo/csdm') { $csdmIndex = $i } if ($lines[$i] -match 'Game\s+csgo$') { $csgoIndex = $i } }; if ($csdmIndex -gt $csgoIndex -and $csgoIndex -ne -1) { exit 1 } else { exit 0 }"

if errorlevel 1 (
    echo   ⚠ csgo/csdm 顺序不正确，正在修正...

    REM 备份文件
    if not exist "%GAMEINFO%.backup" (
        copy /Y "%GAMEINFO%" "%GAMEINFO%.backup" >nul
    )

    REM 修正顺序
    powershell -Command "$content = Get-Content '%GAMEINFO%' -Raw; $content = $content -replace '(\t+Game\t+csgo)\r?\n(\t+Game\t+csgo/csdm)', '$2`r`n$1'; Set-Content '%GAMEINFO%' -Value $content -NoNewline"

    if errorlevel 1 (
        echo   ✗ 修正失败
    ) else (
        echo   ✓ 已修正 gameinfo.gi 顺序
    )
) else (
    echo   ✓ gameinfo.gi 配置正确
)

:START_APP
echo.
echo [3/3] 启动 CS2 Data Reaper Pro...
echo ================================================
echo.

if not exist "%APP_PATH%" (
    echo 错误：找不到应用程序
    echo 路径：%APP_PATH%
    pause
    exit /b 1
)

REM 启动应用
start "" "%APP_PATH%"

REM 等待3秒后退出（让用户看到信息）
timeout /t 3 >nul

exit /b 0
