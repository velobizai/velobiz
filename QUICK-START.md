# Quick Start — Multi-Agent Full-Stack Development

## 🚀 First Time? Follow These Steps:

### 1. Start Claude Code
```bash
cd /path/to/your/project
claude
```

### 2. Plan Your Feature
```
/agent-plan my-feature
```
Answer the 13 interview questions → Review the plan → Say "approved"

### 3. Design the UI (if applicable)
```
/agent-design my-feature
```

### 4. Create Design Documents (HTML)
```
/agent-design-docs my-feature
```
→ Generates 3 HTML files in `docs/my-feature/`

### 5. Build → Review → Test (per chunk)
```
/agent-build my-feature T01 to T03
/agent-review my-feature chunk-1
/agent-test my-feature chunk-1
```
Repeat for remaining chunks.

### 6. Feature-Wide Tests
```
/agent-api-tests my-feature
/agent-e2e-tests my-feature    # if UI exists
```

### 7. Final Documentation (HTML + Deployment Instructions)
```
/agent-final-docs my-feature
```
→ Generates 6 HTML files including deployment instructions

### 8. Git Commit & Push (⚠️ asks you first)
```
/agent-commit my-feature
```
→ Lead Agent will ask before each git operation

### 9. Deploy to Vercel (⚠️ asks you first)
```
/agent-deploy my-feature
```
→ Lead Agent will ask before preview and production deploy

### 10. Check Status Anytime
```
/agent-status my-feature
```

## ⚡ Shortcut: Full Automated Pipeline
```
/orchestrate my-feature
```
(Still asks for confirmation on git and deployment steps)

## 🤖 Agent Roster (10 Experts)
| Agent | Expertise |
|-------|-----------|
| Planner | Feature specs, task breakdown, dependency ordering |
| Angular Expert | Angular 19+, Angular Material 3+, TypeScript, RxJS, Signals |
| DotNet Architect | ASP.NET Core 6, EF Core, Clean Architecture, CQRS |
| Database Engineer | MySQL 8, EF Migrations, Query Optimization, Indexing |
| UI/UX Designer | Modern design, Tailwind CSS, Angular Material 3, Accessibility |
| Reviewer | Security, bugs, performance, architecture, testing quality |
| Tester | xUnit, Jasmine, Playwright, 80%+ coverage enforcement |
| Docs | HTML design docs, API docs, deployment instructions, release notes |
| GitHub | Git workflow, conventional commits, branching, pull requests |
| Vercel | Deployment config, preview/production, environment variables, rollback |

## 📂 Key Folders
- `.claude/agents/` — 10 agent role definitions (customize for your team)
- `.claude/commands/` — 13 slash commands for each phase
- `.claude/skills/` — 8 reusable code generation patterns
- `claude-notes/features/` — Feature specs and tracking
- `docs/` — Generated HTML documentation

## ⚠️ Confirmation Gates
The Lead Agent **always asks you first** before:
- Git stage, commit, push (`/agent-commit`)
- Vercel preview or production deployment (`/agent-deploy`)
