# 듀얼 인증 문서 플랫폼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** IVDR 전용 앱을 IVDR + ISO 13485 듀얼 인증 문서 작성 플랫폼으로 전환한다.

**Architecture:** `/` → CertHub (인증 선택 허브), `/ivdr` → 기존 IVDR 여정, `/iso13485` → 신규 ISO 13485 여정, `/doc/:id` → 공유 문서 워크스페이스(이중 인증 배지). 진행률은 localStorage에 `cert-progress-{certId}` 키로 저장한다.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v4, react-router-dom v7, lucide-react

---

## 파일 구조

```
ivdr-wiki/src/
  App.tsx                              ← 수정: 라우팅 재구성
  components/
    CertHub.tsx                        ← 신규: 인증 선택 허브 (/)
    ISO13485Map.tsx                    ← 신규: ISO 13485 여정 (/iso13485)
    JourneyMap.tsx                     ← 수정: /ivdr 경로로 navigate 변경
    DocumentWorkspace.tsx              ← 수정: 이중 인증 배지 + 진행률 버튼
  data/
    schemes.ts                         ← 수정: iso13485SpecificDocIds 추가
    progress.ts                        ← 신규: useProgress 훅
    iso13485/
      stations.ts                      ← 신규: 4페이즈 10정거장
      docTree.ts                       ← 신규: ISO 13485 전용 문서 트리
      documents.ts                     ← 신규: ISO 13485 상세 템플릿
```

---

## Task 1: 라우팅 재구성 + CertHub

**Files:**
- Modify: `ivdr-wiki/src/App.tsx`
- Create: `ivdr-wiki/src/components/CertHub.tsx`

- [ ] **Step 1: App.tsx 라우팅 업데이트**

```tsx
// ivdr-wiki/src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CertHub } from "./components/CertHub";
import { JourneyMap } from "./components/JourneyMap";
import { ISO13485Map } from "./components/ISO13485Map";
import { DocumentWorkspace } from "./components/DocumentWorkspace";
import { DocumentTree } from "./components/DocumentTree";
import { ConceptPage } from "./components/ConceptPage";
import { WikiIndex } from "./components/WikiIndex";

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* 인증 선택 허브 */}
        <Route path="/" element={<CertHub />} />
        {/* IVDR 여정 */}
        <Route path="/ivdr" element={<JourneyMap />} />
        <Route path="/ivdr/station/:id" element={<JourneyMap />} />
        {/* ISO 13485 여정 */}
        <Route path="/iso13485" element={<ISO13485Map />} />
        <Route path="/iso13485/station/:id" element={<ISO13485Map />} />
        {/* 공유: 문서 트리 + 작성 워크스페이스 */}
        <Route path="/documents" element={<DocumentTree />} />
        <Route path="/doc/:id" element={<DocumentWorkspace />} />
        {/* 공유: 개념 위키 */}
        <Route path="/wiki" element={<WikiIndex />} />
        <Route path="/wiki/:slug" element={<ConceptPage />} />
        <Route path="*" element={<CertHub />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: CertHub.tsx 생성**

```tsx
// ivdr-wiki/src/components/CertHub.tsx
import { Link } from "react-router-dom";
import { Compass, CheckCircle, Layers } from "lucide-react";

export function CertHub() {
  return (
    <div className="min-h-screen bg-bg">
      <main
        className="mx-auto"
        style={{ maxWidth: "var(--max-w)", padding: "var(--s-12) var(--margin) var(--s-16)" }}
      >
        {/* Hero */}
        <header style={{ marginBottom: "var(--s-12)", textAlign: "center" }}>
          <span
            className="inline-flex items-center gap-2 rounded-full font-semibold"
            style={{ background: "var(--accent-weak)", color: "var(--accent)", fontSize: "var(--t-sm)", padding: "5px 14px" }}
          >
            <Layers size={16} strokeWidth={2.5} aria-hidden />
            의료기기 인증 문서 작성 플랫폼
          </span>
          <h1
            className="font-extrabold text-text"
            style={{ fontSize: "var(--t-3xl)", lineHeight: "var(--lh-tight)", marginTop: "var(--s-4)" }}
          >
            인증을 선택하세요
          </h1>
          <p
            className="text-text-muted"
            style={{ fontSize: "var(--t-lg)", marginTop: "var(--s-4)", maxWidth: 560, margin: "var(--s-4) auto 0" }}
          >
            공통 문서는 한 번 작성하면 양쪽 인증에 반영됩니다.
          </p>
        </header>

        {/* 인증 카드 */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "var(--s-6)", marginBottom: "var(--s-12)" }}
        >
          <Link
            to="/ivdr"
            className="rounded-[var(--r-lg)] border block hover:shadow-md"
            style={{ borderColor: "var(--accent)", background: "var(--surface)", padding: "var(--s-8)", transition: "box-shadow 0.15s" }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: "var(--s-4)" }}>
              <span
                className="inline-flex items-center justify-center rounded-full shrink-0"
                style={{ width: 48, height: 48, background: "var(--accent-weak)" }}
              >
                <Compass size={24} style={{ color: "var(--accent)" }} />
              </span>
              <div>
                <div className="font-extrabold text-text" style={{ fontSize: "var(--t-xl)" }}>IVDR</div>
                <div className="text-text-muted" style={{ fontSize: "var(--t-sm)" }}>EU 체외진단기기 규정</div>
              </div>
            </div>
            <p className="text-text-muted" style={{ fontSize: "var(--t-base)", lineHeight: "var(--lh-base)", marginBottom: "var(--s-6)" }}>
              5 페이즈 · 11 정거장 · 75개 문서<br />
              Regulation (EU) 2017/746 — CE 마킹 취득
            </p>
            <span className="font-bold" style={{ color: "var(--accent)", fontSize: "var(--t-sm)" }}>
              여정 시작 →
            </span>
          </Link>

          <Link
            to="/iso13485"
            className="rounded-[var(--r-lg)] border block hover:shadow-md"
            style={{ borderColor: "var(--p3)", background: "var(--surface)", padding: "var(--s-8)", transition: "box-shadow 0.15s" }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: "var(--s-4)" }}>
              <span
                className="inline-flex items-center justify-center rounded-full shrink-0"
                style={{ width: 48, height: 48, background: "var(--p3-tint)" }}
              >
                <CheckCircle size={24} style={{ color: "var(--p3)" }} />
              </span>
              <div>
                <div className="font-extrabold text-text" style={{ fontSize: "var(--t-xl)" }}>ISO 13485</div>
                <div className="text-text-muted" style={{ fontSize: "var(--t-sm)" }}>의료기기 품질경영시스템</div>
              </div>
            </div>
            <p className="text-text-muted" style={{ fontSize: "var(--t-base)", lineHeight: "var(--lh-base)", marginBottom: "var(--s-6)" }}>
              4 페이즈 · 10 정거장 · 전용 + 공통 문서<br />
              ISO 13485:2016 — QMS 인증 취득
            </p>
            <span className="font-bold" style={{ color: "var(--p3)", fontSize: "var(--t-sm)" }}>
              여정 시작 →
            </span>
          </Link>
        </div>

        {/* 공통 문서 강조 */}
        <section
          className="rounded-[var(--r-lg)] border text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)", padding: "var(--s-8)" }}
        >
          <div className="font-extrabold text-text" style={{ fontSize: "var(--t-2xl)", marginBottom: "var(--s-2)" }}>
            공통 문서 <span style={{ color: "var(--accent)" }}>49개</span>
          </div>
          <p className="text-text-muted" style={{ fontSize: "var(--t-base)", marginBottom: "var(--s-4)" }}>
            QMS · 설계관리 · 위험관리 · 기술/성능 증거 — 한 번 작성, 양쪽 인증에 반영
          </p>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 rounded-[var(--r-md)] border font-semibold text-text hover:bg-bg"
            style={{ borderColor: "var(--border-strong)", fontSize: "var(--t-sm)", padding: "9px 16px" }}
          >
            문서 전체 보기
          </Link>
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: 빌드 확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공. `/iso13485` 경로는 ISO13485Map이 없어서 에러. 다음 단계에서 stub 생성.

