"""
에이전트 정의: Employee (직원), Team (팀)
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

# 동시에 API를 호출할 수 있는 최대 팀 수 (Rate limit 방어)
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
            # 지수 백오프: 15, 30, 60, 120, 240초 + 랜덤 지터
            wait = (2 ** attempt) * 15 + random.uniform(0, 5)
            print(f"\n  ⏳ Rate limit 초과 — {wait:.0f}초 후 재시도 ({attempt+1}/{max_retries})...")
            await asyncio.sleep(wait)
        except anthropic.APIStatusError as e:
            if e.status_code == 529:  # 과부하
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
class Employee:
    name: str
    team: str
    role: str
    persona: str

    @property
    def system_prompt(self) -> str:
        return (
            f"당신은 {self.team}의 {self.name}({self.role})입니다.\n"
            f"성격/전문성: {self.persona}\n\n"
            f"토론 참여 규칙:\n"
            f"- 반드시 {self.team} 관점과 당신의 전문성에서 출발하세요.\n"
            f"- 단순한 찬반이 아닌 구체적 근거·수치·사례를 들어 주장하세요.\n"
            f"- 이전 발언자의 의견 중 동의/반박할 포인트를 직접 언급하세요.\n"
            f"- 문제점을 지적할 땐 반드시 대안도 함께 제시하세요.\n"
            f"- 자신의 직책과 경험에서 나오는 고유한 시각을 드러내세요.\n"
            f"- 300자 내외로 충실하게 작성하세요."
        )

    async def speak(self, topic: str, context: str) -> str:
        """직원 발언 생성 (Rate limit 재시도 포함)"""
        async def _call():
            return await client.messages.create(
                model=MODEL_EMPLOYEE,
                max_tokens=MAX_TOKENS_EMP,
                system=self.system_prompt,
                messages=[{
                    "role": "user",
                    "content": (
                        f"토론 주제: {topic}\n\n"
                        f"이전 발언:\n{context}\n\n"
                        f"위 맥락을 바탕으로 {self.role}로서 구체적인 의견을 발언하세요.\n"
                        f"단순 동의나 반복은 금지. 새로운 관점·근거·대안을 반드시 추가하세요:"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()


# ──────────────────────────────────────────
# 팀 클래스
# ──────────────────────────────────────────

class Team:
    def __init__(self, name: str, members: List[Employee]):
        self.name = name
        self.members = members
        self.lead = members[0]          # 첫 번째 직원이 팀장
        self.official_position: str = ""

    def _print(self, msg: str):
        color = TEAM_COLORS.get(self.name, "")
        print(f"{color}{msg}{RESET_COLOR}")

    async def run_internal_discussion(self, topic: str):
        """
        팀 내부 토론 → (팀 공식 입장, 로그 라인 리스트) 반환
        """
        self._print(f"\n  ┌─ {self.name} 내부 토론 시작 ─┐")
        history: List[dict] = []
        log_lines: List[str] = []
        speakers = self.members[:INTERNAL_SPEAKERS]

        log_lines.append(f"\n#### {self.name} 내부 토론\n")

        for round_num in range(1, INTERNAL_ROUNDS + 1):
            self._print(f"  │  [{round_num}라운드]")
            log_lines.append(f"\n**[{round_num}라운드]**\n")
            for emp in speakers:
                ctx = "\n".join(
                    f"{m['name']}: {m['content']}" for m in history[-6:]
                )
                opinion = await emp.speak(topic, ctx)
                history.append({"name": emp.name, "content": opinion})
                self._print(f"  │  {emp.name}({emp.role}): {opinion}")
                log_lines.append(f"- **{emp.name}({emp.role})**: {opinion}\n")

        # 팀장이 내부 토론 요약 → 공식 입장
        position = await self._summarize(topic, history)
        self._print(f"  └─ 공식 입장: {position}")
        log_lines.append(f"\n**공식 입장:**\n{position}\n")
        self.official_position = position
        return position, log_lines

    async def respond_to_cross_debate(
        self, topic: str, all_positions: dict, cross_history: List[Message]
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
                    f"페르소나: {self.lead.persona}\n\n"
                    f"크로스 토론 규칙:\n"
                    f"- 다른 팀의 발언 중 구체적으로 동의하거나 반박할 내용을 인용하세요.\n"
                    f"- 우리 팀만이 줄 수 있는 전문적 가치를 명확히 주장하세요.\n"
                    f"- 팀 간 갈등 지점은 회피하지 말고 정면으로 논리적으로 해결하세요.\n"
                    f"- 협업 가능한 접점을 구체적 방법론과 함께 제안하세요.\n"
                    f"- 500자 내외로 깊이 있게 발언하세요."
                ),
                messages=[{
                    "role": "user",
                    "content": (
                        f"토론 주제: {topic}\n\n"
                        f"우리 팀({self.name}) 공식 입장:\n{self.official_position}\n\n"
                        f"다른 팀 입장 전체:\n{other_positions}\n\n"
                        f"최근 크로스 토론 흐름:\n{recent_cross}\n\n"
                        f"위 내용을 충분히 검토한 뒤 {self.name} 대표로 발언하세요.\n"
                        f"반드시 다른 팀 발언을 직접 언급하며 토론을 심화시키세요:"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()

    async def _summarize(self, topic: str, history: List[dict]) -> str:
        """내부 토론 요약 → 팀 공식 입장 (Rate limit 재시도 포함)"""
        opinions = "\n".join(f"{m['name']}: {m['content']}" for m in history)

        async def _call():
            return await client.messages.create(
                model=MODEL_TEAM_LEAD,
                max_tokens=MAX_TOKENS_LEAD,
                messages=[{
                    "role": "user",
                    "content": (
                        f"다음은 {self.name}의 '{topic}'에 대한 내부 토론 전문입니다:\n\n"
                        f"{opinions}\n\n"
                        f"위 토론을 바탕으로 {self.name}의 공식 입장을 아래 형식으로 작성하세요:\n\n"
                        f"【핵심 주장】\n- (팀의 가장 중요한 주장 2~3가지, 구체적 근거 포함)\n\n"
                        f"【우려사항】\n- (반드시 해결해야 할 리스크나 전제조건)\n\n"
                        f"【제안사항】\n- (다른 팀에 요청하거나 제안할 구체적 내용)\n\n"
                        f"【수용 불가 조건】\n- (이것만큼은 양보할 수 없는 선)"
                    )
                }]
            )
        resp = await _call_with_retry(_call)
        return resp.content[0].text.strip()
