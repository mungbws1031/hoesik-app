# IVDR Document Pack Reference

Use this reference to structure drafts and reviews. Keep outputs practical: document-ready tables, explicit placeholders, and traceability across claims, evidence, risks, GSPR, labeling, and post-market plans.

## Official Anchors

Check official current sources when legal accuracy matters:

- Regulation (EU) 2017/746: Article 10(4), Article 56, Articles 78-81, Annex I, Annex II, Annex III, Annex IV, Annex VIII, Annex XIII.
- European Commission MDCG guidance page for current guidance and revision status.
- MDCG 2022-2 for general principles of clinical evidence for IVDs.
- MDCG 2020-16 rev.4 for IVDR classification guidance.

Do not quote long legal text. Summarize the applicable anchor and tell the user when confirmation from regulatory affairs, legal counsel, or a notified body is needed.

## Package Map

| Document | Purpose | Core Output |
|---|---|---|
| Technical Documentation | Demonstrate that device design, manufacture, verification, validation, labeling, GSPR, risk, and PMS evidence are organized for conformity assessment. | Annex II/III-style table of contents, evidence map, missing evidence list, and section drafts. |
| GSPR Checklist | Link Annex I requirements to evidence, standards, design controls, risk controls, and labeling. | Requirement-by-requirement table with applicability, evidence, compliance rationale, and gaps. |
| Risk Management | Connect hazards, foreseeable misuse, risk controls, verification, residual risk, benefit-risk, PMS feedback, and labeling. | Hazard/risk table, benefit-risk rationale, control verification map, and unresolved risk actions. |
| Performance Evaluation | Establish scientific validity, analytical performance, clinical performance, and clinical evidence for intended purpose. | PEP/PER structure, claim-evidence map, state-of-the-art summary, performance gap list, PMPF links. |
| Labeling/IFU | Make user-facing information consistent with intended purpose, risk controls, performance limitations, and use workflow. | IFU draft/review, label checklist, warnings/limitations map, app-screen consistency check. |
| PMS/PMPF | Plan and update post-market evidence collection and performance follow-up. | PMS plan, PMPF plan or justification, PMS report/PSUR outline, signal thresholds, update loop. |
| EU DoC | Declare conformity with applicable IVDR requirements and identify the device and manufacturer. | Annex IV-style draft with placeholders and verification checklist. |

## Technical Documentation

Use this structure for a technical file plan or draft:

1. Device description and specification, including variants, accessories, reader/app components, UDI placeholders, intended purpose, intended user, specimen, analyte, result type, and operating principle.
2. Previous and similar generations of the device, if any.
3. Information supplied by the manufacturer: labels, packaging, IFU, app screens, symbols, and language/market assumptions.
4. Design and manufacturing information: critical ingredients, antibodies/enzymes/strips/reagents, reader hardware, software/algorithm, app, manufacturing flow, QC, suppliers, and sites.
5. GSPR checklist and evidence references.
6. Benefit-risk analysis and risk management summary.
7. Product verification and validation: analytical performance, clinical performance, scientific validity, stability, usability, software validation, cybersecurity/data-handling evidence where relevant, and self-test suitability.
8. PMS technical documentation: PMS plan, PMPF plan or justification, PMS report/PSUR path, and update triggers.

For self-testing or near-patient testing, explicitly add design suitability: layperson workflow, sample collection, timing, result reading, invalid result handling, app/reader guidance, error messages, comprehension, and training assumptions.

## GSPR Checklist

Use this table format:

| GSPR Ref | Applicability | Requirement Summary | Evidence | Rationale | Related Risk Controls | Labeling/IFU Link | Status | Gap/Action |
|---|---|---|---|---|---|---|---|---|

Status values:

- `Complete`: evidence is provided and internally consistent.
- `Partial`: evidence exists but needs strengthening, cross-reference, or wording alignment.
- `Missing`: no supporting evidence or rationale.
- `N/A - justify`: not applicable, with a clear rationale.
- `Conflict`: evidence or wording contradicts another document.

Always check GSPR links to:

- Intended purpose and claims.
- Performance characteristics.
- Risk management and residual risk.
- Labeling/IFU warnings and limitations.
- PMS/PMPF update loop.

## Risk Management

Use ISO 14971-style logic without claiming ISO 14971 compliance unless evidence is provided.

Core table:

| Hazard | Foreseeable Sequence/Event | Harm | Initial Risk | Control Measure | Verification Evidence | Residual Risk | Benefit-Risk Rationale | PMS/PMPF Link | Gap |
|---|---|---|---|---|---|---|---|---|---|