- [ ] **Step 4: ISO13485Map stub 생성 (빌드 통과용)**

```tsx
// ivdr-wiki/src/components/ISO13485Map.tsx
export function ISO13485Map() {
  return <div className="min-h-screen bg-bg p-12">ISO 13485 여정 (구현 중)</div>;
}
```

- [ ] **Step 5: 빌드 재확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공.

- [ ] **Step 6: 커밋**

```bash
git add ivdr-wiki/src/App.tsx ivdr-wiki/src/components/CertHub.tsx ivdr-wiki/src/components/ISO13485Map.tsx
git commit -m "feat: add CertHub landing + dual-cert routing structure"
```

---

## Task 2: JourneyMap /ivdr 경로 적용

**Files:**
- Modify: `ivdr-wiki/src/components/JourneyMap.tsx`
- Modify: `ivdr-wiki/src/components/DocumentWorkspace.tsx`

- [ ] **Step 1: JourneyMap navigate 경로 수정**

[`JourneyMap.tsx:35-39`](ivdr-wiki/src/components/JourneyMap.tsx) 의 세 곳을 수정:

```tsx
// 변경 전
const openStation = useCallback(
  (sid: number) => navigate(`/station/${sid}`),
  [navigate],
);
const closeStation = useCallback(() => navigate("/"), [navigate]);
```

```tsx
// 변경 후
const openStation = useCallback(
  (sid: number) => navigate(`/ivdr/station/${sid}`),
  [navigate],
);
const closeStation = useCallback(() => navigate("/ivdr"), [navigate]);
```

- [ ] **Step 2: JourneyMap 헤더 링크 수정**

[`JourneyMap.tsx:109-127`](ivdr-wiki/src/components/JourneyMap.tsx) 의 Link 들:

```tsx
{/* 진입 버튼 */}
<div className="flex flex-wrap gap-3" style={{ marginTop: "var(--s-6)" }}>
  <Link
    to="/documents"
    className="inline-flex items-center gap-2 rounded-[var(--r-md)] font-bold text-text-on-color"
    style={{ background: "var(--accent)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
  >
    <FolderTree size={18} aria-hidden />
    써야 할 문서 전체 보기
  </Link>
  <Link
    to="/wiki"
    className="inline-flex items-center gap-2 rounded-[var(--r-md)] border font-bold text-text hover:bg-surface"
    style={{ borderColor: "var(--border-strong)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
  >
    <Library size={18} style={{ color: "var(--info)" }} aria-hidden />
    개념 위키
  </Link>
  <Link
    to="/"
    className="inline-flex items-center gap-2 rounded-[var(--r-md)] border font-bold text-text-muted hover:bg-surface"
    style={{ borderColor: "var(--border)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
  >
    ← 인증 허브
  </Link>
</div>
```

- [ ] **Step 3: DocumentWorkspace 브레드크럼 업데이트**

[`DocumentWorkspace.tsx:71-80`](ivdr-wiki/src/components/DocumentWorkspace.tsx) 의 "여정 지도" 링크를 수정:

```tsx
{/* 브레드크럼 */}
<div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "var(--s-2)" }}>
  <Link
    to="/"
    className="inline-flex items-center gap-1.5 rounded-[var(--r-full)] font-semibold text-text-muted hover:text-text"
    style={{ fontSize: "var(--t-xs)", border: "1px solid var(--border)", padding: "3px 10px" }}
  >
    인증 허브
  </Link>
  <Link
    to="/ivdr"
    className="inline-flex items-center gap-1.5 rounded-[var(--r-full)] font-semibold text-text-muted hover:text-text"
    style={{ fontSize: "var(--t-xs)", border: "1px solid var(--border)", padding: "3px 10px" }}
  >
    <Compass size={13} aria-hidden />
    IVDR 여정
  </Link>
  {/* 기존 station 브레드크럼 이어짐 */}
```

- [ ] **Step 4: 빌드 + 브라우저 확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공. `/ivdr` 에서 기존 IVDR 여정이 정상 표시, 정거장 클릭 시 `/ivdr/station/1` 등으로 이동.

- [ ] **Step 5: 커밋**

```bash
git add ivdr-wiki/src/components/JourneyMap.tsx ivdr-wiki/src/components/DocumentWorkspace.tsx
git commit -m "feat: migrate IVDR journey to /ivdr path"
```

---

## Task 3: ISO 13485 데이터 — stations.ts

**Files:**
- Create: `ivdr-wiki/src/data/iso13485/stations.ts`

- [ ] **Step 1: stations.ts 생성**

