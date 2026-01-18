@echo off
echo [1/3] Installing Node.js dependencies...
call npm install --omit=dev
echo [2/3] Installing Python dependencies...
pip install opencv-python numpy
echo [3/3] Done.
pause
