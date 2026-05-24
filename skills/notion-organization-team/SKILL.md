---
name: notion-organization-team
description: "Safely audit and organize a Notion workspace: observe first, diagnose schema/content problems, propose approval-gated cleanup, and avoid destructive changes."
---

# Notion Organization Team

Use this skill to run a Notion cleanup team that first observes the workspace, then produces a concrete plan, and only mutates Notion after explicit approval.

## Operating Model

Default to one integrated team. Apply specialist lenses internally, then return one coherent recommendation.

Roles:
- Lead Information Architect: decide the canonical home, pilot scope, and archive rules.
- Database Architect: design databases, properties, relations, rollups, and linked views.
- Migration Librarian: classify loose pages as keep, merge, move, convert, or archive.
- Meeting and Decision Extractor: turn meetings into decisions, risks, and follow-up work.
- Research Curator: classify references, documents, evidence, source links, and review dates.
- Personal Workflow Operator: connect daily/weekly tasks to project/product work without duplicating systems.
- QA and Risk Manager: detect duplicates, orphan pages, stale pages, missing owners, missing dates, and unsafe changes.

## Quick Start

1. If Notion tools are not active, use tool discovery for Notion first. If the connector is unavailable or unauthenticated, tell the user what is blocked and ask them to connect Notion before continuing.
2. Work read-only first. Use Notion team listing, search, and fetch tools before proposing any change.
3. Scope the audit. If the user gives no scope, inspect top-level teamspaces plus recent project/product/task/meeting/research/decision pages.
4. Produce a diagnosis before mutation. Name the canonical structures, duplicates, unclear pages, and proposed cleanup order.
5. Ask for explicit approval before using create, update, move, duplicate, or comment tools. Never delete content as part of this skill.
6. After approved execution, report exactly what changed, what was left untouched, and what needs user judgment.

## Observation Workflow

Use these searches as a starting set, adapting to the workspace language:
- `프로젝트 작업 태스크 일정 회의 노트`
- `제품 디자인 개발 기획 리서치 아이디어`
- `dashboard home inbox todo tasks meeting notes`
- `결정 이슈 리스크 후속 액션 확정 보류`
- Product or company names the user mentions.

Fetch likely hubs and databases, not every search result. Prioritize:
- Teamspaces and top-level hubs.
- Product/project wiki pages.
- Task/work databases.
- Meeting databases or meeting-note pages.
- Research, document, file, and reference databases.
- Issue, decision, risk, and change-log databases.
- Personal daily/weekly task pages if they overlap project work.

For this user's workspace, treat `회사업무`, `Surearly`, `슈얼리 오브제`, `Surearly SMART`, `포재`, product 업무 DBs, 회의록 DBs, 자료·문서 DBs, and 이슈·결정 DBs as likely seed areas. Re-fetch current Notion content each time; do not rely on old observations as confirmed current truth.

## Diagnosis Rules

Classify each inspected object as one of:
- Hub: entry page or dashboard.
- Wiki: product/project knowledge page.
- Work DB: tasks, projects, todos, daily/weekly work.
- Meeting DB: meeting notes, decisions, action items.
- Resource DB: research, documents, files, references.
- Decision DB: issues, risks, decisions, changes, approvals.
- Template/sample: example structure, test page, or placeholder.
- Duplicate/legacy: useful content but not the current canonical structure.
- Orphan/unclear: no obvious owner, product, status, or next action.

Prefer pilot cleanup over global restructuring. If one product area already has task, meeting, resource, and decision databases, recommend using it as the pilot before touching the whole workspace.

## Planning Contract

Before changing Notion, return:

1. One-line recommendation.
2. Observed structure with linked source pages/databases.
3. Canonical system proposal.
4. Duplicate or legacy areas.
5. Migration queue in priority order.
6. Approval-needed changes, each with target, action, reason, and rollback note.
7. Open questions only where user judgment is truly required.

When the user asks for a skill/team design rather than immediate cleanup, provide the operating model, roles, output contract, and example invocation first.

## Mutation Rules

Do not mutate Notion unless the user approved the exact class of change.

Allowed only after approval:
- Create a planning page, dashboard page, database entry, or linked view.
- Move pages into a new parent.
- Add comments or cleanup notes.
- Duplicate a page before restructuring.

Never:
- Delete pages or databases.
- Move large groups without listing the affected IDs/pages.
- Treat sample/test pages as disposable without approval.
- Collapse separate products into one database if doing so would lose product-specific fields.
- Replace the user's daily/weekly workflow without preserving a view that supports quick daily scanning.

## References

- Read `references/schema-playbook.md` when designing or revising canonical Notion databases.
- Read `references/audit-checklist.md` when running a workspace audit, producing a migration queue, or doing QA after changes.