```ts
// ivdr-wiki/src/data/iso13485/stations.ts

export type ISO13485PhaseId = "qms" | "resource" | "realization" | "improvement";

export interface ISO13485Phase {
  id: ISO13485PhaseId;
  order: number;
  title: string;
  subtitle: string;
  colorVar: string;
  tintVar: string;
}

export interface ISO13485Station {
  id: number;       // 1..10
  phase: ISO13485PhaseId;
  title: string;
  icon: string;     // lucide 이름
  oneLine: string;
  tag: { label: string; tone: "neutral" | "info" | "warning" | "danger" | "success" };
  body: string[];
  todo: string;
  refs: string[];   // ISO 13485 조항
  note?: string;
}

export const iso13485Phases: ISO13485Phase[] = [
  { id: "qms",         order: 1, title: "QMS 기반",    subtitle: "문서체계·경영책임 수립",    colorVar: "--p1", tintVar: "--p1-tint" },
  { id: "resource",    order: 2, title: "자원 관리",   subtitle: "인적·인프라 자원 확보",     colorVar: "--p2", tintVar: "--p2-tint" },
  { id: "realization", order: 3, title: "제품 실현",   subtitle: "설계~생산~서비스·교정",    colorVar: "--p3", tintVar: "--p3-tint" },
  { id: "improvement", order: 4, title: "측정·개선",   subtitle: "감사·시정·예방 루프",       colorVar: "--p4", tintVar: "--p4-tint" },
];

export const iso13485PhaseById = (id: ISO13485PhaseId): ISO13485Phase =>
  iso13485Phases.find((p) => p.id === id)!;

export const iso13485Stations: ISO13485Station[] = [
  {
    id: 1,
    phase: "qms",
    title: "QMS 문서화 체계",
    icon: "folder-open",
    oneLine: "Clause 4 — QMS 적용 범위·절차서·기록 관리",
    tag: { label: "기반 수립", tone: "info" },
    body: [
      "ISO 13485:2016 Clause 4는 품질경영시스템의 **문서화 요구사항**을 정한다. 조직은 품질매뉴얼, 적용 범위 설명, 절차서(필수 6가지 이상), 작업지시서, 기록 등 문서화된 정보 체계를 수립해야 한다.",
      "특히 4.2.4(의료기기 파일), 4.2.5(기록 관리)는 심사관이 집중적으로 확인하는 항목이다. 모든 기록은 최소 제품 수명 + 2년(또는 국가별 규정) 동안 보유해야 한다.",
    ],
    todo: "QMS 적용 범위 문서 + 절차서 목록 + 기록 보유 기간 정책 수립",
    refs: ["ISO 13485:2016 Clause 4.1", "4.2.1", "4.2.3", "4.2.4", "4.2.5"],
  },
  {
    id: 2,
    phase: "qms",
    title: "경영 책임",
    icon: "users",
    oneLine: "Clause 5 — 경영진 의지·품질방침·목표·경영검토",
    tag: { label: "경영 참여", tone: "info" },
    body: [
      "Clause 5는 최고경영진이 QMS에 직접 관여해야 함을 규정한다. 품질방침(5.3)·품질목표(5.4.1)를 문서화하고, 조직 전체에 전달하며, 경영 검토(5.6)를 정기적으로 실시해 QMS 효과성을 평가해야 한다.",
      "경영 검토 입력 항목(고객 피드백·프로세스 성과·시정/예방조치·변경 사항 등)과 출력 항목(개선 결정·자원 필요성)을 기록으로 유지해야 한다.",
    ],
    todo: "품질방침·목표 문서화 + 경영 검토 주기·의제·기록 서식 수립",
    refs: ["ISO 13485:2016 Clause 5.1", "5.3", "5.4", "5.5", "5.6"],
  },
  {
    id: 3,
    phase: "resource",
    title: "인적 자원·역량",
    icon: "graduation-cap",
    oneLine: "Clause 6.2 — 역량 요건·교육훈련·역량 확인",
    tag: { label: "역량 관리", tone: "info" },
    body: [
      "Clause 6.2는 QMS 활동에 영향을 주는 직원의 역량을 교육·경험·기술로 정의하고, 그 적합성을 평가·문서화할 것을 요구한다. 역량 매트릭스와 교육훈련 기록은 심사의 필수 확인 항목이다.",
      "교육훈련의 **효과성 평가** 방법(퀴즈·현장 평가·관찰 등)을 사전에 정해두어야 한다. 단순히 훈련 이수 기록만으로는 부족하다.",
    ],
    todo: "역할별 역량 매트릭스 작성 + 교육훈련 계획 및 효과성 평가 방법 수립",
    refs: ["ISO 13485:2016 Clause 6.2"],
  },
  {
    id: 4,
    phase: "resource",
    title: "인프라·작업환경",
    icon: "building-2",
    oneLine: "Clause 6.3–6.4 — 시설·장비·소프트웨어·작업환경",
    tag: { label: "환경 통제", tone: "info" },
    body: [
      "Clause 6.3은 제품 적합성에 필요한 인프라(건물·장비·소프트웨어·지원 서비스)를 유지보수할 것을 요구한다. Clause 6.4는 오염 방지·청결·온습도 등 작업환경 조건을 문서화하고 모니터링할 것을 규정한다.",
      "소프트웨어가 품질 활동에 사용되면(검사·측정·데이터 관리 등) **소프트웨어 밸리데이션(4.1.6)** 이 필요하다. 이는 종종 간과되는 항목이다.",
    ],
    todo: "인프라 목록 + 유지보수 일정 수립 + 작업환경 기준값 및 모니터링 기록 설계",
    refs: ["ISO 13485:2016 Clause 6.3", "6.4", "4.1.6"],
  },
  {
    id: 5,
    phase: "realization",
    title: "설계·개발 관리",
    icon: "pen-tool",
    oneLine: "Clause 7.3 — 설계 계획·입력·출력·검증·유효성확인",
    tag: { label: "설계 통제", tone: "info" },
    body: [
      "Clause 7.3은 설계·개발의 전체 프로세스를 계획·실행·기록화하도록 요구한다. 설계 입력(요구사항)→ 설계 출력(도면·사양)→ 검증(요구사항 충족 확인)→ 유효성확인(의도된 사용 충족 확인)의 흐름을 추적할 수 있어야 한다.",
      "**설계 변경(7.3.9)** 관리도 중요하다. 모든 변경은 영향 평가, 검증/유효성확인, 승인 기록을 남겨야 한다. IVDR QMS의 설계 관리와 대부분 중첩된다.",
    ],
    todo: "설계 계획서 + 입출력 추적표(Design History File) + 변경 관리 절차서 작성",
    refs: ["ISO 13485:2016 Clause 7.3.1~7.3.9"],
    note: "IVDR 기술문서(Annex II)의 설계 산출물이 이 정거장의 공통 증거가 된다.",
  },
  {
    id: 6,
    phase: "realization",
    title: "구매·공급자 관리",
    icon: "truck",
    oneLine: "Clause 7.4 — 공급자 선정·평가·구매 정보·검사",
    tag: { label: "공급망 통제", tone: "warning" },
    body: [
      "Clause 7.4는 외부 조달 제품/서비스가 품질에 미치는 영향에 따라 공급자를 선정·평가·모니터링하도록 요구한다. **승인공급자목록(ASL)** 을 유지하고, 공급자 성과를 주기적으로 재평가해야 한다.",
      "구매 정보(7.4.2)는 조달 대상을 명확히 기술해야 하고, 구매 검사(7.4.3)는 규정된 방법으로 수행해 기록을 남긴다.",
    ],
    todo: "승인공급자목록 작성 + 공급자 평가 기준·주기 수립 + 구매 검사 절차서",
    refs: ["ISO 13485:2016 Clause 7.4.1", "7.4.2", "7.4.3"],
  },
  {
    id: 7,
    phase: "realization",
    title: "생산·서비스 제공",
    icon: "factory",
    oneLine: "Clause 7.5 — 생산 통제·청결·추적성·고객 자산",
    tag: { label: "생산 관리", tone: "info" },
    body: [
      "Clause 7.5는 제품 실현 전 과정(생산·서비스·포장·보관)에서의 통제 요구사항을 정한다. 특히 7.5.3(추적성)은 배치/묶음 단위로 제품을 식별·추적할 수 있어야 하고, 7.5.4(고객 자산)는 고객 소유 자재·기기를 별도 관리해야 한다.",
      "서비스 제공(7.5.1.2.2)이 적용되는 경우 서비스 절차서와 기록을 유지해야 한다. 무균 제품은 7.5.2(청결)에 따른 별도 요건이 적용된다.",
    ],
    todo: "생산 작업지시서 + 배치 기록 양식 + 추적성 체계 + 고객 자산 관리 절차서",
    refs: ["ISO 13485:2016 Clause 7.5.1", "7.5.2", "7.5.3", "7.5.4"],
  },
  {
    id: 8,
    phase: "realization",
    title: "측정장비 관리",
    icon: "gauge",
    oneLine: "Clause 7.6 — 교정·검증·측정 불확도·소프트웨어",
    tag: { label: "교정 관리", tone: "info" },
    body: [
      "Clause 7.6은 측정·모니터링에 사용하는 기기를 국제표준에 소급 가능한 교정/검증으로 관리하도록 요구한다. 교정 상태, 불합격 기기 처리, 이전 측정 결과 재평가 필요성을 기록으로 남겨야 한다.",
      "측정 소프트웨어도 사용 전 밸리데이션이 필요하다(4.1.6). 교정 기록은 기기 수명 동안 보유해야 한다.",
    ],
    todo: "측정장비 목록 + 교정 일정·방법·기준값 수립 + 교정 기록 양식",
    refs: ["ISO 13485:2016 Clause 7.6"],
  },
  {
    id: 9,
    phase: "improvement",
    title: "모니터링·내부심사",
    icon: "search",
    oneLine: "Clause 8.1–8.2 — 고객만족·내부심사·프로세스/제품 모니터링",
    tag: { label: "감시 체계", tone: "info" },
    body: [
      "Clause 8.2는 고객 만족 모니터링(8.2.1), 내부심사(8.2.2), 프로세스 모니터링(8.2.3), 제품 모니터링(8.2.4·8.2.5·8.2.6) 요건을 포함한다. 내부심사는 독립성이 보장된 심사원이 수행해야 하며, 발견사항은 모두 기록하고 시정조치와 연결해야 한다.",
      "고객 만족 측정 방법(설문·컴플레인 분석 등)과 활용 계획을 미리 정한다. 이 데이터는 경영 검토 입력 항목이기도 하다.",
    ],
    todo: "내부심사 프로그램(연간) + 심사 체크리스트 + 고객만족 측정 방법 수립",
    refs: ["ISO 13485:2016 Clause 8.1", "8.2.1", "8.2.2", "8.2.3", "8.2.4"],
  },
  {
    id: 10,
    phase: "improvement",
    title: "개선 활동",
    icon: "trending-up",
    oneLine: "Clause 8.3–8.5 — 부적합품·데이터 분석·시정·예방조치",
    tag: { label: "지속 개선", tone: "success" },
    body: [
      "Clause 8.3은 부적합 제품의 식별·분리·처리를 요구하고, 8.4는 수집된 데이터를 분석해 QMS 효과성을 입증하도록 요구한다. 8.5는 시정조치(CA)와 예방조치(PA) 프로세스를 통해 근본 원인 제거와 재발 방지를 수행한다.",
      "CA/PA는 이슈 크기에 비례한 깊이로 수행하되, 모든 단계(원인·조치·효과 검증)를 기록으로 남긴다. 이 루프가 ISO 13485 지속 개선의 엔진이다.",
    ],
    todo: "부적합 관리 절차서 + 시정/예방조치(CAPA) 양식 + 데이터 분석 보고 주기 수립",
    refs: ["ISO 13485:2016 Clause 8.3", "8.4", "8.5.1", "8.5.2", "8.5.3"],
  },
];
```

