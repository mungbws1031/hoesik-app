# IVDR Harness Output Template

Use this template for document-pack reviews. Shorten it for a single-document review, but keep the conclusion, scorecard, findings, and fix queue.

## Report Structure

### 1. 결론 / Harness Result

```text
Status: Red | Amber | Green for RA review
Readiness score: __/100
Main blocker: [one sentence]
Decision: [not ready / ready for internal RA review after fixes / ready for focused rewrite]
```

Do not write that the device or document is compliant, certified, approved, or accepted.

### 2. Source Check / 공식 출처 확인

| Source-sensitive item | Source checked | Checked date | Result | Open confirmation |
|---|---|---|---|---|
| Classification guidance | MDCG 2020-16 current revision | YYYY-MM-DD | Verified / Not verified | RA confirmation needed |

Use `Not checked - not required for this narrow review` when the task does not involve current legal or classification facts.

### 3. Document Inventory / 문서 인벤토리

| Artifact | Version/date | Device/variant | Evidence status | Notes |
|---|---|---|---|---|
| IFU | [TBD] | [TBD] | Provided / Missing | [TBD] |

### 4. Gate Scorecard / 품질 게이트 점수표

| Gate | Score | Status | Key gap | Required fix |
|---|---:|---|---|---|
| G1 Device identity and intended purpose | 0-5 | Red/Amber/Green/N/A | [TBD] | [TBD] |

### 5. Top Blockers / 최우선 차단 이슈

List 3-7 blockers. Each item should state the affected document, why it matters, and the fastest fix.

### 6. Findings Table / 상세 발견사항

| ID | Severity | Location | Issue | Why it matters | Fix | Evidence needed | Owner | Priority |
|---|---|---|---|---|---|---|---|---|
| F-001 | Critical/Major/Minor | Doc/section/page | [TBD] | [TBD] | [TBD] | [TBD] | RA/QA/R&D/Clinical/Product/Design/Software | P0/P1/P2 |

### 7. Claim-Evidence-Risk-GSPR Traceability

| Claim or requirement | Source | Evidence | Risk link | GSPR link | IFU/label link | PMS/PMPF link | Status | Action |
|---|---|---|---|---|---|---|---|---|
| [TBD] | [TBD] | Provided/Inferred/Missing | [TBD] | [TBD] | [TBD] | [TBD] | Ready / Needs evidence / Conflicting / Remove or qualify | [TBD] |

### 8. Cross-Document Contradictions / 문서 간 충돌

| Contradiction | Documents affected | Risk | Resolution |
|---|---|---|---|
| [TBD] | IFU vs PER vs TD | Critical/Major/Minor | [TBD] |

If none are found, say `No confirmed contradiction found from provided artifacts`; do not imply none exist outside the reviewed materials.

### 9. Fix Queue / 수정 작업 큐

| Priority | Task | Owner | Input needed | Target document | Done condition |
|---|---|---|---|---|---|
| P0 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

### 10. Next Actions / 다음 액션

End with concrete next steps:

- What to remove or qualify.
- What evidence to collect.
- Which document sections to align.
- Who should review.
- Which items need RA/legal/notified-body confirmation.

## Tracker Row Format

Use this compact format when the user asks for a spreadsheet-ready output:

| Finding ID | Gate | Severity | Document | Location | Issue | Evidence status | Fix | Owner | Due/priority | Status |
|---|---|---|---|---|---|---|---|---|---|---|

## Single-Document Shortcut

For one document, still check:

- Whether intended purpose and claims are internally consistent.
- Whether claims are evidence-linked.
- Whether the document creates obligations or contradictions for TD, GSPR, PER, risk, labeling, PMS/PMPF, or DoC.
- Whether missing cross-document artifacts limit the conclusion.

Use the phrase `limited-scope review` in the conclusion.
