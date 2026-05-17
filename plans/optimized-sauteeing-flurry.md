# 브레인스토밍 실행 플랜

## Context

`inference_bot/src/inference_engine.py`가 Gemini 무료 티어 API를 사용 중인데, 할당량이 소진되어 429 에러 발생. 사용자는 유료 요금을 내고 있지만 현재 Gemini 키가 free tier에 연결되어 있음. `config/credentials.yaml`에 Claude API 키가 이미 있으므로, LLM 백엔드를 **Gemini → Claude (Anthropic)** 로 전환한다.

---

## 변경 대상: 1개 파일

**`inference_bot/src/inference_engine.py`** — `__init__()` 과 `_run_llm()` 만 변경. 프롬프트 빌더와 포맷터는 그대로 유지.

---

## 변경 내용

### 1. import 변경

```python
# 제거
import google.generativeai as genai

# 추가
import anthropic
```

### 2. `__init__()` 변경

```python
def __init__(self):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    cred_path = os.path.join(base_dir, "config", "credentials.yaml")

    with open(cred_path, "r", encoding="utf-8") as f:
        cred = yaml.safe_load(f)

    self.client = anthropic.Anthropic(api_key=cred["claude"]["api_key"])
    self.model_name = cred["claude"].get("model", "claude-sonnet-4-20250514")
```

### 3. `_run_llm()` 변경

```python
def _run_llm(self, prompt: str) -> str:
    try:
        resp = self.client.messages.create(
            model=self.model_name,
            max_tokens=4096,
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.content[0].text.strip()
    except Exception as e:
        print(f"Claude 호출 오류: {e}")
        return f"분석 실패: {e}"
```

### 4. `extract_search_queries()` 변경

Gemini `generate_content` → Claude `messages.create` 로 동일하게 교체.

```python
def extract_search_queries(self, claim: str) -> list[str]:
    prompt = f"""다음 주장을 교차검증하기 위해 검색해야 할 키워드를 3개 생성하세요.
각 키워드는 서로 다른 각도에서 검증할 수 있어야 합니다.
(1) 핵심 사실 확인용 (2) 반대 의견/논란 확인용 (3) 배경/맥락 확인용

주장: {claim}

JSON 배열로만 답변하세요. 예: ["키워드1", "키워드2", "키워드3"]"""
    try:
        resp = self.client.messages.create(
            model=self.model_name,
            max_tokens=256,
            temperature=0.2,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        return json.loads(text)
    except Exception as e:
        print(f"키워드 추출 오류: {e}")
        return [claim]
```

### 5. credentials.yaml 모델명 업데이트 (선택)

현재 `claude-3-5-sonnet-20240620` → 최신 `claude-sonnet-4-20250514`로 업데이트 권장.

---

## 테스트 영향

- 프롬프트 빌더 테스트 (`test_build_step1~4_prompt`, `test_format_report_4steps`): **변경 없음** (프롬프트 내용 동일)
- `test_extract_search_queries`: Mock 대상이 `engine.model` → `engine.client` 로 바뀌므로 Mock 수정 필요

```python
def test_extract_search_queries():
    engine = InferenceEngine.__new__(InferenceEngine)
    engine.client = MagicMock()
    engine.model_name = "claude-sonnet-4-20250514"
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text='["삼천당제약 S-PASS 특허", "삼천당제약 계약 공시 논란", "경구 GLP-1 제네릭 기술"]')]
    engine.client.messages.create.return_value = mock_resp
    queries = engine.extract_search_queries("삼천당제약이 S-PASS 기술로 5.3조 계약을 체결했다")
    assert len(queries) == 3
    assert any("삼천당" in q for q in queries)
```

---

## Verification

1. `python -m pytest inference_bot/tests/test_inference.py -v` → 9개 전체 PASS
2. `python -m inference_bot.main "삼천당제약 S-PASS 기술이 원천기술이라는 주장"` → Claude API로 4단계 리포트 출력
3. `anthropic` 패키지는 이미 `requirements.txt`에 포함되어 있음
