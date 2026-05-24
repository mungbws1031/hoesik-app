# IVDR Quality Harness Gates

Use these gates to run a repeatable quality check. Apply only relevant gates; mark `N/A` with a rationale.

## Evidence Labels

- `Provided`: directly supported by a supplied artifact, dataset, file, screen, table, or user statement.
- `Inferred`: plausible from context but not confirmed.
- `Missing`: needed for document quality but absent.
- `Contradiction`: conflicts with another document, table, claim, label, or app screen.
- `Regulatory confirmation needed`: needs RA/legal/notified-body confirmation or a live official-source check.
- `Remove or qualify`: claim is too broad or too certain for the evidence.

## Severity Labels

- `Critical`: likely to block RA/notified-body review, invalidate intended purpose or performance claims, create a safety/usability issue, or break IVDR traceability.
- `Major`: weakens the file, leaves an important rationale incomplete, or may trigger notified-body questions.
- `Minor`: wording, formatting, cross-reference, clarity, table completion, or housekeeping issue.

## Gate Set

| Gate | What to Test | Typical Blockers |
|---|---|---|
| G0 Source freshness | Current official anchors are checked when legal/classification/guidance facts are used. | Unverified MDCG revision, outdated classification guidance, unsourced transition rule. |
| G1 Device identity and intended purpose | Device name, variants, accessories, app/reader role, specimen, analyte, result type, user, target population, use environment. | Intended purpose differs across IFU, TD, PER, risk file, app, website, or DoC. |
| G2 Pack completeness | Annex II/III-style technical documentation, GSPR, risk, performance evaluation, labeling/IFU, PMS/PMPF, DoC coverage. | Missing document family, no version/date, no owner, no evidence map. |
| G3 Claims and evidence | Every performance, usability, consumer, app, safety, and workflow claim has evidence or is limited. | Accuracy/early detection/quantitative/app interpretation claims exceed evidence. |
| G4 Performance evaluation | Scientific validity, analytical performance, clinical performance, unfavorable data, limitations, PMPF link. | PER conclusion unsupported by analytical or clinical performance evidence. |
| G5 GSPR and risk linkage | Annex I expectations connect to evidence, risk controls, labeling, PER, and PMS/PMPF. | GSPR says complete but evidence/risk/IFU links are missing. |
| G6 Risk management | Hazards, foreseeable misuse, controls, verification, residual risk, benefit-risk, PMS updates. | Risk controls rely only on warnings where design/workflow controls may be needed. |
| G7 Labeling/IFU/package/app consistency | IFU, box, label, app screens, promotional claims, warnings, limitations, symbols, language. | Label or app introduces claims absent from TD/PER/risk file. |
| G8 PMS/PMPF loop | PMS sources, thresholds, trend detection, complaint/performance signals, PER/risk/IFU update triggers. | PMPF is waived while PER has unresolved performance questions. |
| G9 DoC/classification/conformity route | Risk class, classification rule, conformity route, NB role, standards/CS, UDI/SRN placeholders. | DoC assumptions do not match classification rationale or evidence. |
| G10 Software/reader/app | Software role, algorithm/version, validation, result display, error states, data handoff, cybersecurity/privacy handoff. | App interprets results but software validation or risk linkage is absent. |
| G11 Self-test or near-patient usability | Layperson comprehension, sampling, timing, result reading, invalid result handling, repeat-test guidance, training assumptions. | IFU assumes professional knowledge or fails to control foreseeable misuse. |
| G12 Notified-body response readiness | Findings are acknowledged, document updates are named, evidence is added, residual opens are visible. | Defensive response, vague "resolved" language, no evidence or cross-reference. |

## Scoring

Score each applicable gate:

| Score | Label | Meaning |
|---|---|---|
| 5 | Strong | Complete, internally consistent, evidence-linked, and ready for RA review. |
| 4 | Review-ready | Mostly complete; only minor fixes or confirmations remain. |
| 3 | Partial | Usable working state, but major gaps or weak traceability remain. |
| 2 | Weak | Important sections exist, but evidence, rationale, or consistency is poor. |
| 1 | Missing | Required content or evidence is absent. |
| 0 | Not assessed | Not enough material to judge. |

Readiness score:

1. Average applicable gate scores and convert to a percentage: `(average / 5) * 100`.
2. Cap the score at 59 if any `Critical` finding remains open.
3. Cap the score at 79 if three or more `Major` findings remain open.
4. Mark `Red` if a critical source-sensitive regulatory fact is unverified.
5. Mark `Green for RA review` only when there are no open critical findings, at most two open major findings, and no unresolved cross-document contradiction.

## High-Risk Contradictions

Actively look for:

- Intended purpose differs between IFU, Technical Documentation, PER, GSPR, risk file, DoC, website, box, or app.
- Claims exceed performance evidence.
- Self-test language is written for professionals or assumes unavailable training.
- App result display, calculation, interpretation, or algorithm claims are absent from TD, PER, labeling, or risk management.
- IFU limitations are not reflected in risk management or PER.
- Risk controls rely only on warnings without considering design/workflow controls.
- PMPF says no follow-up is needed while PER has unresolved scientific, analytical, or clinical performance questions.
- DoC class or conformity route does not match classification rationale.
- Labeling claims specimen type, timing, cut-off, result type, early detection, prediction, monitoring, or quantitative interpretation not supported by validation.

## Product-Specific Checks

### Hormone, pregnancy, and ovulation self-tests

- Intended purpose distinguishes screening, monitoring, aid to diagnosis, fertility tracking, pregnancy detection, ovulation prediction, or cycle-support use.
- Target population, result window, testing day/timing, repeat-test guidance, limitations, false result cautions, and professional-advice triggers are explicit.
- Cut-off, interference, cross-reactivity, hook effect where relevant, urine handling, stability, lot variation, and layperson comprehension are evidence-linked.
- Accuracy, early detection, cycle prediction, or quantitative claims are limited to provided evidence.

### Quantitative urine tests

- Units, measuring range, calibration, trueness/bias, precision, LoQ, linearity, specimen handling, stability, and robustness are evidence-linked.
- App/reader calculation method and displayed result are described.
- Clinical interpretation does not exceed validated context.

### App-connected or reader-based IVDs

- App/reader role is defined: accessory, result display, calculation, interpretation, workflow support, data storage, or user guidance.
- Algorithm/version, software validation, result display, error handling, invalid result behavior, cybersecurity/privacy handoff, and user comprehension are addressed.
- App screens do not introduce claims or instructions missing from IFU and technical documentation.
