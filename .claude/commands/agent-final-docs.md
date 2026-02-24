# /agent-final-docs — Post-Implementation Documentation (HTML)

## Usage
`/agent-final-docs [feature-name]`

## Description
Spawns the Docs Agent to create post-implementation documents as **self-contained HTML files** including deployment instructions. These capture what was ACTUALLY built (not what was planned). This is one of the LAST steps in the lifecycle — run after all chunks, API tests, and E2E tests are complete.

## Prerequisites
- All chunks DONE, API tests passed, E2E tests passed (or skipped)

## What Happens
1. Gather all artifacts: spec, task index, chunk manifests, review reports, test reports, coverage data
2. Spawn Docs Agent (post-implementation mode) with all context
3. Docs Agent generates six HTML documents:
   - `docs/[feature-name]/impl-summary.html` — Implementation summary report
   - `docs/[feature-name]/impl-test-coverage.html` — Test coverage report with real numbers
   - `docs/[feature-name]/impl-api-docs.html` — Final API documentation with curl examples
   - `docs/[feature-name]/impl-release-notes.html` — Release notes for users + developers
   - `docs/[feature-name]/impl-deployment.html` — **Deployment instructions** (DB migration, backend deploy, Vercel frontend deploy, rollback plan)
   - `docs/[feature-name]/impl-retrospective.html` — Retrospective with lessons learned
4. Update execution-log.md with final docs phase completion
5. Generate `07-retro.md` in feature folder

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/docs.md)

MODE: POST-IMPLEMENTATION

PROJECT CONTEXT:
$(cat CLAUDE.md)

FEATURE SPEC:
$(cat claude-notes/features/[folder]/03-spec.md)

TASK INDEX:
$(cat claude-notes/features/[folder]/05-task-index.md)

CHUNK MANIFESTS:
$(cat claude-notes/features/[folder]/chunk-*.json)

REVIEW REPORTS:
$(cat claude-notes/features/[folder]/review-chunk-*.md)

TEST REPORTS:
$(cat claude-notes/features/[folder]/api-test-report.md 2>/dev/null)
$(cat claude-notes/features/[folder]/e2e-test-report.md 2>/dev/null)

VERCEL CONFIG:
$(cat vercel.json 2>/dev/null || echo 'No vercel.json')

OUTPUT DIRECTORY: docs/[feature-name]/

TASK: Create six post-implementation HTML documents: impl-summary, impl-test-coverage, impl-api-docs, impl-release-notes, impl-deployment (with Vercel frontend + backend + DB migration instructions), and impl-retrospective. Use [Implementation] prefix in titles. All content must reflect ACTUAL implementation with real file paths, test results, and coverage numbers. Each HTML file must be fully self-contained with embedded CSS."
```

## Output Files
```
docs/[feature-name]/
├── impl-summary.html           # What was built, files created, deviations from design
├── impl-test-coverage.html     # Real test counts, coverage %, gaps
├── impl-api-docs.html          # Final API reference with curl examples
├── impl-release-notes.html     # User-facing + developer-facing release notes
├── impl-deployment.html        # DB migrations, backend deploy, Vercel deploy, rollback plan
└── impl-retrospective.html     # What went well, improvements, lessons learned
```

## Next Steps
- Run `/agent-commit [feature-name]` to stage, commit, and push code
- Run `/agent-deploy [feature-name]` to deploy to Vercel
- Run `/agent-status [feature-name]` to see final feature status
