# 인증 문서 작성 플랫폼 — 설계 스펙

**날짜:** 2026-06-26  
**범위:** IVDR 전용 앱 → IVDR + ISO 13485 듀얼 인증 문서 작성 플랫폼  
**방안:** A — 듀얼 여정 + 공유 문서 레이어

---

## 1. 목표

- IVDR·ISO 13485 두 인증을 **동등한 비중**으로 지원
- 공통 문서(49개+) 한 번 작성 → 양쪽 인증에 반영
- 인증별 진행률 추적 (localStorage 기반)
- 기존 IVDR 콘텐츠 100% 유지

---

## 2. 라우팅 구조

```
/                      CertHub          — 인증 선택 허브 (신규)
/ivdr                  IVDRJourneyMap   — 기존 JourneyMap 이전
/ivdr/station/:id      IVDRJourneyMap   — 정거장 딥링크
/iso13485              ISO13485Map      — 신규 ISO 13485 여정
/iso13485/station/:id  ISO13485Map      — 정거장 딥링크
/documents             DocumentTree     — 공유 (인증 컨텍스트 표시)
/doc/:id               DocumentWorkspace— 공유 (양쪽 조항 표시)
/wiki                  WikiIndex        — 공유, 변경 없음
/wiki/:slug            ConceptPage      — 공유, 변경 없음
```

---

## 3. CertHub 화면 (`/`)

- 두 인증 카드: IVDR(EU) · ISO 13485
- 각 카드에 진행률 링 + "N/M 문서 완료"
- 공통 문서 49개 강조 ("한 번 작성 → 양쪽 반영")
- 기존 CertStructure·SchemeOverlap은 IVDR 여정 내(/ivdr)로 이동

---

## 4. ISO 13485 여정 구조

### 4페이즈 10정거장

| 페이즈 | # | 정거장 제목 | ISO 13485 조항 |
|---|---|---|---|
| P1 QMS 기반 | 1 | QMS 문서화 체계 | Clause 4 |
| P1 QMS 기반 | 2 | 경영 책임 | Clause 5 |
| P2 자원 관리 | 3 | 인적 자원·역량 | Clause 6.2 |
| P2 자원 관리 | 4 | 인프라·작업 환경 | Clause 6.3–6.4 |
| P3 제품 실현 | 5 | 설계·개발 관리 | Clause 7.3 |
| P3 제품 실현 | 6 | 구매·공급자 관리 | Clause 7.4 |
| P3 제품 실현 | 7 | 생산·서비스 제공 | Clause 7.5 |
| P3 제품 실현 | 8 | 측정기기 관리 | Clause 7.6 |
| P4 측정·개선 | 9 | 모니터링·내부심사 | Clause 8.1–8.2 |
| P4 측정·개선 | 10 | 개선 활동 | Clause 8.3–8.5 |

### ISO 13485 전용 신규 문서 (~20개, 기존 공통 문서 ~35개 재사용)

| 그룹 | 대표 문서 | 조항 |
|---|---|---|
| 경영 | 품질방침·목표, 조직 R&R | 5.3–5.5 |
| 고객 | 고객 요구사항 검토, 고객 만족 | 7.2, 8.2.1 |
| 구매 | 승인공급자 목록, 구매 검사 기록 | 7.4 |
| 생산 | 고객 자산 관리, 식별·추적성 기록 | 7.5.3–7.5.4 |
| 서비스 | 서비스 기록 (해당 시) | 7.5.1 |

---

## 5. 공유 문서 처리

- `schemes.ts`에 `iso13485DocIds`, `isISO13485Doc(id)` 추가
- `/doc/:id` 상단에 인증 배지 표시:
  - 공통: `IVDR [조항]` + `ISO 13485 [조항]` 배지 나란히
  - IVDR 전용: IVDR 배지만
  - ISO 13485 전용: ISO 13485 배지만
- 공통 문서는 어느 여정에서 열어도 동일 페이지 (`/doc/:id`)

---

## 6. 진행률 추적

```ts
// localStorage 구조
{
  "cert-progress-ivdr":      { [docId]: 'not_started' | 'in_progress' | 'done' },
  "cert-progress-iso13485":  { [docId]: 'not_started' | 'in_progress' | 'done' }
}
```

- `useProgress(certId)` 커스텀 훅: 상태 읽기·쓰기
- DocumentWorkspace 에 "상태 변경" 버튼 (미작성 → 작성 중 → 완료)
- CertHub·각 여정 헤더에 진행률 표시

---

## 7. 컴포넌트 재사용 전략

| 컴포넌트 | 처리 방식 |
|---|---|
| `JourneyMap` | `certId` prop 추가 → IVDR/ISO13485 모두 처리 |
| `PhaseBand`, `StationCard`, `StationDetail` | 그대로 재사용 |
| `CertStructure`, `SchemeOverlap` | `/ivdr` 내부로 이동 |
| `DocumentTree`, `DocumentWorkspace` | 인증 배지 표시 추가 |
| `CertHub` | 신규 생성 |

---

## 8. 데이터 파일 구조

```
src/data/
  stations.ts          → 기존 IVDR 유지
  docTree.ts           → 기존 IVDR 유지
  documents.ts         → 기존 IVDR 유지
  schemes.ts           → iso13485DocIds 추가
  progress.ts          → 신규: 진행률 훅·유틸
  iso13485/
    stations.ts        → ISO 13485 4페이즈·10정거장
    docTree.ts         → ISO 13485 문서 트리
    documents.ts       → ISO 13485 상세 템플릿
```

---

## 9. 범위 외 (이번 구현에서 제외)

- MDSAP·FDA 인증 추가 (방안 B 리팩터링 시 추가)
- 서버 기반 진행률 동기화
- 사용자 계정·로그인
- 문서 공동 편집

---

## 10. 구현 순서 (우선순위)

1. 라우팅 재구성 + CertHub
2. ISO 13485 데이터 (stations·docTree·documents)
3. 진행률 추적 (useProgress 훅 + UI)
4. 공유 문서 이중 조항 표시
5. 기존 IVDR 페이지 /ivdr로 이전
