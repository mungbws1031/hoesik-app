@echo off
chcp 65001 > nul
cd /d "%~dp0"
title 30인 멀티에이전트 토론 시스템

:: ───────────────────────────────────────
:: 헤더
:: ───────────────────────────────────────
echo.
echo ================================================
echo   30인 멀티에이전트 토론 시스템 (6팀 x 5명)
echo   팀: 기획 / 디자인 / 마케팅
echo       전략기획 / 제품설계 / 시장조사
echo ================================================
echo.

:: ───────────────────────────────────────
:: Python 설치 확인
:: ───────────────────────────────────────
python --version > nul 2>&1
if errorlevel 1 (
    echo [오류] Python이 설치되어 있지 않습니다.
    echo   https://python.org 에서 설치해주세요.
    pause
    exit /b 1
)

:: ───────────────────────────────────────
:: 패키지 설치 확인 및 자동 설치
:: ───────────────────────────────────────
python -c "import anthropic" > nul 2>&1
if errorlevel 1 (
    echo [설치] anthropic 패키지를 설치합니다...
    python -m pip install -r requirements.txt -q
    echo [완료] 설치 완료
    echo.
)

:: ───────────────────────────────────────
:: API 키 로드
:: ───────────────────────────────────────
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if "%%a"=="ANTHROPIC_API_KEY" set ANTHROPIC_API_KEY=%%b
    )
)

if "%ANTHROPIC_API_KEY%"=="" (
    echo [오류] .env 파일에 ANTHROPIC_API_KEY가 없습니다.
    echo        .env 파일을 열어 API 키를 입력해주세요.
    notepad .env
    pause
    exit /b 1
)
if "%ANTHROPIC_API_KEY%"=="여기에_API_키_입력" (
    echo [오류] 실제 API 키를 .env 파일에 입력해주세요.
    notepad .env
    pause
    exit /b 1
)

echo [준비] API 키 확인 완료
echo [준비] 30명 직원 로딩 중...
echo.

:: ───────────────────────────────────────
:: 실행
:: ───────────────────────────────────────
python main.py %*

:: ───────────────────────────────────────
:: 종료
:: ───────────────────────────────────────
echo.
echo ================================================
echo   결과 파일 위치: results 폴더
echo ================================================
explorer results 2>nul
pause
