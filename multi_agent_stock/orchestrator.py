"""
오케스트레이터: 팀 생성, 분석 토론 진행, 최종 투자의견 도출
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
    ANALYST_DATA,
    TEAM_COLORS, RESET_COLOR, BOLD,
)
from agents import Analyst, AnalystTeam, Message

client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


class StockAnalysisOrchestrator:
    """
    선택된 팀들로 주식 분석 토론을 진행하는 오케스트레이터.

    흐름:
      1. 팀별 내부 분석 (순차 실행)
      2. 팀 간 크로스 토론 (순차 라운드)
      3. 오케스트레이터가 최종 투자의견 도출
    """

    def __init__(self, selected_teams: list = None):
        self.selected_teams = selected_teams  # None이면 전체
        self.teams: Dict[str, AnalystTeam] = self._build_teams()
        self.cross_history: List[Message] = []
        self.full_log: List[str] = []

    # ──────────────────────────────────────
    # 팀 생성
    # ──────────────────────────────────────

    def _build_teams(self) -> Dict[str, AnalystTeam]:
        teams = {}
        total = 0
        for team_name, analyst_list in ANALYST_DATA.items():
            if self.selected_teams and team_name not in self.selected_teams:
                continue
            members = [
                Analyst(name=name, team=team_name, role=role, persona=persona)
                for name, role, persona in analyst_list
            ]
            teams[team_name] = AnalystTeam(team_name, members)
            total += len(members)
        team_names = " · ".join(teams.keys())
        print(f"{BOLD}✓ {total}명 로딩 완료 → 참여 팀: {team_names}{RESET_COLOR}")
        return teams

    # ──────────────────────────────────────
    # 로그 헬퍼
    # ──────────────────────────────────────

    def _log(self, text: str):
        print(text)
        self.full_log.append(text)

    def _log_divider(self, title: str = "", width: int = 60):
        if title:
            line = f"\n{'─'*(width//2)} {title} {'─'*(width//2)}"
        else:
            line = "─" * width
        print(line)
        self.full_log.append(line)

    # ──────────────────────────────────────
    # 공개 API
    # ──────────────────────────────────────

    async def run(self, stock_info: str) -> Tuple[str, str]:
        """전체 분석 파이프라인 실행. (최종의견, 전체로그) 반환"""
        start = time.time()
        self.cross_history = []
        self.full_log = []

        self._log_divider(f"분석 종목: {stock_info}", width=70)
        self.full_log.append("")

        # 1단계: 팀별 내부 분석
        self._log_divider("1단계 — 팀별 내부 분석 (순차 진행)")
        all_positions, internal_logs = await self._run_internal_discussions(stock_info)

        # 내부 분석 로그 저장
        self._log_divider("각 팀 내부 분석 전문")
        for team_name, log_lines in internal_logs.items():
            self._log(f"\n{'='*10} {team_name} 내부 분석 {'='*10}")
            for line in log_lines:
                self.full_log.append(line)

        # 각 팀 공식 투자의견 출력
        self._log_divider("각 팀 공식 투자의견")
        self.full_log.append("\n## 각 팀 공식 투자의견\n")
        for team_name, position in all_positions.items():
            color = TEAM_COLORS.get(team_name, "")
            print(f"\n{color}{BOLD}[{team_name}]{RESET_COLOR}")
            print(f"  {position}")
            self.full_log.append(f"\n### [{team_name}]\n{position}")

        # 2단계: 팀 간 크로스 토론
        self._log_divider(f"2단계 — 팀 간 크로스 토론 ({CROSS_ROUNDS}라운드)")
        await self._run_cross_debate(stock_info, all_positions)

        # 3단계: 최종 투자의견
        self._log_divider("3단계 — 최종 투자의견 도출 (오케스트레이터)")
        result = await self._synthesize(stock_info, all_positions)

        elapsed = time.time() - start
        self._log_divider(f"분석 완료 ({elapsed:.1f}초)", width=70)
        print(result)
        self.full_log.append("\n## 최종 투자의견\n")
        self.full_log.append(result)

        full_log_text = "\n".join(self.full_log)
        return result, full_log_text

    # ──────────────────────────────────────
    # 내부 구현
    # ──────────────────────────────────────

    async def _run_internal_discussions(self, stock_info: str) -> Tuple[Dict[str, str], Dict[str, List[str]]]:
        """모든 팀의 내부 분석을 순차 실행 (Rate limit 방어)"""
        all_positions = {}
        internal_logs = {}

        for team_name, team in self.teams.items():
            res = await team.run_internal_discussion(stock_info)
            if isinstance(res, tuple):
                all_positions[team_name] = res[0]
                internal_logs[team_name] = res[1] if len(res) > 1 else []
            else:
                all_positions[team_name] = res
                internal_logs[team_name] = []
            await asyncio.sleep(2)  # 팀 간 딜레이로 Rate limit 완충

        return all_positions, internal_logs

    async def _run_cross_debate(self, stock_info: str, all_positions: Dict[str, str]):
        """팀 간 크로스 토론: 각 팀장이 순서대로 발언"""
        self.full_log.append(f"\n## 팀 간 크로스 토론\n")

        for round_num in range(1, CROSS_ROUNDS + 1):
            self._log_divider(f"라운드 {round_num}")
            self.full_log.append(f"\n### 라운드 {round_num}\n")

            for team_name, team in self.teams.items():
                comment = await team.respond_to_cross_debate(
                    stock_info, all_positions, self.cross_history
                )
                msg = Message(
                    sender=team.lead.name,
                    team=team_name,
                    content=comment,
                )
                self.cross_history.append(msg)
                print(msg)
                self.full_log.append(str(msg))

            print()
            self.full_log.append("")

    async def _synthesize(self, stock_info: str, all_positions: Dict[str, str]) -> str:
        """오케스트레이터(최고 모델)가 전체 분석을 종합해 최종 투자의견 도출"""
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
                    f"다음은 '{stock_info}'에 대한 {len(self.teams)}개 팀({team_list})의\n"
                    f"전체 분석 토론 결과입니다. 최고 투자 의사결정자로서 최종 투자의견을 도출하세요.\n\n"
                    f"=== 각 팀 공식 투자의견 ===\n{positions_text}\n\n"
                    f"=== 팀 간 크로스 토론 전문 ===\n{cross_text}\n\n"
                    f"위 분석 전체를 면밀히 검토한 뒤 아래 형식으로 최종 투자의견을 작성하세요.\n"
                    f"단순 요약이 아닌, 실제로 투자 결정에 활용 가능한 깊이 있는 의견을 내세요.\n\n"
                    f"## 🎯 최종 투자의견\n"
                    f"(매수·중립·매도 중 하나 + 확신 강도 + 한 줄 요약)\n\n"
                    f"## 📊 핵심 투자 포인트\n"
                    f"(6개 팀 분석을 종합한 가장 중요한 투자 근거 3~5가지. 각 근거는 구체적 수치·지표 포함)\n\n"
                    f"## 💰 목표가 및 밸류에이션\n"
                    f"(복수의 밸류에이션 방법 결과를 종합한 목표가 범위. 현재가 대비 상승/하락 여력)\n\n"
                    f"## ⚠️ 주요 리스크 및 모니터링 포인트\n"
                    f"(팀 간 이견이 있었던 리스크 포함. 각 리스크별 발생 가능성과 영향도 평가)\n\n"
                    f"## 📅 매매 전략 및 타이밍\n"
                    f"(단기·중기·장기 투자자별 전략. 진입 조건, 목표가, 손절 기준, 비중 제안)\n\n"
                    f"## 🔍 팀별 핵심 이견 조율\n"
                    f"(가장 큰 의견 차이가 있었던 포인트와 최종 판단 근거. 소수의견도 명시)\n\n"
                    f"※ 본 분석은 투자 참고용이며, 최종 투자 결정은 본인 판단과 책임 하에 이루어져야 합니다."
                )
            }]
        )
        return resp.content[0].text.strip()
