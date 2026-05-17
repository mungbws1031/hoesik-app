"""
주식 분석 멀티에이전트 시스템 실행 진입점

사용법:
  python main.py                    # 대화형 모드 (팀 선택 포함)
  python main.py "삼성전자"          # 종목 직접 입력
  python main.py "NVDA" --all       # 전체 팀으로 분석
"""

import asyncio
import sys
import os
import datetime
from config import ANALYST_DATA, TEAM_COLORS, RESET_COLOR, BOLD
from orchestrator import StockAnalysisOrchestrator

# API 키 확인
if not os.environ.get("ANTHROPIC_API_KEY"):
    print("❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
    print("   PowerShell: $env:ANTHROPIC_API_KEY='your-api-key'")
    print("   CMD:        set ANTHROPIC_API_KEY=your-api-key")
    sys.exit(1)

ALL_TEAMS = list(ANALYST_DATA.keys())

# 예시 분석 종목 (국내·해외)
EXAMPLE_STOCKS = [
    "삼성전자 (005930.KS) — 국내 반도체·스마트폰 대장주",
    "SK하이닉스 (000660.KS) — HBM 메모리 반도체 수혜주",
    "NVIDIA (NVDA) — AI 반도체 글로벌 1위",
    "Apple (AAPL) — 글로벌 시가총액 최상위 빅테크",
    "카카오 (035720.KS) — 국내 플랫폼·핀테크 대표주",
    "Tesla (TSLA) — 전기차·자율주행·에너지 혁신 기업",
    "POSCO홀딩스 (005490.KS) — 철강·2차전지 소재 복합기업",
    "Amazon (AMZN) — 이커머스·클라우드(AWS) 절대 강자",
]


def _make_filename(stock: str) -> str:
    """파일명용 타임스탬프 + 종목 문자열"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_stock = "".join(c for c in stock[:20] if c.isalnum() or c in " _-").strip()
    return f"{timestamp}_{safe_stock}"


def save_result(stock: str, result: str, full_log: str, selected_teams: list):
    """결과를 results/ 폴더에 마크다운 파일로 저장"""
    os.makedirs("results", exist_ok=True)
    base = _make_filename(stock)

    header = (
        f"# 주식 분석 결과\n\n"
        f"**분석 종목:** {stock}\n\n"
        f"**참여 팀:** {' · '.join(selected_teams)}\n\n"
        f"**분석 일시:** {datetime.datetime.now().strftime('%Y년 %m월 %d일 %H:%M')}\n\n"
        f"---\n\n"
    )

    # ① 최종 투자의견 파일
    result_file = f"results/{base}_투자의견.md"
    with open(result_file, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("## 최종 투자의견\n\n")
        f.write(result)
    print(f"\n✅ 투자의견 저장: {result_file}")

    # ② 전체 분석 로그 파일
    log_file = f"results/{base}_전체분석로그.md"
    with open(log_file, "w", encoding="utf-8") as f:
        f.write(header)
        f.write(full_log)
    print(f"✅ 전체 로그 저장: {log_file}")

    try:
        os.startfile(os.path.abspath("results"))
    except Exception:
        pass


def save_partial(stock: str, content: str, label: str):
    """중간 저장: 오류/중단 시 지금까지 진행된 내용 보존"""
    os.makedirs("results", exist_ok=True)
    base = _make_filename(stock)
    partial_file = f"results/{base}_{label}_임시저장.md"
    with open(partial_file, "w", encoding="utf-8") as f:
        f.write(f"# [임시저장] {label}\n\n")
        f.write(f"**분석 종목:** {stock}\n\n")
        f.write(f"**저장 시각:** {datetime.datetime.now().strftime('%Y년 %m월 %d일 %H:%M:%S')}\n\n")
        f.write("---\n\n")
        f.write(content)
    print(f"\n⚠️  임시 저장됨: {partial_file}")


def select_teams() -> list:
    """참여할 팀을 선택"""
    print("\n" + "─" * 55)
    print(f"{BOLD}참여 팀 선택{RESET_COLOR}")
    print("─" * 55)

    for i, team in enumerate(ALL_TEAMS, 1):
        color = TEAM_COLORS.get(team, "")
        count = len(ANALYST_DATA[team])
        lead = ANALYST_DATA[team][0][0]
        print(f"  {i}. {color}{team}{RESET_COLOR} ({count}명, 팀장: {lead})")

    print()
    print("  0. 전체 팀 참여 (기본값, 6팀 30명)")
    print()
    raw = input("참여할 팀 번호를 입력하세요 (예: 1,3,5 또는 0): ").strip()

    if not raw or raw == "0":
        print(f"✓ 전체 {len(ALL_TEAMS)}개 팀 참여")
        return ALL_TEAMS

    selected = []
    for token in raw.replace(" ", "").split(","):
        if token.isdigit():
            idx = int(token) - 1
            if 0 <= idx < len(ALL_TEAMS):
                selected.append(ALL_TEAMS[idx])

    if len(selected) < 2:
        print("⚠️  최소 2개 팀이 필요합니다. 전체 팀으로 진행합니다.")
        return ALL_TEAMS

    print(f"✓ 선택된 팀: {' · '.join(selected)}")
    return selected


def print_header():
    print("\n" + "=" * 60)
    print(f"   {BOLD}주식 분석 멀티에이전트 시스템{RESET_COLOR}")
    print(f"   총 {len(ALL_TEAMS)}개 팀 · {sum(len(v) for v in ANALYST_DATA.values())}명 전문가")
    print(f"   국내(KRX) · 해외(NYSE·NASDAQ·etc) 모두 분석 가능")
    print("=" * 60)


async def main():
    print_header()

    # 종목 결정
    if len(sys.argv) > 1:
        stock_input = " ".join(sys.argv[1:])
        selected_teams = ALL_TEAMS
    else:
        print("\n📌 예시 분석 종목:")
        for i, s in enumerate(EXAMPLE_STOCKS, 1):
            print(f"  {i}. {s}")
        print()
        user_input = input("분석할 종목을 입력하세요 (번호 또는 직접 입력 — 예: 삼성전자, NVDA, 005930): ").strip()

        if user_input.isdigit() and 1 <= int(user_input) <= len(EXAMPLE_STOCKS):
            # 괄호 앞 종목명만 추출
            stock_input = EXAMPLE_STOCKS[int(user_input) - 1].split(" — ")[0].strip()
        else:
            stock_input = user_input

        if not stock_input:
            print("❌ 분석할 종목이 없습니다.")
            sys.exit(1)

        # 추가 정보 입력 (선택)
        print()
        extra = input("추가 분석 컨텍스트 (최근 이슈·분석 목적 등, 없으면 엔터): ").strip()
        if extra:
            stock_input = f"{stock_input} — {extra}"

        # 팀 선택
        selected_teams = select_teams()

    # 오케스트레이터 실행 루프
    orchestrator = StockAnalysisOrchestrator(selected_teams=selected_teams)

    while True:
        print(f"\n🔍 분석 시작: {BOLD}{stock_input}{RESET_COLOR}")
        print(f"   참여 팀: {' · '.join(selected_teams)}")
        print()

        try:
            result, full_log = await orchestrator.run(stock_input)
            save_result(stock_input, result, full_log, selected_teams)

        except KeyboardInterrupt:
            partial = "\n".join(orchestrator.full_log)
            if partial.strip():
                save_partial(stock_input, partial, "중단")
            print("\n분석이 중단되었습니다.")
            break

        except Exception as e:
            partial = "\n".join(orchestrator.full_log)
            if partial.strip():
                save_partial(stock_input, partial, "오류")
            print(f"\n❌ 오류 발생: {e}")
            raise

        print("\n" + "=" * 60)
        again = input("다른 종목을 분석할까요? (종목명 입력 또는 엔터로 종료): ").strip()
        if not again:
            print("종료합니다.")
            break

        stock_input = again

        # 새 종목마다 팀 다시 선택 여부
        reselect = input("참여 팀을 다시 선택할까요? (y/엔터로 유지): ").strip().lower()
        if reselect == "y":
            selected_teams = select_teams()
            orchestrator = StockAnalysisOrchestrator(selected_teams=selected_teams)


if __name__ == "__main__":
    asyncio.run(main())
