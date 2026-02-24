# /agent-status — Feature Progress Dashboard

## Usage
`/agent-status [feature-name]`

## Description
Shows comprehensive progress for a feature across all phases, chunks, tasks, git, and deployment status.

## What It Shows

### Feature Overview
```
📊 FEATURE STATUS: [feature-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. Plan           [✅ Done / ⏳ Pending]  [task count] tasks, [revision count] revisions
 2. UI/UX Design   [✅ Done / ⏳ Pending / N/A]  [screen count] screens
 3. Design Docs    [✅ Done / ⏳ Pending]  3 HTML files in docs/
 4. Chunks         [✅ All Done / ⏳ In Progress]  [done]/[total] chunks complete
 5. API Tests      [✅ Pass / ⏳ Pending / ❌ Fail]  [test count] tests
 6. E2E Tests      [✅ Pass / ⏳ Pending / N/A]  [test count] tests
 7. Final Docs     [✅ Done / ⏳ Pending]  6 HTML files in docs/
 8. Git Commit     [✅ Pushed / ⏳ Pending / ⏭ Skipped]  branch: feature/[name]
 9. Deployment     [✅ Live / ⏳ Pending / ⏭ Skipped]  [URL or "not deployed"]

OVERALL: [✅ FEATURE COMPLETE / ⏳ IN PROGRESS — Next: /agent-xxx]
```

### Chunk Detail
```
CHUNK PROGRESS:
━━━━━━━━━━━━━━
Chunk 1 [T01-T03] ✅ Build ✅ Review ✅ Test → DONE
Chunk 2 [T04-T05] ✅ Build ⏳ Review ⏳ Test → IN PROGRESS
Chunk 3 [T06-T08] ⏳ Build ⏳ Review ⏳ Test → PENDING
```

### Task Detail
```
TASK STATUS:
━━━━━━━━━━━
T01 [DB]  Create users table          ✅ Done  (chunk-1)
T02 [API] User CRUD endpoints         ✅ Done  (chunk-1)
T03 [UI]  User list component          ✅ Done  (chunk-1)
T04 [API] Authentication service       ⏳ Building (chunk-2)
T05 [UI]  Login form component         ⏳ Pending (chunk-2)
```

### Documentation Status
```
DOCS STATUS:
━━━━━━━━━━━
Design Docs (Pre-Implementation):
  ✅ docs/[feature]/design-architecture.html
  ✅ docs/[feature]/design-api-specification.html
  ✅ docs/[feature]/design-technical.html

Implementation Docs (Post-Implementation):
  ✅ docs/[feature]/impl-summary.html
  ✅ docs/[feature]/impl-test-coverage.html
  ✅ docs/[feature]/impl-api-docs.html
  ✅ docs/[feature]/impl-release-notes.html
  ✅ docs/[feature]/impl-deployment.html
  ✅ docs/[feature]/impl-retrospective.html
```

### Git Status
```
GIT STATUS:
━━━━━━━━━━
Branch: feature/[feature-name]
Commits: 3
  abc1234 — feat(db): create users table (T01, T02)
  def5678 — feat(api): user CRUD endpoints (T03, T04)
  ghi9012 — feat(ui): user management components (T05)
Remote: ✅ Pushed to origin
PR: [link or "not created"]
```

### Deployment Status
```
DEPLOYMENT STATUS:
━━━━━━━━━━━━━━━━━
Platform: Vercel
Preview: https://user-mgmt-abc123.vercel.app (✅ verified)
Production: https://yourapp.vercel.app (✅ live)
Last Deployed: 2026-02-14 10:30 UTC
```

### Next Action
Always end with a clear recommendation:
```
📌 NEXT: /agent-review health-check chunk-2
```

## How It Works
1. Read feature folder for spec, task-index, execution-log
2. Read all chunk-N.json manifests
3. Check for review-chunk-N.md, api-test-report.md, e2e-test-report.md
4. Check `docs/[feature-name]/` folder for HTML design and implementation documents
5. Check git status (branch, commits, remote)
6. Check deployment status (vercel.json, deployment logs)
7. Compile and display dashboard
