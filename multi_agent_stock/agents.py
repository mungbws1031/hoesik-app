"""
에이전트 정의: Analyst (애널리스트), AnalystTeam (팀)
주식 분석 특화 프롬프트 포함
"""

import asyncio
import random
from dataclasses import dataclass
from typing import List
import anthropic

from config import (
    ANTHROPIC_API_KEY,
    MODEL_EMPLOYEE, MODEL_TEAM_LEAD,
    MAX_TOKENS_EMP, MAX_TOKENS_LEAD,
    INTERNAL_SPEAKERS, INTERNAL_ROUNDS,
    TEAM_COLORS, RESET_COLOR, BOLD,
)

client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

# 동시 API 호출 최대 수 (Rate limit 방어)
_API_SEMAPHORE = asyncio.Semaphore(3)


# ──────────────────────────────────────────
# Rate limit 재시도 래퍼
# ──────────────────────────────────────────

async def _call_with_retry(coro_fn, max_retries: int = 6):
    """
    429 Rate Limit 에러 발생 시 지수 백오프로 자동 재시도.
    다른 에러는 즉시 raise.
    """
    for attempt in range(max_retries):
        try:
            async with _API_SEMAPHORE:
                return await coro_fn()
        except anthropic.RateLimitError:
            if attempt == max_retries - 1:
                raise
            wait = (2 ** attempt) * 15 + random.uniform(0, 5)
            print(f"\n  ⏳ Rate limit 초과 — {wait:.0f}초 후 재시도 ({attempt+1}/{max_retries})...")
            await asyncio.sleep(wait)
        except anthropic.APIStatusError as e:
            if e.status_code == 529:
                wait = 30 + random.uniform(0, 10)
                print(f"\n  ⏳ 서버 과부하 — {wait:.0f}초 후 재시도...")
                await asyncio.sleep(wait)
            else:
                raise


# ──────────────────────────────────────────
# 데이터 클래스
# ──────────────────────────────────────────

@dataclass
class Message:
    sender: str
    team: str
    content: str

    def __str__(self):
        color = TEAM_COLORS.get(self.team, "")
        return f"{color}[{self.team}] {self.sender}{RESET_COLOR}: {self.content}"


