---
name: ivdr-quality-check-harness
description: "Run a repeatable IVDR document-pack quality gate, scoring evidence readiness, GSPR/risk/claim traceability, source freshness, blockers, and priority fixes."
---

# IVDR Quality Check Harness

## Overview

Act as a repeatable quality harness for IVDR document packs. Evaluate readiness, contradictions, evidence gaps, and source freshness; do not act as final legal, regulatory, or notified-body approval.

Use this skill to inspect and score what exists. If the user asks to rewrite or draft fixes after the harness run, combine with `$ivdr-document-writer`.

## Operating Rules

- Default to Korean when the user writes in Korean.
- Start with the gate result, readiness score, and biggest blocker.
- Separate `Provided`, `Inferred`, `Missing`, `Contradiction`, `Regulatory confirmation needed`, and `Remove or qualify`.
- Never invent risk class, conformity route, performance values, intended purpose, UDI, certificates, standards, common specifications, test results, or notified-body positions.
- For current legal text, classification, transition rules, harmonised standards, common specifications, MDCG revision status, or source-sensitive claims, verify from official sources first and record the checked date.
- Treat self-test, lay-user, reader-based, and app-connected products as high-risk for usability, labeling mismatch, software/app interpretation, and claim/evidence drift.

## Harness Workflow

1. Identify the scope: single document review, full pack review, notified-body readiness, source freshness check, contradiction check, or claim-evidence traceability.
2. Inventory provided artifacts: document type, version/date, device variant, intended purpose, user group, specimen, analyte, result type, app/reader components, and evidence attachments.
3. Load `references/harness-gates.md` for gate criteria, severity labels, scoring, and product-specific checks.
4. Load `references/output-template.md` for the report structure and tracker rows.
5. Load `references/source-anchors.md` when source freshness, current IVDR facts, classification, transition rules, guidance revision status, or legal anchors matter.
6. Run the applicable gates and mark non-applicable gates explicitly.
7. Build a findings table with severity, location, issue, reason, fix, evidence needed, owner, and priority.
8. Calculate a readiness score and gate status using the scoring rules.
9. End with the fix queue: remove/qualify claims, collect evidence, align documents, assign owners, and identify RA/legal/notified-body confirmation items.

## Default Output

Use this order unless the user requests a narrower format:

1. `결론 / Harness Result`
2. `Source Check / 공식 출처 확인`
3. `Document Inventory / 문서 인벤토리`
4. `Gate Scorecard / 품질 게이트 점수표`
5. `Top Blockers / 최우선 차단 이슈`
6. `Findings Table / 상세 발견사항`
7. `Claim-Evidence-Risk-GSPR Traceability`
8. `Cross-Document Contradictions / 문서 간 충돌`
9. `Fix Queue / 수정 작업 큐`
10. `Next Actions / 다음 액션`

## Gate Status

Use these result labels:

- `Red`: critical blocker, unresolved contradiction, missing key evidence, or source-sensitive fact not verified.
- `Amber`: no immediate critical blocker, but major gaps remain before RA or notified-body review.
- `Green for RA review`: document pack is internally coherent enough for regulatory affairs review, but not final approval.
- `N/A`: gate does not apply; include the rationale.

## Collaboration With Other Skills

- Use `$ivdr-document-writer` after the harness when the user wants replacement wording, 80%-ready draft sections, notified-body response text, or document pack rebuilding.
- Use document/PDF skills only when file extraction, DOCX editing, comments, or PDF parsing is needed.

## Final Check

Before answering, confirm that:

- The output is repeatable enough to paste into a review tracker.
- Every major claim is linked to evidence, a gap, or a recommendation to remove/qualify it.
- Cross-document contradictions are visible, not buried.
- Source freshness and regulatory-confirmation needs are explicit.
- The answer does not present the result as legal advice, certification, or notified-body acceptance.
