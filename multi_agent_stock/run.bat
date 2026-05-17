@echo off
chcp 65001 > nul
cd /d "%~dp0"
title Stock Analysis AI

echo.
echo ================================================
echo   Stock Analysis Multi-Agent System
echo   Teams: Value / Growth / Technical
echo          Macro / Quant / Risk
echo   Supports KRX + NYSE + NASDAQ
echo ================================================
echo.

:: Python check
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found.
    echo   Please install from https://python.org
    pause
    exit /b 1
)

:: Install anthropic if missing
python -c "import anthropic" > nul 2>&1
if errorlevel 1 (
    echo [INSTALL] Installing anthropic package...
    python -m pip install -r requirements.txt -q
    echo [DONE] Install complete.
    echo.
)

:: Load API key from .env
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if "%%a"=="ANTHROPIC_API_KEY" set ANTHROPIC_API_KEY=%%b
    )
)

if "%ANTHROPIC_API_KEY%"=="" (
    echo [ERROR] ANTHROPIC_API_KEY not found in .env
    notepad .env
    pause
    exit /b 1
)
echo [OK] API key loaded.
echo [OK] Loading 30 analysts...
echo.

:: Run
python main.py %*

echo.
echo ================================================
echo   Results saved in: results folder
echo ================================================
if exist results ( explorer results )
pause
