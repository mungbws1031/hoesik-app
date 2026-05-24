# IVDR Draft and Review Quality Gates

Use this reference when the user wants 80%-ready quality, full review, gap analysis, or notified-body readiness. The goal is a strong working file, not final legal or regulatory approval.

## 80% Quality Definition

A document reaches the target working quality when it has:

- A clear intended purpose and consistent device identity.
- Traceability from claims to evidence, risks, GSPR, IFU/labeling, PER, and PMS/PMPF.
- Explicit placeholders for missing facts instead of invented details.
- No unsupported performance, safety, consumer, app, or usability claims.
- No contradiction between Technical Documentation, PER, Risk Management, GSPR, IFU/labeling, PMS/PMPF, and DoC.
- Review comments that tell the team exactly what evidence or decision is needed next.

## Evidence Labels

Use these labels inside drafts and review tables:

- `Provided`: directly supported by user-provided artifact or data.
- `Inferred`: reasonable from context, but needs confirmation.
- `Missing`: needed for document quality but not provided.
- `Contradiction`: conflicts with another document, claim, table, or label.
- `Regulatory confirmation needed`: requires RA/legal/notified-body confirmation or current official source check.
- `Remove or qualify`: claim is too broad for available evidence.

## Severity Labels

Use these labels for reviews:

- `Critical`: likely to block review, create a safety issue, invalidate intended purpose or performance claims, or cause a major IVDR traceability failure.
- `Major`: weakens the technical file, may trigger notified-body questions, or leaves a required rationale incomplete.
- `Minor`: wording, formatting, cross-reference, clarity, or table-completion issue.

## High-Risk Contradictions

Actively search for these:

- Intended purpose differs between IFU, Technical Documentation, PER, GSPR, risk file, DoC, website, or app.
- Product claims exceed performance evidence.
- Self-test language is written for professionals or assumes training not available to lay users.
- App result display or algorithm claims are absent from technical documentation or risk management.
- IFU limitations are not reflected in risk management or PER.
- Risk controls rely only on warnings when design or workflow controls may be expected.
- PMPF says no follow-up is needed while PER has unresolved clinical/performance questions.
- DoC class or conformity route does not match classification rationale.
- Labeling claims a result type, specimen type, timing, or cut-off not supported by validation.

## Claim-Evidence-Risk-GSPR Matrix

Use this table for cross-document readiness:

| Claim or Requirement | Source Document | Evidence | Risk Link | GSPR Link | IFU/Label Link | PMS/PMPF Link | Status | Action |
|---|---|---|---|---|---|---|---|---|

Status values:

- `Ready for RA review`
- `Needs evidence`
- `Needs wording change`
- `Needs cross-reference`
- `Conflicting`
- `Remove/limit claim`

## Drafting Rules

- Prefer conservative regulatory language over marketing language.
- Use `[TBD: owner/input needed]` placeholders.
- Use `Draft wording:` and `Reviewer note:` blocks when uncertainty matters.
- Avoid words like `guarantees`, `proves`, `fully compliant`, `certified`, `clinically validated`, or `approved` unless evidence is provided.
- For consumer/self-test IFU text, use short steps and plain language; keep technical rationale in the technical file, not in the user instruction flow.
- Keep performance values as placeholders unless the user provides exact data.
- When translating Korean/English, preserve regulatory meaning over literal phrasing.

## Review Output Template

Use this structure:

1. `결론`: one paragraph on readiness and main blocker.
2. `Top Risks`: 3-7 highest-priority issues.
3. `Findings Table`: severity, location, issue, why it matters, fix, evidence needed.
4. `Traceability Check`: claim/evidence/risk/GSPR/IFU/PMS consistency.
5. `Draft Fixes`: replacement wording or table rows.
6. `Next Actions`: data requests, owner suggestions, RA/legal/NB confirmation items.

## Notified-Body Response Template

For each finding:

| NB Finding | Response Strategy | Draft Response | Document Updates | Evidence Added | Residual Open Item |
|---|---|---|---|---|---|

Response wording pattern:

1. Acknowledge the observation.
2. State the document or process updated.
3. Identify the evidence added or cross-reference corrected.
4. Explain how the change improves traceability or risk control.
5. Avoid saying the issue is fully resolved unless the evidence is complete.

## Product-Specific Quality Checks

### Hormone, pregnancy, and ovulation self-tests

- Intended purpose distinguishes screening, monitoring, aid to diagnosis, fertility tracking, pregnancy detection, or ovulation prediction.
- Target population and timing window are explicit.
- Cut-off, interference, cross-reactivity, urine handling, result window, false results, and repeat-test guidance are covered.
- Claims about accuracy, early detection, cycle prediction, or quantitative interpretation are evidence-linked.

### Quantitative urine tests

- Measuring range, units, calibration, trueness/bias, precision, LoQ, linearity, specimen handling, and stability are evidence-linked.
- App/reader calculation method and displayed result are described.
- Clinical interpretation does not exceed validated context.

### App-connected IVDs

- Software/app role is defined: accessory, result display, calculation, interpretation, workflow support, data storage, or user guidance.
- Algorithm/version, validation, cybersecurity/data handoff, result display, error handling, and user comprehension are addressed.
- App screens do not introduce claims or instructions missing from IFU and technical documentation.

## Finish Criteria

Before sending the answer, check:

- The user can paste the output into a document or review tracker.
- Missing inputs are visible and assigned.
- Every high-risk claim is linked to evidence or flagged.
- Draft language is not overconfident.
- The answer tells the user exactly what to do next.
