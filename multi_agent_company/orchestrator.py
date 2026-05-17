"""
오케스트레이터: 팀 생성, 토론 진행, 최종 결론 도출
"""

import asyncio
import time
from typing import Dict, List, Tuple
import anthropic

from config import (
    ANTHROPIC_API_KEY,
    MODEL_ORCHESTRATOR,
    MAX_TOKENS_FINAL,
    CROSS_ROUNDS,
    EMPLOYEE_DATA,
    TEAM_COLORS, RESET_COLOR, BOLD,
)
from agents import Employee, Team, Message

client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


def _divider(title: str = "", width: int = 60):
    if title:
        pad = (width - len(title) - 2) // 2
        print(f"\n{'─'*pad} {BOLD}{title}{RESET_COLOR} {'─'*pad}")
    else:
        print("─" * width)


class MultiAgentOrchestrator:
    """
    선택된 팀들로 토론을 진행하는 오케스트레이터.

    흐름:
      1. 팀별 내부 토론 (병렬)
      2. 팀 간 크로스 토론 (순차 라운드)
      3. 오케스트레이터가 최종 결론 도출
    """

    def __init__(self, selected_teams: list = None):
        self.selected_teams = selected_teams  # None이면 전체
        self.teams: Dict[str, Team] = self._build_teams()
        self.cross_history: List[Message] = []
        self.full_log: List[str] = []          # ← 전체 토론 로그 축적

    # ──────────────────────────────────────
    # 팀 생성
    # ──────────────────────────────────────

    def _build_teams(self) -> Dict[str, Team]:
        teams = {}
        total = 0
        for team_name, emp_list in EMPLOYEE_DATA.items():
            # 선택된 팀만 로딩
            if self.selected_teams and team_name not in self.selected_teams:
                continue
            members = [
                Employee(name=name, team=team_name, role=role, persona=persona)
                for name, role, persona in emp_list
            ]
            teams[team_name] = Team(team_name, members)
            total += len(members)
        team_names = " · ".join(teams.keys())
        print(f"{BOLD}✓ {total}명 로딩 완료 → 참여 팀: {team_names}{RESET_COLOR}")
        return teams

    # ──────────────────────────────────────
    # 로그 헬퍼
    # ──────────────────────────────────────

    def _log(self, text: str):
        """화면 출력 + 로그 동시 저장"""
        print(text)
        self.full_log.append(text)

    def _log_divider(self, title: str = "", width: int = 60):
        """구분선 화면 출력 + 로그 저장"""
        if title:
            line = f"\n{'─'*(width//2)} {title} {'─'*(width//2)}"
        else:
            line = "─" * width
        print(line)
        self.full_log.append(line)

    # ──────────────────────────────────────
    # 공개 API
    # ──────────────────────────────────────

    async def run(self, topic: str) -> Tuple[str, str]:
        """전체 토론 파이프라인 실행. (최종결론, 전체로그) 반환"""
        start = time.time()
        self.cross_history = []
        self.full_log = []

        self._log_divider(f"토론 주제: {topic}", width=70)
        self.full_log.append("")

        # 1단계: 팀 내부 토론 (모든 팀 병렬)
        self._log_divider("1단계 — 팀별 내부 토론 (병렬 진행)")
        all_positions, internal_logs = await self._run_internal_discussions(topic)

        # 내부 토론 전문 로그에 추가
        self._log_divider("각 팀 내부 토론 전문")
        for team_name, log_lines in internal_logs.items():
            color = TEAM_COLORS.get(team_name, "")
            self._log(f"\n{'='*10} {team_name} 내부 토론 {'='*10}")
            for line in log_lines:
                self.full_log.append(line)

        # 각 팀 공식 입장 출력
        self._log_divider("각 팀 공식 입장")
        self.full_log.append("\n## 각 팀 공식 입장\n")
        for team_name, position in all_positions.items():
            color = TEAM_COLORS.get(team_name, "")
            print(f"\n{color}{BOLD}[{team_name}]{RESET_COLOR}")
            print(f"  {position}")
            self.full_log.append(f"\n### [{team_name}]\n{position}")

        # 2단계: 팀 간 크로스 토론
        self._log_divider(f"2단계 — 팀 간 크로스 토론 ({CROSS_ROUNDS}라운드)")
        await self._run_cross_debate(topic, all_positions)

        # 3단계: 최종 결론
        self._log_divider("3단계 — 최종 결론 도출 (오케스트레이터)")
        result = await self._synthesize(topic, all_positions)

        elapsed = time.time() - start
        self._log_divider(f"완료 ({elapsed:.1f}초)", width=70)
        print(result)
        self.full_log.append("\n## 최종 결론\n")
        self.full_log.append(result)

        full_log_text = "\n".join(self.full_log)
        return result, full_log_text

    # ──────────────────────────────────────
    # 내부 구현
    # ──────────────────────────────────────

    async def _run_internal_discussions(self, topic: str) -> Tuple[Dict[str, str], Dict[str, List[str]]]:
        """모든 팀의 내부 토론을 순차 실행 (Rate limit 방어). (입장dict, 내부로그dict) 반환"""
        all_positions = {}
        internal_logs = {}

        for team_name, team in self.teams.items():
            res = await team.run_internal_discussion(topic)
            if isinstance(res, tuple):
                all_positions[team_name] = res[0]
                internal_logs[team_name] = res[1] if len(res) > 1 else []
            else:
                all_positions[team_name] = res
                internal_logs[team_name] = []
            # 팀 간 짧은 딜레이로 Rate limit 완충
            await asyncio.sleep(2)

        return all_positions, internal_logs

    async def _run_cross_debate(self, topic: str, all_positions: Dict[str, str]):
        """팀 간 크로스 토론: 각 팀장이 순서대로 발언"""
        self.full_log.append(f"\n## 팀 간 크로스 토론\n")

        for round_num in range(1, CROSS_ROUNDS + 1):
            self._log_divider(f"라운드 {round_num}")
            self.full_log.append(f"\n### 라운드 {round_num}\n")

            for team_name, team in self.teams.items():
                comment = await team.respond_to_cross_debate(
                    topic, all_positions, self.cross_history
                )
                msg = Message(
                    sender=team.lead.name,
                    team=team_name,
                    content=comment,
                )
                self.cross_history.append(msg)
                print(msg)
                self.full_log.append(str(msg))

            print()  # 라운드 구분 공백
            self.full_log.append("")

    async def _synthesize(self, topic: str, all_positions: Dict[str, str]) -> str:
        """오케스트레이터(최고 모델)가 전체 토론을 종합해 최종 결론 도출"""
        positions_text = "\n".join(
            f"[{team}]\n{pos}" for team, pos in all_positions.items()
        )
        cross_text = "\n".join(str(m) for m in self.cross_history)

        team_list = "·".join(self.teams.keys())
        resp = await client.messages.create(
            model=MODEL_ORCHESTRATOR,
            max_tokens=MAX_TOKENS_FINAL,
            messages=[{
                "role": "user",
                "content": (
                    f"다음은 '{topic}'에 대한 {len(self.teams)}개 팀({team_list})의\n"
                    f"전체 토론 결과입니다. 최고 의사결정자로서 최종 결론을 도출하세요.\n\n"
                    f"=== 각 팀 공식 입장 ===\n{positions_text}\n\n"
                    f"=== 팀 간 크로스 토론 전문 ===\n{cross_text}\n\n"
                    f"위 토론 전체를 면밀히 검토한 뒤 아래 형식으로 최종 결론을 작성하세요.\n"
                    f"단순 요약이 아닌, 실제로 실행 가능한 수준의 깊이 있는 결론을 내리세요.\n\n"
                    f"## 핵심 합의 사항\n"
                    f"(팀 간 이견 없이 모인 내용. 근거와 함께 서술)\n\n"
                    f"## 주요 이견 및 조율 방안\n"
                    f"(팀별 갈등 지점을 구체적으로 명시하고, 각각의 해결책 제시)\n\n"
                    f"## 최종 결정 및 근거\n"
                    f"(토론을 종합한 최종 방향. 왜 이 결론인지 논거 포함)\n\n"
                    f"## 팀별 실행 과제\n"
                    f"(각 팀이 당장 해야 할 구체적 액션 아이템. 담당팀·기한 포함)\n\n"
                    f"## 리스크 및 모니터링 포인트\n"
                    f"(실행 과정에서 반드시 체크해야 할 위험 요소와 지표)"
                )
            }]
        )
        return resp.content[0].text.strip()
