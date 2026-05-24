# Schema Playbook

Use this reference when proposing a Notion cleanup architecture or database schema.

## Recommended Canonical System

Prefer five core databases for product/project work:

1. Products
- Title: product or project name.
- Status: Idea, Active, Paused, Done, Archived.
- Owner: person.
- Stage: research, planning, design, build, validation, launch, maintenance.
- Summary: short text.
- Current focus: text.
- Key risk: text.
- Canonical wiki: URL or relation.

2. Work
- Title: task or work item.
- Product: relation to Products.
- Type: task, project chunk, meeting follow-up, design, engineering, document, research, vendor, certification.
- Status: To do, In progress, Blocked, Waiting, Done, Archived.
- Priority: high, medium, low.
- Owner: person or text if real users are not maintained.
- Due date: date.
- Source: meeting, Slack, manual, document, Codex, vendor.
- Source link: URL.
- Done criteria: text.

3. Meetings
- Title: meeting name.
- Product: relation to Products.
- Date: date.
- Category: planning, design, engineering, certification, review, vendor, decision.
- Attendees: people or text.
- Decisions: relation to Issues and Decisions, or text when relations are not available.
- Follow-up work: relation to Work, or text when relations are not available.

4. Resources
- Title: document or reference name.
- Product: relation to Products.
- Category: PRD, UX/UI, product design, mechanical, optical/electronics, certification, IVDR, brand, market/competitor, reference.
- Status: draft, in review, approved, outdated, archived.
- Importance: high, medium, low.
- Source link: URL.
- Summary: text.
- Last reviewed: date.

5. Issues and Decisions
- Title: issue, risk, decision, or change.
- Product: relation to Products.
- Type: issue, design decision, change, risk, deferred.
- Status: open, in progress, decided, closed, archived.
- Decision date: date.
- Impact area: design, mechanical, optical/electronics, FW/App, certification/IVDR, production.
- Rationale: text.
- Source link: URL.
- Follow-up work: relation to Work.

## Dashboard Pattern

Make top-level hub pages dashboards, not storage piles:
- Today: filtered Work view for active/high-priority items.
- This week: Work due this week plus blocked items.
- Products: Products table or gallery.
- Recent meetings: Meetings sorted by date.
- Decisions needing follow-up: Issues and Decisions where status is open or decided but follow-up missing.
- Documents needing review: Resources with high importance or stale Last reviewed.

## Migration Rules

Use these rules when converting an existing workspace:
- Keep existing product wiki pages as canonical wiki pages if they already contain rich context.
- Move new operational items into databases rather than adding more loose subpages.
- Convert long meeting notes into Meetings entries and extract decisions/follow-ups.
- Put source documents and research into Resources instead of pasting all material into wiki pages.
- Record design decisions and risks separately from meeting notes.
- Keep personal daily/weekly task systems as views over Work where possible.

## Pilot Recommendation

If the workspace has one product area with a wiki plus task, meeting, resource, and decision databases, use that area as the first pilot. After the pilot works, generalize the schema to other product areas.
