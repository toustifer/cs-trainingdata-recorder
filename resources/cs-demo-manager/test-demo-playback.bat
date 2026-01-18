@echo off
echo Testing CS2 demo playback...
echo.

set CS2_EXE=D:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\bin\win64\cs2.exe
set DEMO_PATH=D:/myprogram/cs_learning/dataset/1/1-52e312ad-0dd8-4da1-9944-d4588c4d933a-1-1.dem

echo CS2: %CS2_EXE%
echo Demo: %DEMO_PATH%
echo.
echo Starting CS2 with demo...
echo.

"%CS2_EXE%" -novid -insecure +playdemo "%DEMO_PATH%" -width 1280 -height 720 -sw

echo.
echo CS2 exited.
pause