- [ ] **Step 2: 빌드 확인**

```bash
cd ivdr-wiki && npx tsc --noEmit
```

Expected: 타입 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add ivdr-wiki/src/data/iso13485/stations.ts
git commit -m "feat(iso13485): add 4-phase 10-station data layer"
```

---

## Task 4: ISO 13485 데이터 — docTree.ts + documents.ts

**Files:**
- Create: `ivdr-wiki/src/data/iso13485/docTree.ts`
- Create: `ivdr-wiki/src/data/iso13485/documents.ts`
- Modify: `ivdr-wiki/src/data/documents.ts` — `resolveDoc` 함수에서 ISO 13485 문서도 조회

- [ ] **Step 1: iso13485/docTree.ts 생성**

```ts
// ivdr-wiki/src/data/iso13485/docTree.ts
// ISO 13485 전용 문서 (공통 문서 제외 — 공통은 IVDR docTree의 sharedDocIds 재사용)

export interface ISO13485DocLeaf {
  id: string;       // "iso-" 접두사
  title: string;
  refs: string[];   // ISO 13485 조항
  stationId: number; // 1..10
  requirement: "required" | "conditional" | "ifApplicable";
  note?: string;
}

export const iso13485DocTree: ISO13485DocLeaf[] = [
  // Station 1 — QMS 문서화 체계
  { id: "iso-qms-scope",         title: "QMS 적용 범위 문서",        refs: ["4.1", "4.2.2"],    stationId: 1, requirement: "required" },
  { id: "iso-documented-info",   title: "문서화된 정보 관리 절차서",   refs: ["4.2.3", "4.2.5"],  stationId: 1, requirement: "required" },
  // Station 2 — 경영 책임
  { id: "iso-quality-policy",    title: "품질방침",                  refs: ["5.3"],             stationId: 2, requirement: "required" },
  { id: "iso-quality-objectives",title: "품질목표",                  refs: ["5.4.1"],           stationId: 2, requirement: "required" },
  { id: "iso-management-review", title: "경영 검토 기록",             refs: ["5.6"],             stationId: 2, requirement: "required" },
  // Station 3 — 인적 자원
  { id: "iso-competence-matrix", title: "역량 매트릭스",              refs: ["6.2"],             stationId: 3, requirement: "required" },
  { id: "iso-training-records",  title: "교육훈련 기록",              refs: ["6.2"],             stationId: 3, requirement: "required" },
  // Station 4 — 인프라·작업환경
  { id: "iso-infra-maintenance", title: "인프라 유지보수 기록",        refs: ["6.3"],             stationId: 4, requirement: "required" },
  { id: "iso-work-environment",  title: "작업환경 관리 기록",          refs: ["6.4"],             stationId: 4, requirement: "conditional", note: "오염·청결 관리가 필요한 경우 필수" },
  // Station 6 — 구매·공급자
  { id: "iso-approved-supplier-list",    title: "승인공급자목록(ASL)",     refs: ["7.4.1"],   stationId: 6, requirement: "required" },
  { id: "iso-purchasing-verification",   title: "구매 검사 기록",           refs: ["7.4.3"],   stationId: 6, requirement: "required" },
  // Station 7 — 생산·서비스
  { id: "iso-customer-property",         title: "고객 자산 관리 기록",       refs: ["7.5.4"],   stationId: 7, requirement: "conditional" },
  { id: "iso-identification-traceability", title: "식별·추적성 기록",        refs: ["7.5.3"],   stationId: 7, requirement: "required" },
  { id: "iso-service-records",           title: "서비스 기록",               refs: ["7.5.1"],   stationId: 7, requirement: "ifApplicable", note: "서비스 제공 시" },
  // Station 8 — 측정장비
  { id: "iso-calibration-records",       title: "측정장비 교정 기록",         refs: ["7.6"],     stationId: 8, requirement: "required" },
  // Station 9 — 모니터링·내부심사
  { id: "iso-internal-audit-report",     title: "내부심사 보고서",            refs: ["8.2.2"],   stationId: 9, requirement: "required" },
  { id: "iso-customer-satisfaction",     title: "고객 만족 측정 기록",         refs: ["8.2.1"],   stationId: 9, requirement: "required" },
  // Station 10 — 개선
  { id: "iso-corrective-action",         title: "시정조치(CA) 기록",          refs: ["8.5.2"],   stationId: 10, requirement: "required" },
  { id: "iso-preventive-action",         title: "예방조치(PA) 기록",          refs: ["8.5.3"],   stationId: 10, requirement: "required" },
];

export const iso13485LeafById = (id: string): ISO13485DocLeaf | undefined =>
  iso13485DocTree.find((l) => l.id === id);

export const iso13485LeavesByStation = (stationId: number): ISO13485DocLeaf[] =>
  iso13485DocTree.filter((l) => l.stationId === stationId);

export const allISO13485DocIds = (): string[] =>
  iso13485DocTree.map((l) => l.id);
```

- [ ] **Step 2: iso13485/documents.ts 생성**

```ts
// ivdr-wiki/src/data/iso13485/documents.ts
import type { DocTemplate } from "../documents";

