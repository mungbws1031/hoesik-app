---
name: project-ivdr-wiki
description: IVDR 여정 위키 React 앱의 위치와 GitHub 퍼블리시(subtree) 워크플로
metadata: 
  node_type: memory
  type: project
  originSessionId: b66f3bfa-b61e-498f-bde8-24d91384e4ac
---

**IVDR 여정 위키** — React + Vite + TS + Tailwind v4 앱. 처음 보는 사람이 글을 안 읽어도 IVDR 인증의 전체 여정·현재 위치·다음 할 일을 한눈에 파악하게 하는 가이드. `ivdr-wiki-spec.md` + `tokens.css` 기반.

- **소스 위치**: 부모 `.claude` 워크트리 repo 안의 `ivdr-wiki/` 서브폴더 (이 서브폴더에는 자체 remote가 없음).
- **GitHub(공개)**: https://github.com/mungbws1031/ivdr-wiki — 계정 `mungbws1031` (gh CLI는 `C:\Program Files\GitHub CLI\gh.exe`에 설치·인증됨, PATH엔 없을 수 있어 풀패스 사용).
- **퍼블리시 방식**: 부모 repo에서 `git subtree split --prefix=ivdr-wiki -b ivdr-wiki-export` 로 ivdr-wiki만 추출해 그 브랜치를 `…/ivdr-wiki.git ivdr-wiki-export:main` 으로 push. 업데이트 시 부모에 커밋 → 재split → push(보통 fast-forward).
- **주요 화면**: `/`(JourneyMap 랜딩 — SVG 노선도 히어로, 정거장 클릭 시 해당 단계 문서 리스트 drawer), `/wiki`·`/wiki/:slug`(개념 위키), `/documents`(문서 트리 — 목록/구조 마인드맵/작성 순서 3탭, ~75문서·10그룹), `/doc/:id`(문서 작성 — 취지·사전 지식·준비물·난이도·중요도·템플릿·워드(.docx) 내보내기). 콘텐츠 단일 출처는 `src/data/`(stations·concepts·documents·docTree). 문서 메타(취지·지식·난이도·중요도·작성순서)는 docTree.ts의 id-keyed 맵으로 관리.
- 로컬 미리보기: 사용자용 dev 서버는 5180 포트(`npm run dev -- --host --port 5180`). preview MCP 서버는 5173(내부 전용).
