# Audit Checklist

Use this reference when observing, diagnosing, or QA-checking a Notion workspace.

## Read-Only Audit

Collect:
- Teamspaces and ownership status.
- Top-level hubs and their child structure.
- Databases with schemas and views.
- Recent pages from project, task, meeting, document, research, issue, decision, and dashboard searches.
- Sample entries that reveal the intended workflow.
- Personal daily/weekly task pages that overlap project work.

Record for each object:
- Title and URL.
- Type: hub, wiki, work DB, meeting DB, resource DB, decision DB, template, duplicate, orphan.
- Parent path.
- Why it matters.
- Whether it appears canonical, legacy, sample, or unclear.

## Diagnosis Checks

Look for:
- Multiple task DBs with similar purpose.
- Meeting notes with decisions but no linked follow-up work.
- Decision/risk pages with no status, owner, or source.
- Research pages that should be Resources entries.
- Important docs with no summary or review date.
- Hubs that store too much content directly.
- Product pages without linked views for work, meetings, resources, and decisions.
- Personal todos that duplicate product tasks.
- Empty wrapper pages that point to real databases elsewhere.
- Test/sample pages that should be preserved as templates, not silently removed.

## Migration Queue Format

Use this table shape in the answer:

| Priority | Source | Current type | Proposed destination | Action | Approval needed |
| --- | --- | --- | --- | --- | --- |
| P1 | Page or DB title | wiki/task/etc. | canonical DB/page | keep/move/merge/convert/comment | yes/no |

## Approval Gate

Before mutation, list:
- Exact pages/databases to change.
- The operation: create, move, duplicate, comment, view creation, or database-entry creation.
- Why the change is useful.
- What will remain untouched.
- How to recover or undo if the user dislikes it.

## Final Report

After execution, report:
- Changed objects with links.
- Objects inspected but not changed.
- Decisions made by the user.
- Items still needing user judgment.
- Next three cleanup actions.