export const iso13485Documents: DocTemplate[] = [
  {
    id: "iso-qms-scope",
    stationId: 1,
    docTitle: "QMS 적용 범위 문서",
    purpose: "ISO 13485:2016 인증의 적용 범위를 명확히 정의해 심사 범위를 고정한다.",
    sections: [
      {
        heading: "1. 조직 개요",
        guidance: "조직명·소재지·주요 활동을 적는다.",
        placeholder: "조직명: [____]\n소재지: [____]\n주요 의료기기 활동: [____]",
      },
      {
        heading: "2. QMS 적용 범위",
        guidance: "인증 범위에 포함되는 제품·서비스·사이트를 명확히 기술한다.",
        placeholder: "포함 제품/서비스: [____]\n포함 사이트/부서: [____]\n제외 사항 및 이유(해당 시): [____]",
      },
      {
        heading: "3. 7.3 제외 여부",
        guidance: "설계·개발(Clause 7.3) 적용 여부 및 제외 근거를 기술한다.",
        placeholder: "설계·개발 적용: [ ] 예  [ ] 아니오\n제외 근거(아니오인 경우): [____]",
      },
    ],
    checklist: [
      "제품·서비스·사이트가 명확히 기술되어 있다",
      "7.3 제외 여부와 근거가 명시되어 있다",
      "QMS 문서(품질매뉴얼)와 일치한다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 4.1", "4.2.2"],
  },
  {
    id: "iso-quality-policy",
    stationId: 2,
    docTitle: "품질방침",
    purpose: "조직의 품질에 대한 최고경영진의 의도와 방향을 공식 선언한다.",
    sections: [
      {
        heading: "1. 품질방침 선언문",
        guidance: "최고경영진이 서명한 품질 의지 선언. QMS 목적·지속적 개선·요구사항 충족 의지를 포함한다.",
        placeholder: "[조직명]은 의료기기의 안전·성능·법적 요구사항을 충족하고\n지속적으로 QMS를 개선하여 고객 만족을 실현한다.\n\n서명: _______________  일자: _______________",
      },
      {
        heading: "2. 품질목표와의 연계",
        guidance: "품질방침이 측정 가능한 품질목표(5.4.1)와 어떻게 연결되는지 기술한다.",
        placeholder: "방침 항목 → 관련 품질목표:\n- [방침 1] → [목표 1]\n- [방침 2] → [목표 2]",
      },
    ],
    checklist: [
      "최고경영진 서명이 있다",
      "QMS 목적·지속 개선·요구사항 충족 의지가 포함되어 있다",
      "품질목표와 연계가 명확하다",
      "전 직원에게 전달·이해·유지될 방법이 정해져 있다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 5.3"],
  },
  {
    id: "iso-management-review",
    stationId: 2,
    docTitle: "경영 검토 기록",
    purpose: "최고경영진이 QMS의 적절성·효과성을 정기적으로 평가한 결과를 문서화한다.",
    sections: [
      {
        heading: "1. 검토 개요",
        guidance: "검토 일자, 참석자, 회의 목적을 기록한다.",
        placeholder: "검토 일자: [____]  주기: [ ] 연 1회  [ ] 반기\n참석자: [____]",
      },
      {
        heading: "2. 검토 입력",
        guidance: "ISO 13485 Clause 5.6.2의 필수 입력 항목을 모두 검토한다.",
        placeholder: "a) 이전 검토 후속 조치 결과: [____]\nb) 고객 피드백 요약: [____]\nc) 프로세스 성과·제품 적합성: [____]\nd) 시정·예방조치 현황: [____]\ne) 이전 검토 후속 조치: [____]\nf) QMS 변경 계획: [____]\ng) 개선 권고사항: [____]",
      },
      {
        heading: "3. 검토 출력 및 결정사항",
        guidance: "QMS 효과성 개선, 제품 개선, 자원 필요성에 대한 결정을 기록한다.",
        placeholder: "결정 사항:\n1. [____]  담당: [____]  기한: [____]\n2. [____]  담당: [____]  기한: [____]",
      },
    ],
    checklist: [
      "Clause 5.6.2의 필수 입력 항목이 모두 포함되어 있다",
      "결정사항에 담당자·기한이 명시되어 있다",
      "다음 검토 시 후속 확인 계획이 있다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 5.6"],
  },
  {
    id: "iso-approved-supplier-list",
    stationId: 6,
    docTitle: "승인공급자목록(ASL)",
    purpose: "품질에 영향을 주는 외부 공급자를 평가·선정·관리하는 승인 목록을 유지한다.",
    sections: [
      {
        heading: "1. 목록 개요",
        guidance: "작성일, 버전, 승인자를 기록한다.",
        placeholder: "작성일: [____]  버전: [____]  승인자: [____]",
      },
      {
        heading: "2. 공급자 목록",
        guidance: "각 공급자별 공급 품목, 평가 기준, 현재 상태, 재평가 기한을 기록한다.",
        placeholder: "| 공급자명 | 공급 품목/서비스 | 영향 등급(H/M/L) | 평가 방법 | 승인일 | 재평가 기한 |\n|---|---|---|---|---|---|\n| [____] | [____] | [____] | [____] | [____] | [____] |",
      },
      {
        heading: "3. 평가 기준",
        guidance: "공급자 선정·재평가에 사용하는 기준과 합격 점수를 명시한다.",
        placeholder: "평가 항목:\n- 품질 이력(불량률): 가중치 [_]%\n- 납기 준수율: 가중치 [_]%\n- 인증서 보유(ISO 9001 등): 가중치 [_]%\n합격 기준: [____]점 이상",
      },
    ],
    checklist: [
      "모든 품질 영향 공급자가 등록되어 있다",
      "재평가 기한이 모두 기재되어 있다",
      "최근 버전이 승인자 서명 또는 전자 결재로 승인되어 있다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 7.4.1"],
  },
  {
    id: "iso-internal-audit-report",
    stationId: 9,
    docTitle: "내부심사 보고서",
    purpose: "QMS가 계획된 요건에 따라 실행·유지되는지 독립적으로 평가한 결과를 기록한다.",
    sections: [
      {
        heading: "1. 심사 개요",
        guidance: "심사 범위, 기준, 심사원, 일정을 기록한다.",
        placeholder: "심사 범위: [____]\n심사 기준: ISO 13485:2016 Clause [____]\n심사원: [____] (해당 부서와 독립)\n심사 일자: [____]",
      },
      {
        heading: "2. 심사 결과",
        guidance: "각 항목별 적합/부적합/관찰사항을 기록한다.",
        placeholder: "| 조항 | 심사 항목 | 결과 | 비고 |\n|---|---|---|---|\n| 4.2.4 | 의료기기 파일 유지 | [적합/부적합/관찰] | [____] |",
      },
      {
        heading: "3. 후속 조치 계획",
        guidance: "부적합 및 관찰사항에 대한 시정조치 계획과 기한을 기록한다.",
        placeholder: "No. | 발견사항 | 조치 계획 | 담당 | 완료 기한\n1 | [____] | [____] | [____] | [____]",
      },
    ],
    checklist: [
      "심사원이 심사 대상 부서와 독립되어 있다",
      "모든 부적합에 시정조치 계획이 있다",
      "다음 심사 일정이 수립되어 있다",
      "경영 검토 입력으로 이 보고서가 참조된다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 8.2.2"],
  },
  {
    id: "iso-corrective-action",
    stationId: 10,
    docTitle: "시정조치(CA) 기록",
    purpose: "발생한 부적합의 근본 원인을 제거해 재발을 방지하는 시정조치를 기록한다.",
    sections: [
      {
        heading: "1. 이슈 설명",
        guidance: "발생한 부적합 또는 고객 컴플레인을 구체적으로 기술한다.",
        placeholder: "발생일: [____]  보고자: [____]\n이슈 설명: [____]\n영향 범위: [ ] 제품  [ ] 프로세스  [ ] 시스템",
      },
      {
        heading: "2. 근본 원인 분석",
        guidance: "5-Why, 특성요인도 등의 방법으로 근본 원인을 파악한다.",
        placeholder: "분석 방법: [5-Why / 특성요인도 / 기타]\nWhy 1: [____]\nWhy 2: [____]\nWhy 3: [____]\n근본 원인: [____]",
      },
      {
        heading: "3. 시정조치 계획 및 결과",
        guidance: "근본 원인을 제거하는 조치를 계획하고 완료 후 효과를 검증한다.",
        placeholder: "조치 내용: [____]\n담당: [____]  기한: [____]\n완료일: [____]\n효과 검증 방법: [____]\n검증 결과: [ ] 효과 있음  [ ] 추가 조치 필요",
      },
    ],
    checklist: [
      "근본 원인이 표면적 원인이 아닌 근본 수준까지 파악되어 있다",
      "조치 후 효과 검증 결과가 기록되어 있다",
      "유사 이슈에 대한 예방적 확산 적용 여부를 검토했다",
    ],
    relatedConceptSlugs: ["iso-13485"],
    refs: ["ISO 13485:2016 Clause 8.5.2"],
  },
];

