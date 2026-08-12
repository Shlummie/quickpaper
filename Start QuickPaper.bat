@echo off
setlocal
cd /d "%~dp0"

start "QuickPaper Server" /B cmd /c "node server.js"
timeout /t 1 /nobreak >nul
start "QuickPaper" "http://127.0.0.1:4173/"

endlocal