@dataclass
class Analyst:
    name: str
    team: str
    role: str
    persona: str

    @property
    def system_prompt(self) -> str:
        return (
            f"당신은 {self.team}의 {self.name}({self.role})입니다.\n"
            f"투자 철학/전문성: {self.persona}\n\n"
            f"분석 참여 규칙:\n"
            f"- 반드시 {self.team}의 관점과 당신 고유의 투자 철학에서 출발하세요.\n"
            f"- 단순 의견이 아닌 구체적 지표·수치·사례를 근거로 주장하세요.\n"
            f"- 이전 발언자의 분석 중 동의 또는 반박할 포인트를 직접 언급하세요.\n"
            f"- 문제점을 지적할 때는 반드시 대안적 시각도 함께 제시하세요.\n"
            f"- 국내·해외 주식 모두 동일한 기준으로 분석하되, 국내 주식은 KRX 상장 기업 특성을 반영하세요.\n"
            f"- 300자 내외로 핵심만 날카롭게 작성하세요."
        )

    async def speak(self, stock_info: str, context: str) -> str:
        """애널리스트 발언 생성 (Rate limit 재시도 포함)"""
        async def _call():
            return await client.messages.create(
                model=MODEL_EMPLOYEE,
                max_tokens=MAX_TOKENS_EMP,
                system=self.system_prompt,
                messages=[{
                    "role": "user",
                    "content": (
                        f"분석 대상: {stock_info}\n\n"
                        f"이전 발언:\n{context}\n\n"
                        f"위 맥락을 바탕으로 {self.role}로서 구체적인 분석 의견을 발언하세요.\n"
                        f"단순 동의나 반복은 금지. 새로운 관점·지표·근거를 반드시 추가하세요:"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()


# ──────────────────────────────────────────
# 팀 클래스
# ──────────────────────────────────────────

class AnalystTeam:
    def __init__(self, name: str, members: List[Analyst]):
        self.name = name
        self.members = members
        self.lead = members[0]          # 첫 번째 멤버가 팀장
        self.official_position: str = ""

    def _print(self, msg: str):
        color = TEAM_COLORS.get(self.name, "")
        print(f"{color}{msg}{RESET_COLOR}")

    async def run_internal_discussion(self, stock_info: str):
        """
        팀 내부 분석 토론 → (팀 공식 투자의견, 로그 라인 리스트) 반환
        """
        self._print(f"\n  ┌─ {self.name} 내부 분석 시작 ─┐")
        history: List[dict] = []
        log_lines: List[str] = []
        speakers = self.members[:INTERNAL_SPEAKERS]

        log_lines.append(f"\n#### {self.name} 내부 분석\n")

        for round_num in range(1, INTERNAL_ROUNDS + 1):
            self._print(f"  │  [{round_num}라운드]")
            log_lines.append(f"\n**[{round_num}라운드]**\n")
            for analyst in speakers:
                ctx = "\n".join(
                    f"{m['name']}: {m['content']}" for m in history[-6:]
                )
                opinion = await analyst.speak(stock_info, ctx)
                history.append({"name": analyst.name, "content": opinion})
                self._print(f"  │  {analyst.name}({analyst.role}): {opinion}")
                log_lines.append(f"- **{analyst.name}({analyst.role})**: {opinion}\n")

        # 팀장이 내부 토론 요약 → 공식 투자의견
        position = await self._summarize(stock_info, history)
        self._print(f"  └─ 공식 투자의견: {position}")
        log_lines.append(f"\n**공식 투자의견:**\n{position}\n")
        self.official_position = position
        return position, log_lines

    async def respond_to_cross_debate(
        self, stock_info: str, all_positions: dict, cross_history: List[Message]
    ) -> str:
        """팀 간 토론에서 팀장이 발언 (Rate limit 재시도 포함)"""
        other_positions = "\n".join(
            f"- {t}: {p}" for t, p in all_positions.items() if t != self.name
        )
        recent_cross = "\n".join(str(m) for m in cross_history[-8:])

        async def _call():
            return await client.messages.create(
                model=MODEL_TEAM_LEAD,
                max_tokens=MAX_TOKENS_LEAD,
                system=(
                    f"당신은 {self.name}을 대표하는 {self.lead.name}({self.lead.role})입니다.\n"
                    f"투자 철학: {self.lead.persona}\n\n"
                    f"크로스 토론 규칙:\n"
                    f"- 다른 팀의 분석 중 구체적으로 동의하거나 반박할 내용을 직접 인용하세요.\n"
                    f"- {self.name}만이 제시할 수 있는 독자적 분석 관점을 명확히 주장하세요.\n"
                    f"- 팀 간 견해 차이는 회피하지 말고 정면으로 논리적으로 해결하세요.\n"
                    f"- 다른 팀과 공유할 수 있는 합의점을 구체적 근거와 함께 제안하세요.\n"
                    f"- 500자 내외로 깊이 있게 발언하세요."
                ),
                messages=[{
                    "role": "user",
                    "content": (
                        f"분석 대상: {stock_info}\n\n"
                        f"우리 팀({self.name}) 공식 투자의견:\n{self.official_position}\n\n"
                        f"다른 팀 투자의견 전체:\n{other_positions}\n\n"
                        f"최근 크로스 토론 흐름:\n{recent_cross}\n\n"
                        f"위 내용을 충분히 검토한 뒤 {self.name} 대표로 발언하세요.\n"
                        f"반드시 다른 팀 발언을 직접 언급하며 토론을 심화시키세요:"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()

    async def _summarize(self, stock_info: str, history: List[dict]) -> str:
        """내부 분석 요약 → 팀 공식 투자의견 (Rate limit 재시도 포함)"""
        opinions = "\n".join(f"{m['name']}: {m['content']}" for m in history)

        async def _call():
            return await client.messages.create(
                model=MODEL_TEAM_LEAD,
                max_tokens=MAX_TOKENS_LEAD,
                messages=[{
                    "role": "user",
                    "content": (
                        f"다음은 {self.name}의 '{stock_info}'에 대한 내부 분석 토론 전문입니다:\n\n"
                        f"{opinions}\n\n"
                        f"위 토론을 바탕으로 {self.name}의 공식 투자의견을 아래 형식으로 작성하세요:\n\n"
                        f"【투자의견】\n- 매수 / 중립 / 매도 중 하나와 확신 강도(높음·보통·낮음)\n\n"
                        f"【핵심 근거】\n- (팀 관점의 가장 중요한 분석 포인트 2~3가지, 구체적 수치·지표 포함)\n\n"
                        f"【목표가 / 적정가】\n- (가능하면 구체적 수치, 불가능하면 현재 대비 상하단 %)\n\n"
                        f"【주요 리스크】\n- (반드시 점검해야 할 위험 요소)\n\n"
                        f"【매매 전략】\n- (진입 타이밍, 분할 매수/매도 전략, 손절 기준)"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()