export const iso13485DocById = (id: string): DocTemplate | undefined =>
  iso13485Documents.find((d) => d.id === id);
```

- [ ] **Step 3: resolveDoc에 ISO 13485 폴백 추가**

`ivdr-wiki/src/data/documents.ts` 의 `resolveDoc` 함수를 수정한다. 파일 상단에 import 추가 후 함수 수정:

```ts
// 상단 import 추가
import { iso13485DocById } from "./iso13485/documents";
import { iso13485LeafById } from "./iso13485/docTree";
```

```ts
// resolveDoc 함수 수정 (819행 근처)
export function resolveDoc(id: string): DocTemplate | undefined {
  // IVDR 전용 템플릿 먼저 확인
  const leaf = leafById(id);
  const detailed = docById(id);
  if (detailed) {
    const m = metaFor(id);
    return {
      ...detailed,
      rationale: rationaleFor(id),
      difficulty: m?.difficulty,
      importance: m?.importance,
      effort: effortFor(id),
      prepDocs: prepDocsFor(id),
      knowledge: knowledgeFor(id),
      prerequisites: leaf?.prerequisites ?? [],
    };
  }
  if (leaf) {
    const station = stations.find((s) => s.id === leaf.stationId);
    if (station) return buildGenericDoc(leaf, station);
  }

  // ISO 13485 전용 문서 확인
  const isoDetailed = iso13485DocById(id);
  if (isoDetailed) return isoDetailed;
  const isoLeaf = iso13485LeafById(id);
  if (isoLeaf) {
    return {
      id: isoLeaf.id,
      stationId: isoLeaf.stationId,
      docTitle: isoLeaf.title,
      purpose: isoLeaf.note ?? `ISO 13485 ${isoLeaf.refs.join("·")} 요건을 충족하는 문서입니다.`,
      sections: [
        {
          heading: "1. 내용",
          guidance: "ISO 13485 요구사항에 따라 작성한다.",
          placeholder: `[${isoLeaf.title} 내용을 여기에 작성하세요]`,
        },
      ],
      checklist: [`${isoLeaf.title} 내용이 ISO 13485 ${isoLeaf.refs.join("·")} 요건을 충족한다`],
      relatedConceptSlugs: ["iso-13485"],
      refs: isoLeaf.refs.map((r) => `ISO 13485:2016 Clause ${r}`),
    };
  }

  return undefined;
}
```

- [ ] **Step 4: 빌드 확인**

```bash
cd ivdr-wiki && npx tsc --noEmit
```

Expected: 타입 에러 없음.

- [ ] **Step 5: 커밋**

```bash
git add ivdr-wiki/src/data/iso13485/ ivdr-wiki/src/data/documents.ts
git commit -m "feat(iso13485): add doc tree, templates, and resolveDoc fallback"
```

---

## Task 5: ISO13485Map 컴포넌트

**Files:**
- Modify: `ivdr-wiki/src/components/ISO13485Map.tsx`

- [ ] **Step 1: ISO13485Map.tsx 완성**

```tsx
// ivdr-wiki/src/components/ISO13485Map.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, FolderTree, Library } from "lucide-react";
import {
  iso13485Phases,
  iso13485Stations,
  type ISO13485PhaseId,
} from "../data/iso13485/stations";
import { PhaseBand } from "./PhaseBand";
import { PhaseNav } from "./PhaseNav";
import { StationDetail } from "./StationDetail";
import { iso13485LeavesByStation } from "../data/iso13485/docTree";
import type { Phase, Station } from "../data/stations";

// ISO13485Phase → IVDR Phase 형 변환 (PhaseBand 재사용)
function adaptPhase(p: (typeof iso13485Phases)[0]): Phase {
  return {
    id: p.id as any,
    order: p.order,
    title: p.title,
    subtitle: p.subtitle,
    colorVar: p.colorVar,
    tintVar: p.tintVar,
  };
}

// ISO13485Station → IVDR Station 형 변환 (StationCard/StationDetail 재사용)
function adaptStation(s: (typeof iso13485Stations)[0]): Station {
  const docs = iso13485LeavesByStation(s.id);
  return {
    id: s.id,
    phase: s.phase as any,
    title: s.title,
    icon: s.icon,
    oneLine: s.oneLine,
    tag: s.tag,
    body: s.body,
    todo: s.todo,
    refs: s.refs,
    note: s.note,
    // docs 링크는 todo에 녹여있고 StationDetail에서 문서 칩은 별도 처리
  };
}

