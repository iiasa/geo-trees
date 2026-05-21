# Improvements Plan — Design

**Date**: 2026-05-21
**Status**: Approved

## Goal

Create an ongoing, full-stack improvements backlog as Markdown documentation, capturing every known improvement across four tracks (code quality, performance & security, UX polish, page builder) so the team can groom and pull from it over time.

## Audience

- **Maintainers** picking what to work on next
- **Contributors** looking for well-defined starter items
- **Reviewers** wanting to confirm a PR fits an agreed direction

## Format

Plain Markdown organized by track, with a top-level index. No priority field — items are open by default, closed items are kept (struck through) for history. Priority is decided at grooming time, not at write time.

## Structure

```
docs/improvements/
├── README.md           # Index: one-line summary + item count per track
├── code-quality.md     # Refactors, dead code, test gaps, consistency
├── perf-security.md    # Bundle/SSR perf, auth, CSP, deps, infra hardening
├── ux-polish.md        # A11y, responsive/mobile, loading & error states
└── page-builder.md     # Puck/CMS editor improvements
```

## Per-item schema

```markdown
### <ID> — <Title>
- **Stack:** frontend | backend | infra
- **Effort:** S | M | L
- **Why:** rationale (≤2 lines)
- **Pointers:** concrete file paths / line counts / heuristics
- **Approach:** suggested direction (≤2 lines)
```

**ID prefixes** (append-only, never renumber):

- `CQ-` code quality
- `PS-` perf & security
- `UX-` UX polish
- `PB-` page builder

**Tags:**

- `Stack`: `frontend`, `backend`, or `infra`
- `Effort`: `S` (≤1 day), `M` (1-3 days), `L` (≥3 days). Rough — used for filtering, not estimation.

**Closing items:** strike the title (`### ~~CQ-01 — …~~`), add a `- **Status:** closed · <commit-sha-or-PR>` line. Don't delete — closed items document history.

## Content sources

Each item draws from:

- Codebase scout: file sizes, test ratio, console-error sites, a11y heuristics, type escape hatches
- Recent commit history: areas flagged by past hardening work (proxy, session, OIDC)
- Project conventions: 500-line file cap, Biome formatting, Vitest 70/65 thresholds
- `frontend/AGENTS.md` and existing docs

## Key decisions

- One file per track + index (not a single mega-doc) — keeps each file under the 500-line cap, allows independent grooming
- No priority field — kept open per user direction; track tags + effort tag give enough filterability
- Item IDs are append-only — closed items stay visible
- Backlog covers full stack (frontend, backend, infra) — backend items are tagged accordingly
- Seed contains ~40 items; expected to grow over time
- Location is `docs/improvements/` (sibling of `docs/plans/`), not nested under `docs/developer/` — this content is audience-agnostic (maintainers, contributors, reviewers all use it)

## Brainstorming trail

This design was reached through the superpowers:brainstorming flow:

1. Scope: full stack, ongoing backlog, medium per-item detail
2. Tracks: code quality, perf+security, UX, page builder (Puck/CMS)
3. Structure approach: one file per track + index (Approach B), chosen over single-doc (A) and severity-tiered (C)
4. Seed items vetted against the codebase before writing
