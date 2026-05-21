# Improvements Backlog

Ongoing, full-stack improvements backlog. Items are open by default — pick what fits the current sprint, leave the rest.

## Tracks

| File | Focus | Open items |
|---|---|---|
| [code-quality.md](./code-quality.md) | Refactors, dead code, test gaps, consistency | 10 |
| [perf-security.md](./perf-security.md) | Bundle/SSR perf, auth, CSP, deps, infra hardening | 11 |
| [ux-polish.md](./ux-polish.md) | A11y, responsive/mobile, loading & error states | 10 |
| [page-builder.md](./page-builder.md) | Puck/CMS editor improvements | 10 |

## How to use

- **Browsing:** open a track file and skim by ID. Each item has a `Why`, `Pointers`, and `Approach`.
- **Picking:** filter mentally by `Stack` (frontend / backend / infra) and `Effort` (S / M / L).
- **Adding:** append to the relevant track file. ID is the next number in that track. No renumbering.
- **Closing:** strike the title and add a `Status: closed · <PR-or-SHA>` line. Don't delete — closed items document history.

## Per-item schema

```markdown
### <ID> — <Title>
- **Stack:** frontend | backend | infra
- **Effort:** S | M | L
- **Why:** rationale (≤2 lines)
- **Pointers:** concrete file paths / line counts / heuristics
- **Approach:** suggested direction (≤2 lines)
```

`Effort`: `S` ≤1 day, `M` 1-3 days, `L` ≥3 days. Rough — used for filtering, not estimation.

## Design

See [`docs/plans/2026-05-21-improvements-plan-design.md`](../plans/2026-05-21-improvements-plan-design.md).