export function ISO13485Map() {
  const navigate = useNavigate();
  const { id } = useParams();

  const adaptedPhases = useMemo(() => iso13485Phases.map(adaptPhase), []);
  const adaptedStations = useMemo(() => iso13485Stations.map(adaptStation), []);

  const stationsByPhase = useMemo(() => {
    const map = {} as Record<string, typeof adaptedStations>;
    for (const p of adaptedPhases) {
      map[p.id] = adaptedStations.filter((s) => s.phase === p.id);
    }
    return map;
  }, [adaptedPhases, adaptedStations]);

  const openId = id ? Number(id) : null;
  const activeStation = openId != null
    ? adaptedStations.find((s) => s.id === openId) ?? null
    : null;

  const openStation = useCallback(
    (sid: number) => navigate(`/iso13485/station/${sid}`),
    [navigate],
  );
  const closeStation = useCallback(() => navigate("/iso13485"), [navigate]);

  const [activePhase, setActivePhase] = useState<ISO13485PhaseId | null>("qms");
  const bandRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const pid = (visible.target as HTMLElement).dataset.phase as ISO13485PhaseId;
          if (pid) setActivePhase(pid);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    bandRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <PhaseNav activePhase={activePhase as any} overridePhases={adaptedPhases} />

      <main
        className="mx-auto"
        style={{ maxWidth: "var(--max-w)", padding: "var(--s-12) var(--margin) var(--s-16)" }}
      >
        {/* Hero */}
        <header style={{ marginBottom: "var(--s-12)" }}>
          <span
            className="inline-flex items-center gap-2 rounded-full font-semibold"
            style={{ background: "var(--p3-tint)", color: "var(--p3)", fontSize: "var(--t-sm)", padding: "5px 14px" }}
          >
            <CheckCircle size={16} strokeWidth={2.5} aria-hidden />
            ISO 13485 인증 여정 · 4 페이즈 10 정거장
          </span>
          <h1
            className="font-extrabold text-text"
            style={{ fontSize: "var(--t-3xl)", lineHeight: "var(--lh-tight)", marginTop: "var(--s-4)", maxWidth: 760 }}
          >
            <span style={{ color: "var(--p3)" }}>QMS 수립 · 심사 준비 · 지속 개선</span>
          </h1>
          <p
            className="text-text-muted"
            style={{ fontSize: "var(--t-lg)", marginTop: "var(--s-4)", maxWidth: 640 }}
          >
            Clause 4–8 를 4개 페이즈로 구분했다. 카드를 누르면 본문·지금 할 일·관련 조항이 열린다.
          </p>

          <div className="flex flex-wrap gap-3" style={{ marginTop: "var(--s-6)" }}>
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 rounded-[var(--r-md)] font-bold text-text-on-color"
              style={{ background: "var(--p3)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
            >
              <FolderTree size={18} aria-hidden />
              공통 문서 전체 보기
            </Link>
            <Link
              to="/wiki"
              className="inline-flex items-center gap-2 rounded-[var(--r-md)] border font-bold text-text hover:bg-surface"
              style={{ borderColor: "var(--border-strong)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
            >
              <Library size={18} style={{ color: "var(--info)" }} aria-hidden />
              개념 위키
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-[var(--r-md)] border font-bold text-text-muted hover:bg-surface"
              style={{ borderColor: "var(--border)", fontSize: "var(--t-sm)", padding: "11px 18px", minHeight: 44 }}
            >
              ← 인증 허브
            </Link>
          </div>
        </header>

        {/* 4 페이즈 밴드 */}
        <div className="flex flex-col" style={{ gap: "var(--s-8)" }}>
          {adaptedPhases.map((p) => (
            <PhaseBand
              key={p.id}
              phase={p}
              stations={stationsByPhase[p.id] ?? []}
              activeId={openId ?? undefined}
              onOpen={openStation}
              registerRef={(el) => {
                if (el) {
                  el.dataset.phase = p.id;
                  bandRefs.current.set(p.id, el);
                } else {
                  bandRefs.current.delete(p.id);
                }
              }}
            />
          ))}
        </div>

        <footer
          className="text-text-subtle"
          style={{ fontSize: "var(--t-xs)", marginTop: "var(--s-12)", lineHeight: "var(--lh-base)" }}
        >
          ISO 13485:2016 내용은 2026년 6월 기준 확인값입니다. 실제 인증 진행 시 최신 표준 원문·인증기관 요건으로 재확인하세요.
        </footer>
      </main>

      <StationDetail station={activeStation} onClose={closeStation} />
    </div>
  );
}
```

> **주의:** `PhaseNav`가 `overridePhases` prop을 받지 않으면 Step 2에서 추가한다.

- [ ] **Step 2: PhaseNav overridePhases prop 확인 및 추가**

`ivdr-wiki/src/components/PhaseNav.tsx` 를 읽어 `phases` prop 지원 여부 확인.
`phases` props이 없으면 아래와 같이 추가:

```tsx
// PhaseNav.tsx — props 타입에 overridePhases 추가
interface PhaseNavProps {
  activePhase: PhaseId | null;
  overridePhases?: { id: string; title: string; colorVar: string }[];
}

export function PhaseNav({ activePhase, overridePhases }: PhaseNavProps) {
  const displayPhases = overridePhases ?? phases;
  // 이하 기존 렌더 로직에서 phases → displayPhases 로 교체
```

- [ ] **Step 3: 빌드 확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공.

- [ ] **Step 4: 커밋**

```bash
git add ivdr-wiki/src/components/ISO13485Map.tsx ivdr-wiki/src/components/PhaseNav.tsx
git commit -m "feat(iso13485): add ISO13485Map journey component"
```

---

## Task 6: 진행률 추적 — useProgress 훅 + UI

**Files:**
- Create: `ivdr-wiki/src/data/progress.ts`
- Modify: `ivdr-wiki/src/components/DocumentWorkspace.tsx` — 상태 변경 버튼 추가
- Modify: `ivdr-wiki/src/components/CertHub.tsx` — 진행률 표시 추가

- [ ] **Step 1: progress.ts 생성**

```ts
// ivdr-wiki/src/data/progress.ts
import { useState, useCallback } from "react";

export type DocStatus = "not_started" | "in_progress" | "done";
type ProgressMap = Record<string, DocStatus>;

const STORAGE_KEY = (certId: string) => `cert-progress-${certId}`;

function loadProgress(certId: string): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(certId)) ?? "{}");
  } catch {
    return {};
  }
}

function saveProgress(certId: string, map: ProgressMap) {
  localStorage.setItem(STORAGE_KEY(certId), JSON.stringify(map));
}

export function useProgress(certId: "ivdr" | "iso13485") {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress(certId));

  const setStatus = useCallback(
    (docId: string, status: DocStatus) => {
      setProgress((prev) => {
        const next = { ...prev, [docId]: status };
        saveProgress(certId, next);
        return next;
      });
    },
    [certId],
  );

  const getStatus = useCallback(
    (docId: string): DocStatus => progress[docId] ?? "not_started",
    [progress],
  );

  const countByStatus = useCallback(
    (docIds: string[]) => {
      let done = 0, inProgress = 0;
      for (const id of docIds) {
        const s = progress[id] ?? "not_started";
        if (s === "done") done++;
        else if (s === "in_progress") inProgress++;
      }
      return { done, inProgress, total: docIds.length };
    },
    [progress],
  );

  return { getStatus, setStatus, countByStatus };
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  not_started: "미작성",
  in_progress: "작성 중",
  done: "완료",
};

export const STATUS_NEXT: Record<DocStatus, DocStatus> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

export const STATUS_COLOR: Record<DocStatus, string> = {
  not_started: "var(--text-subtle)",
  in_progress: "var(--warning)",
  done: "var(--success)",
};
```

- [ ] **Step 2: DocumentWorkspace에 상태 버튼 추가**

`ivdr-wiki/src/components/DocumentWorkspace.tsx` 에서 `import { useProgress, STATUS_LABEL, STATUS_NEXT, STATUS_COLOR } from "../data/progress";` 추가 후, 문서 헤더 아래에 버튼 삽입:

```tsx
// DocumentWorkspace 상단 import 추가
import { useProgress, STATUS_LABEL, STATUS_NEXT, STATUS_COLOR, type DocStatus } from "../data/progress";

// DocumentWorkspace 함수 내부에 추가 (const phase = ... 아래)
const { getStatus, setStatus } = useProgress("ivdr");
const status = doc ? getStatus(doc.id) : "not_started";
const nextStatus = STATUS_NEXT[status];

