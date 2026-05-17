"""
실행 진입점

사용법:
  python main.py                        # 대화형 모드 (팀 선택 포함)
  python main.py "토론 주제를 입력하세요"  # 인수 모드
"""

import asyncio
import sys
import os
import datetime
from config import EMPLOYEE_DATA, TEAM_COLORS, RESET_COLOR, BOLD
from orchestrator import MultiAgentOrchestrator

# API 키 확인
if not os.environ.get("ANTHROPIC_API_KEY"):
    print("❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
    print("   PowerShell: $env:ANTHROPIC_API_KEY='your-api-key'")
    print("   CMD:        set ANTHROPIC_API_KEY=your-api-key")
    sys.exit(1)

ALL_TEAMS = list(EMPLOYEE_DATA.keys())

EXAMPLE_TOPICS = [
    "새로운 AI 기반 추천 기능을 다음 분기에 출시할지 여부",
    "앱 리디자인 범위: 전체 개편 vs 점진적 개선",
    "모바일 우선 전략 vs 웹/모바일 동시 개발",
    "유료 구독 모델 도입 시기와 가격 전략",
    "글로벌 시장 진출 우선순위 (미국 vs 동남아)",
]


def _make_filename(topic: str) -> str:
    """파일명용 타임스탬프 + 주제 문자열"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_topic = "".join(c for c in topic[:30] if c.isalnum() or c in " _-").strip()
    return f"{timestamp}_{safe_topic}"


def save_result(topic: str, result: str, full_log: str, selected_teams: list):
    """결과를 results/ 폴더에 마크다운 파일로 저장 (최종결론 + 전체 토론 로그)"""
    os.makedirs("results", exist_ok=True)
    base = _make_filename(topic)

    header = (
        f"# 토론 결과\n\n"
        f"**주제:** {topic}\n\n"
        f"**참여 팀:** {' · '.join(selected_teams)}\n\n"
        f"**일시:** {datetime.datetime.now().strftime('%Y년 %m월 %d일 %H:%M')}\n\n"
        f"---\n\n"
    )

    # ① 최종 결론 파일
    result_file = f"results/{base}_결론.md"
    with open(result_file, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("## 최종 결론\n\n")
        f.write(result)
    print(f"\n✅ 결론 저장: {result_file}")

    # ② 전체 토론 로그 파일
    log_file = f"results/{base}_전체로그.md"
    with open(log_file, "w", encoding="utf-8") as f:
        f.write(header)
        f.write(full_log)
    print(f"✅ 전체 로그 저장: {log_file}")

    os.startfile(os.path.abspath("results"))


def save_partial(topic: str, content: str, label: str):
    """중간 저장: 오류/중단 시 지금까지 진행된 내용 보존"""
    os.makedirs("results", exist_ok=True)
    base = _make_filename(topic)
    partial_file = f"results/{base}_{label}_임시저장.md"
    with open(partial_file, "w", encoding="utf-8") as f:
        f.write(f"# [임시저장] {label}\n\n")
        f.write(f"**주제:** {topic}\n\n")
        f.write(f"**저장 시각:** {datetime.datetime.now().strftime('%Y년 %m월 %d일 %H:%M:%S')}\n\n")
        f.write("---\n\n")
        f.write(content)
    print(f"\n⚠️  임시 저장됨: {partial_file}")


def select_teams() -> list:
    """참여할 팀을 선택"""
    print("\n" + "─" * 50)
    print(f"{BOLD}참여 팀 선택{RESET_COLOR}")
    print("─" * 50)

    for i, team in enumerate(ALL_TEAMS, 1):
        color = TEAM_COLORS.get(team, "")
        count = len(EMPLOYEE_DATA[team])
        print(f"  {i}. {color}{team}{RESET_COLOR} ({count}명)")

    print()
    print("  0. 전체 팀 참여 (기본값)")
    print()
    raw = input("참여할 팀 번호를 입력하세요 (예: 1,3,5 또는 0): ").strip()

    # 전체 선택
    if not raw or raw == "0":
        print(f"✓ 전체 {len(ALL_TEAMS)}개 팀 참여")
        return ALL_TEAMS

    # 번호로 선택
    selected = []
    for token in raw.replace(" ", "").split(","):
        if token.isdigit():
            idx = int(token) - 1
            if 0 <= idx < len(ALL_TEAMS):
                selected.append(ALL_TEAMS[idx])

    # 최소 2팀 보장
    if len(selected) < 2:
        print("⚠️  최소 2개 팀이 필요합니다. 전체 팀으로 진행합니다.")
        return ALL_TEAMS

    print(f"✓ 선택된 팀: {' · '.join(selected)}")
    return selected


async def main():
    print("\n" + "=" * 60)
    print(f"   {BOLD}멀티에이전트 회사 토론 시스템{RESET_COLOR}")
    print(f"   총 {len(ALL_TEAMS)}개 팀 · {sum(len(v) for v in EMPLOYEE_DATA.values())}명")
    print("=" * 60)

    # 주제 결정
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])
        selected_teams = ALL_TEAMS  # 인수 모드는 전체 팀
    else:
        print("\n📌 예시 토론 주제:")
        for i, t in enumerate(EXAMPLE_TOPICS, 1):
            print(f"  {i}. {t}")
        print()
        user_input = input("토론 주제를 입력하세요 (번호 또는 직접 입력): ").strip()

        if user_input.isdigit() and 1 <= int(user_input) <= len(EXAMPLE_TOPICS):
            topic = EXAMPLE_TOPICS[int(user_input) - 1]
        else:
            topic = user_input

        if not topic:
            print("❌ 토론 주제가 없습니다.")
            sys.exit(1)

        # 팀 선택
        selected_teams = select_teams()

    # 오케스트레이터 실행 (루프)
    orchestrator = MultiAgentOrchestrator(selected_teams=selected_teams)

    while True:
        try:
            result, full_log = await orchestrator.run(topic)
            save_result(topic, result, full_log, selected_teams)

        except KeyboardInterrupt:
            # Ctrl+C로 중단된 경우 지금까지 로그 임시 저장
            partial = "\n".join(orchestrator.full_log)
            if partial.strip():
                save_partial(topic, partial, "중단")
            print("\n토론이 중단되었습니다.")
            break

        except Exception as e:
            # 오류 발생 시 지금까지 로그 임시 저장
            partial = "\n".join(orchestrator.full_log)
            if partial.strip():
                save_partial(topic, partial, "오류")
            print(f"\n❌ 오류 발생: {e}")
            raise

        print("\n" + "=" * 60)
        again = input("새 주제로 다시 토론할까요? (주제 입력 또는 엔터로 종료): ").strip()
        if not again:
            print("종료합니다.")
            break

        topic = again

        # 새 주제마다 팀 다시 선택할지 물어보기
        reselect = input("참여 팀을 다시 선택할까요? (y/엔터로 유지): ").strip().lower()
        if reselect == "y":
            selected_teams = select_teams()
            orchestrator = MultiAgentOrchestrator(selected_teams=selected_teams)


if __name__ == "__main__":
    asyncio.run(main())