Typical IVD/self-test hazards:

- Wrong result from sampling, timing, reading, app interpretation, expired product, storage excursion, contamination, insufficient specimen, interference, cross-reactivity, calibration or lot issue.
- Delayed care, inappropriate self-management, anxiety or false reassurance, privacy/data exposure, app-reader mismatch, unreadable labeling, language mismatch.
- Physical or chemical exposure, leakage, biohazard handling, disposal, sharp or small part misuse if relevant.

Risk controls may include design controls, QC, lockouts, app guidance, invalid result criteria, IFU warnings, limitations, training, packaging, stability controls, and PMS thresholds. Link each control to verification evidence.

## Performance Evaluation

For PEP/PER work, organize around:

1. Intended purpose and claims.
2. Analyte/marker and scientific validity.
3. State of the art, clinical context, and accepted performance expectations.
4. Analytical performance evidence.
5. Clinical performance evidence where applicable.
6. Clinical evidence conclusion.
7. Benefit-risk conclusion.
8. Limitations and unfavorable data.
9. PMPF plan or justification.
10. Update history and triggers.

Analytical performance topics commonly include sensitivity/specificity as analytical concepts where applicable, trueness/bias, precision, accuracy, LoD/LoQ, measuring range, linearity, cut-off, interference, cross-reactivity, specimen handling, stability, reproducibility, and robustness.

Clinical performance topics commonly include diagnostic sensitivity/specificity, PPV/NPV, likelihood ratios, expected values, clinical cut-offs, target population, and correlation with clinical condition or physiological state.

Use a claim-evidence table:

| Claim | Evidence Source | Evidence Type | Supports Scientific Validity | Supports Analytical Performance | Supports Clinical Performance | Limitation | Gap/Action |
|---|---|---|---|---|---|---|---|

## Labeling and IFU

For self-test products, write for lay comprehension while preserving regulatory discipline.

Check these blocks:

- Device name, intended purpose, intended user, target population, specimen, result type, and use environment.
- Kit contents, materials required but not supplied, storage, expiry, lot, warnings, precautions, disposal, and biohazard handling.
- Step-by-step sampling and testing procedure, timing, result reading, invalid result handling, and repeat-test instructions.
- Interpretation limits, performance limits, interfering substances, false positive/false negative cautions, and when to seek professional advice.
- App/reader pairing, account/data steps, result display, error states, software version assumptions, and offline or connectivity behavior.
- Label/box/IFU/app consistency.

Do not create consumer marketing claims inside IFU unless they are supported by evidence and aligned with intended purpose.

## PMS, PMPF, PMS Report, and PSUR

PMS plan should define:

- Data sources: complaints, incidents, non-serious incidents, user feedback, distributors, literature, databases, similar devices, app analytics where appropriate, returns, QC trends, and performance complaints.
- Collection method, frequency, owner, acceptance thresholds, trend detection, escalation, CAPA link, risk management update, PER update, labeling update, and PMPF link.

PMPF plan should define:

- Objective, residual questions, data source, method, population, endpoints, acceptance criteria, schedule, owner, and link to PER updates.
- Justification if PMPF is not applicable. Use cautious language and require regulatory review.

PMS report or PSUR should summarize:

- Period covered, device population/sales/use estimate, complaints/incidents, trend analysis, PMPF findings, benefit-risk reassessment, CAPA/FSCA if any, risk and PER updates, labeling updates, and conclusions.

## EU Declaration of Conformity

Use Annex IV-style placeholders:

| Field | Draft Content | Evidence/Source | Gap |
|---|---|---|---|
| Manufacturer and address | [TBD] | [TBD] | [TBD] |
| SRN if issued | [TBD] | [TBD] | [TBD] |
| Device identification | [TBD] | Device master data | [TBD] |
| Basic UDI-DI / UDI-DI | [TBD] | UDI records | [TBD] |
| Intended purpose | [TBD] | IFU/TD/PER | [TBD] |
| Risk class and rule | [TBD] | Classification rationale | [TBD] |
| Conformity assessment route | [TBD] | RA decision/NB docs | [TBD] |
| Applicable regulation | Regulation (EU) 2017/746 | Legal reference | Confirm current text |
| Standards/CS applied | [TBD] | Standards matrix | [TBD] |
| Notified body if applicable | [TBD] | NB certificate | [TBD] |
| Declaration statement | [Draft only] | RA/legal review | Needs approval |
| Signatory/date/place | [TBD] | Company authorization | [TBD] |

Never finalize or sign a DoC. Provide draft language and a verification checklist.
