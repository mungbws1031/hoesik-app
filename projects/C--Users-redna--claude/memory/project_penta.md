---
name: project-penta
description: "PENTA 5중 셀프 프로파일러 앱 — 위치(penta/), GitHub repo, subtree push 방식"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8579d8ee-f73c-4532-b7bf-8c22582e1631
---

PENTA = 사주·MBTI·혈액형·별자리·타로 5중 셀프 프로파일러 (재미용). 일치도(consensus) 엔진 + 갭 분석이 핵심 차별점.

- **코드 위치:** `penta/` (vite+vitest 단일 페이지, lunar-javascript 만세력 내장, 순수 ES 모듈 엔진)
- **GitHub:** `mungbws1031/penta` (Public). penta/ 하위만 `git subtree split --prefix=penta` → 전용 repo main에 push (IVDR와 동일 패턴 [[project-ivdr-wiki]])
- **설계 문서:** `docs/superpowers/specs/2026-06-24-penta-consensus-mapping-design.md`, 계획 `docs/superpowers/plans/2026-06-24-penta-app.md`
- **구현 범위:** 프로파일(5축 레이더+강점+갭) · 궁합(2인) · 타로(메이저22 3장) · 공유 카드 PNG. 탭 네비.
- **미구현(후속 후보):** "오늘의 나" 데일리. 사주 십성 정밀도는 통설 수준(유파별 정밀도 v2).
- 테스트 59개. dev: `cd penta && npm run dev`.