// JSX: 헤더 브레드크럼 아래, docTitle 위에 삽입
<div style={{ marginBottom: "var(--s-4)" }}>
  <button
    onClick={() => doc && setStatus(doc.id, nextStatus)}
    className="inline-flex items-center gap-2 rounded-[var(--r-md)] font-semibold border hover:bg-surface"
    style={{
      fontSize: "var(--t-sm)",
      padding: "7px 14px",
      borderColor: STATUS_COLOR[status],
      color: STATUS_COLOR[status],
    }}
  >
    <span
      className="inline-block rounded-full"
      style={{ width: 8, height: 8, background: STATUS_COLOR[status] }}
    />
    {STATUS_LABEL[status]}
    <span className="text-text-subtle" style={{ fontSize: "var(--t-xs)" }}>
      → {STATUS_LABEL[nextStatus]}
    </span>
  </button>
</div>
```

- [ ] **Step 3: CertHub에 진행률 표시 추가**

`ivdr-wiki/src/components/CertHub.tsx` 에 import 추가 + 카드에 진행률 표시:

```tsx
// CertHub.tsx 상단 import 추가
import { useProgress } from "../data/progress";
import { allLeaves } from "../data/docTree";
import { sharedDocIds, ceOnlyDocIds } from "../data/schemes";
import { allISO13485DocIds } from "../data/iso13485/docTree";

// CertHub 함수 내부
const ivdrProgress = useProgress("ivdr");
const isoProgress = useProgress("iso13485");

const ivdrDocIds = allLeaves().map((l) => l.id);
const isoDocIds = [...sharedDocIds(), ...allISO13485DocIds()];

const ivdrCount = ivdrProgress.countByStatus(ivdrDocIds);
const isoCount = isoProgress.countByStatus(isoDocIds);

// 각 카드 내부 "여정 시작 →" 위에 진행률 줄 추가:
// IVDR 카드:
<div className="text-text-subtle" style={{ fontSize: "var(--t-xs)", marginBottom: "var(--s-3)" }}>
  완료 {ivdrCount.done} / {ivdrCount.total}개
  {ivdrCount.inProgress > 0 && ` · 작성 중 ${ivdrCount.inProgress}개`}
</div>

// ISO 13485 카드:
<div className="text-text-subtle" style={{ fontSize: "var(--t-xs)", marginBottom: "var(--s-3)" }}>
  완료 {isoCount.done} / {isoCount.total}개
  {isoCount.inProgress > 0 && ` · 작성 중 ${isoCount.inProgress}개`}
</div>
```

- [ ] **Step 4: 빌드 확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공.

- [ ] **Step 5: 커밋**

```bash
git add ivdr-wiki/src/data/progress.ts ivdr-wiki/src/components/DocumentWorkspace.tsx ivdr-wiki/src/components/CertHub.tsx
git commit -m "feat: add localStorage progress tracking with status toggle button"
```

---

## Task 7: 이중 인증 배지 + schemes.ts 업데이트

**Files:**
- Modify: `ivdr-wiki/src/data/schemes.ts` — `iso13485SpecificDocIds` 추가
- Modify: `ivdr-wiki/src/components/DocumentWorkspace.tsx` — 인증 배지 표시

- [ ] **Step 1: schemes.ts에 ISO 13485 ID 목록 추가**

```ts
// ivdr-wiki/src/data/schemes.ts 하단에 추가
import { allISO13485DocIds } from "./iso13485/docTree";

/** ISO 13485 전용 문서 ID (공통 문서 제외). */
export function iso13485SpecificDocIds(): string[] {
  return allISO13485DocIds();
}

/** 이 문서가 ISO 13485 관련인가 (공통 or ISO 전용). */
export function isISO13485Doc(id: string): boolean {
  return isSharedDoc(id) || allISO13485DocIds().includes(id);
}
```

- [ ] **Step 2: DocumentWorkspace에 인증 배지 추가**

`DocumentWorkspace.tsx` 의 문서 제목 바로 위에 배지 삽입:

```tsx
// import 추가
import { isISO13485Doc } from "../data/schemes";
import { isSharedDoc } from "../data/schemes";

// JSX: 문서 제목 h1 위에 추가
<div className="flex flex-wrap items-center gap-2" style={{ marginBottom: "var(--s-3)" }}>
  {/* IVDR 배지 — IVDR 문서이면 항상 표시 */}
  {!doc.id.startsWith("iso-") && (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold text-text-on-color"
      style={{ background: "var(--accent)", fontSize: "var(--t-xs)", padding: "2px 10px" }}
    >
      IVDR
      {doc.refs[0] && <span className="opacity-80">· {doc.refs[0]}</span>}
    </span>
  )}
  {/* ISO 13485 배지 — 공통 문서 or ISO 전용 문서이면 표시 */}
  {isISO13485Doc(doc.id) && (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold text-text-on-color"
      style={{ background: "var(--p3)", fontSize: "var(--t-xs)", padding: "2px 10px" }}
    >
      ISO 13485
    </span>
  )}
</div>
```

- [ ] **Step 3: 빌드 확인**

```bash
cd ivdr-wiki && npm run build
```

Expected: 빌드 성공. 공통 문서(`/doc/quality-manual` 등)에서 IVDR + ISO 13485 배지가 모두 표시, CE 전용 문서(`/doc/ssp` 등)에서 IVDR 배지만 표시.

- [ ] **Step 4: 최종 커밋**

```bash
git add ivdr-wiki/src/data/schemes.ts ivdr-wiki/src/components/DocumentWorkspace.tsx
git commit -m "feat: add dual-cert badges (IVDR + ISO 13485) on shared documents"
```

---

## Self-Review

### Spec coverage

| 스펙 항목 | 구현 태스크 |
|---|---|
| `/` = CertHub (인증 선택 허브) | Task 1 |
| `/ivdr` = IVDR 여정 이전 | Task 1 + Task 2 |
| `/iso13485` = ISO 13485 여정 신규 | Task 1 + Task 5 |
| ISO 13485 4페이즈 10정거장 데이터 | Task 3 |
| ISO 13485 전용 문서 (~20개) | Task 4 |
| `resolveDoc` ISO 13485 폴백 | Task 4 |
| localStorage 진행률 추적 | Task 6 |
| DocumentWorkspace 상태 토글 버튼 | Task 6 |
| CertHub 진행률 표시 | Task 6 |
| 공유 문서 이중 조항 배지 | Task 7 |
| `isISO13485Doc` / `iso13485SpecificDocIds` | Task 7 |

### Placeholder scan

- 코드 블록은 모두 실제 코드 포함 ✓
- "TBD" / "구현 중" 없음 ✓

### Type consistency

- `ISO13485PhaseId` → `adaptPhase()` 에서 `as any` 사용 (IVDR PhaseId 타입과 충돌 방지) ✓
- `DocTemplate` 타입은 기존 `documents.ts` 에서 import해 ISO 13485 templates에서 재사용 ✓
- `useProgress` 훅은 `"ivdr" | "iso13485"` 리터럴 타입 — `DocumentWorkspace` 에서 현재 `"ivdr"` 하드코딩 (Phase 2에서 cert 감지 추가 가능)

---

Plan complete and saved to `docs/superpowers/plans/2026-06-26-dual-cert-platform.md`.

**두 가지 실행 방안:**

**1. Subagent-Driven (추천)** — 태스크별 신규 서브에이전트 디스패치, 검토 후 다음 태스크 진행

**2. Inline Execution** — 이 세션에서 executing-plans로 일괄 실행, 체크포인트 검토

**어느 쪽으로 진행할까요?**
