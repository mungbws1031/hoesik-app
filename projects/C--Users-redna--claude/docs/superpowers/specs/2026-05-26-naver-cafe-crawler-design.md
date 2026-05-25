# 네이버 카페 크롤러 설계 문서

**날짜:** 2026-05-26  
**상태:** 확정

---

## 1. 개요

네이버 카페의 게시글(제목·본문·작성자·날짜·조회수·좋아요)과 댓글(대댓글 포함)을 자동으로 수집하는 데스크탑 GUI 툴.  
로그인이 필요한 회원 전용 카페도 지원하며, 수집 결과는 JSON 파일로 저장한다.

---

## 2. 기술 스택

| 역할 | 라이브러리 |
|------|-----------|
| 브라우저 자동화 (크롤링·로그인) | `selenium` + `chromedriver-autoinstall` |
| GUI | `customtkinter` |
| JSON 저장 | Python 내장 `json` |
| 환경 | Python 3.9+ / Windows |

---

## 3. 폴더 구조

```
naver_cafe_crawler/
├── main.py                  # 진입점: GUI 실행
├── config.py                # 상수 (딜레이, 타임아웃, User-Agent 등)
├── gui/
│   └── app.py               # CustomTkinter 메인 앱 (3탭 구조)
├── crawler/
│   ├── driver.py            # ChromeDriver 초기화·종료 관리
│   ├── login.py             # 네이버 로그인 (ID/PW 입력 → 세션 유지)
│   ├── post_crawler.py      # 게시판 목록 순회 + 본문 수집
│   └── comment_crawler.py   # 댓글·대댓글 수집
├── utils/
│   └── saver.py             # JSON 직렬화·파일 저장
├── output/                  # 수집 결과 저장 위치 (자동 생성)
└── requirements.txt
```

---

## 4. GUI 구성 (3탭)

### 탭 1 — 설정
- 네이버 ID / 비밀번호 입력 (비밀번호는 마스킹)
- 카페 URL 입력
- 게시판 이름 입력
- 수집 페이지 범위 (시작 페이지 ~ 끝 페이지)
- 체크박스: 댓글 포함 여부 / 대댓글 포함 여부
- **[크롤링 시작]** 버튼

### 탭 2 — 진행 현황
- 프로그레스 바 (게시글 단위)
- 실시간 로그 텍스트박스 (스크롤 가능)
  - ✅ 성공 / ⚠️ 경고(삭제글 스킵 등) / ❌ 에러 구분 표시
- **[중단]** 버튼

### 탭 3 — 결과 보기
- 저장된 파일 경로 표시
- 수집 통계 (게시글 수, 댓글 수)
- **[폴더 열기]** 버튼 (탐색기 오픈)

---

## 5. 데이터 흐름

```
사용자 입력 (설정 탭)
  → driver.py: ChromeDriver 초기화 (headless 옵션 선택 가능)
  → login.py: 네이버 로그인 → 세션 쿠키 드라이버에 유지
  → post_crawler.py: 게시판 페이지 순회 → 게시글 URL 목록 수집
  → 각 게시글 URL 방문:
      post_crawler.py: 제목·본문·작성자·날짜·조회수·좋아요 파싱
      comment_crawler.py: 댓글·대댓글 파싱 (페이지네이션 처리)
  → saver.py: 전체 데이터 JSON 직렬화 → output/ 저장
  → GUI: 진행 현황 탭 실시간 업데이트 (콜백 방식)
```

크롤러 모듈(`crawler/`)은 GUI 없이 Python 코드로도 직접 호출 가능하도록 설계한다.

---

## 6. JSON 출력 스키마

```json
{
  "meta": {
    "cafe_name": "강아지훈련사랑",
    "cafe_url": "https://cafe.naver.com/dogtraining",
    "board_name": "자유게시판",
    "crawled_at": "2026-05-26T14:30:00",
    "total_posts": 50,
    "total_comments": 342
  },
  "posts": [
    {
      "post_id": "12345",
      "title": "강아지 사료 추천해주세요",
      "author": "멍멍이맘",
      "date": "2026-05-20",
      "views": 123,
      "likes": 5,
      "content": "본문 내용 전체...",
      "url": "https://cafe.naver.com/dogtraining/12345",
      "comments": [
        {
          "comment_id": "c001",
          "author": "훈련사Kim",
          "date": "2026-05-20",
          "content": "로얄캐닌 추천드려요",
          "is_reply": false,
          "parent_comment_id": null
        },
        {
          "comment_id": "c002",
          "author": "멍멍이맘",
          "date": "2026-05-20",
          "content": "감사합니다!",
          "is_reply": true,
          "parent_comment_id": "c001"
        }
      ]
    }
  ]
}
```

파일명 형식: `{카페명}_{게시판명}_{YYYYMMDD_HHMMSS}.json`

---

## 7. 에러 처리 전략

| 상황 | 처리 방식 |
|------|----------|
| 로그인 실패 (잘못된 ID/PW) | 팝업 알림 후 중단 |
| 삭제된 게시글 | 로그에 ⚠️ 표시 후 스킵 |
| 네트워크 타임아웃 | 최대 3회 재시도 후 스킵 |
| 봇 감지 캡차 발생 | 로그에 ❌ 표시, 일시 중단 안내 |
| 크롤링 중 [중단] 버튼 클릭 | 현재까지 수집된 데이터 즉시 저장 후 종료 |

---

## 8. 봇 감지 최소화

- 요청 간 랜덤 딜레이: `1.5 ~ 3.5초`
- Chrome User-Agent 정상값 사용
- Selenium `undetected-chromedriver` 옵션 적용 (webdriver 플래그 제거)
- headless 모드는 기본 OFF (감지율 높음)

---

## 9. 의존성

```
selenium>=4.0
customtkinter>=5.0
webdriver-manager>=4.0
```

설치: `pip install -r requirements.txt`

---

## 10. 주의사항 (ToS)

네이버 이용약관은 자동화된 데이터 수집을 제한할 수 있다.  
이 툴은 **개인 연구·학습 목적**으로만 사용하며, 수집 속도를 낮게 유지하고 서버에 과부하를 주지 않도록 설계한다.
