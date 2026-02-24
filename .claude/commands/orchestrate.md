# /orchestrate — Full Automated Multi-Agent Pipeline

## Usage
`/orchestrate [feature-name]`

## Description
Runs the COMPLETE development lifecycle for a feature using all specialized agents:
Plan → UI/UX Design → Design Docs → Chunk Loop (Build → Review → Test) → API Tests → E2E Tests → Final Docs → Git Commit → Deploy

## ⚠️ User Confirmation Gates
The Lead Agent MUST pause and ask the user for explicit confirmation before:
1. **Git operations** (stage, commit, push) — Phase 8
2. **Vercel deployment** (preview and production) — Phase 9
These are irreversible actions. NEVER auto-execute without user approval.

## Steps

### Phase 1: Plan
1. Run the interview (13 questions across 5 rounds)
2. Save interview answers to `claude-notes/features/[YYYY-MM]-$ARGUMENTS/interview-context.md`
3. Spawn Planner Agent with interview context + CLAUDE.md
4. Show plan summary → Approval loop (feedback / inspect / approve)

### Phase 2: UI/UX Design (if feature has UI)
5. Spawn UI/UX Designer Agent with feature spec
6. Save design specs to feature folder
7. Show design summary → Quick approval

### Phase 3: Design Documents (HTML)
8. Spawn Docs Agent (pre-implementation mode)
9. Save HTML files to `docs/[feature-name]/`:
   - `design-architecture.html`
   - `design-api-specification.html`
   - `design-technical.html`

### Phase 4: Chunk Loop
For each chunk of tasks (grouped from task-index):

10. **Build**: Spawn appropriate agents based on task layer:
    - `[DB]` tasks → Database Engineer Agent
    - `[API]` tasks → DotNet Architect Agent
    - `[UI]` tasks → Angular Expert Agent
    
11. **Review**: Spawn Reviewer Agent scoped to chunk files

12. **Test**: Spawn Tester Agent scoped to chunk unit tests

13. Mark chunk as DONE if all pass

14. Repeat for remaining chunks

### Phase 5: Feature-Wide API Tests
15. Validate all chunks complete
16. Spawn Tester Agent (API test mode)

### Phase 6: Feature-Wide E2E Tests (if UI exists)
17. Spawn Tester Agent (E2E test mode)

### Phase 7: Final Documentation (HTML)
18. Spawn Docs Agent (post-implementation mode)
19. Save HTML files to `docs/[feature-name]/`:
    - `impl-summary.html`
    - `impl-test-coverage.html`
    - `impl-api-docs.html`
    - `impl-release-notes.html`
    - `impl-deployment.html` (includes Vercel deployment instructions)
    - `impl-retrospective.html`

### Phase 8: Git Commit (⚠️ REQUIRES USER CONFIRMATION)
20. Spawn GitHub Agent to generate commit messages and PR template
21. **ASK USER**: Show files to stage, commit messages per chunk, and branch name
22. Wait for explicit approval before each git operation:
    - Branch creation
    - Staging files
    - Each commit
    - Push to remote
23. If user declines, skip to Phase 10 (Status Report)

### Phase 9: Deploy to Vercel (⚠️ REQUIRES USER CONFIRMATION)
24. Spawn Vercel Agent to generate vercel.json and deployment config
25. **ASK USER**: Show pre-deployment checklist
26. Wait for explicit approval before:
    - Preview deployment
    - Production deployment
27. If user declines, skip to Phase 10 (Status Report)

### Phase 10: Status Report
28. Run `/agent-status` to show final feature status including git and deployment state

## Error Handling
- If any sub-agent fails, pause and show the error to the user
- For build failures: retry up to 2 times, then ask user
- For test failures: show failing tests and ask if auto-fix should be attempted
- For review Critical/High: ask user if auto-fix should be applied
- For git errors: STOP immediately and show the error — never auto-resolve
- For deployment errors: STOP immediately and show logs — never auto-retry
- Log all activity to `claude-notes/agent-log.md`

## Notes
- This is the fully automated pipeline. For first-time users, use phase-by-phase commands instead.
- Git and deployment phases always require user confirmation, even in fully automated mode.
- Estimated time: 20-60 minutes depending on feature complexity
- Token usage: High (multiple sub-agent spawns). Monitor context window.
