# Full-Stack Multi-Agent Development System

## IMPORTANT NOTE 
No tests or documentation until all the features gets developed. If I want, I will ask manually to do so. For now, just focus on DEVELOPING features ONLY. Nothing else until all the features gets developed.

## Project Configuration
- **Backend Framework**: .NET Core 6 / ASP.NET Core Web API
- **Frontend Framework**: Angular 19+ / Angular Material 3+ / TypeScript 5.x
- **Database**: MySQL 8.x with Entity Framework Core
- **Architecture**: Microservice-based, RESTful APIs
- **Build (Backend)**: `dotnet build`
- **Test (Backend)**: `dotnet test`
- **Run (Backend)**: `dotnet run`
- **Build (Frontend)**: `ng build`
- **Test (Frontend)**: `ng test --watch=false --browsers=ChromeHeadless`
- **Run (Frontend)**: `ng serve`
- **Lint (Frontend)**: `ng lint`
- **Coverage (Backend)**: `dotnet test --collect:"XPlat Code Coverage"`
- **Coverage (Frontend)**: `ng test --code-coverage --watch=false --browsers=ChromeHeadless`

## Tech Stack Details
- **C# Version**: 10+
- **Nullable Reference Types**: Enabled
- **Angular**: Standalone components, Signals, new control flow (@if/@for)
- **State Management**: NgRx or Angular Signals (per feature decision)
- **CSS Framework**: Tailwind CSS 3.x or Angular Material (per feature decision)
- **ORM**: Entity Framework Core 6+ with MySQL provider (Pomelo)
- **Authentication**: JWT Bearer tokens
- **API Documentation**: Swagger/OpenAPI via Swashbuckle
- **Testing (Backend)**: xUnit + Moq + FluentAssertions
- **Testing (Frontend)**: Jasmine + Karma + Angular Testing Library
- **E2E Testing**: Playwright or Cypress

## Agent Coordination Strategy

### Architecture
This project uses a multi-agent system where a **Lead Agent** (you, in the interactive session) orchestrates specialized **Sub-Agents** spawned via `claude -p`.

### Agent Roster (10 Specialized Agents)
| Agent | File | Expertise |
|-------|------|-----------|
| Planner | `.claude/agents/planner.md` | Feature planning, spec creation, task breakdown |
| Angular Expert | `.claude/agents/angular-expert.md` | Angular 19+, Angular Material 3+, RxJS, signals |
| DotNet Architect | `.claude/agents/dotnet-architect.md` | ASP.NET Core APIs, EF Core, microservice patterns |
| Database Engineer | `.claude/agents/database-engineer.md` | MySQL schema, migrations, query optimization |
| UI/UX Designer | `.claude/agents/uiux-designer.md` | Modern web design, responsive layouts, accessibility |
| Reviewer | `.claude/agents/reviewer.md` | Code review across all layers (security, quality, perf) |
| Tester | `.claude/agents/tester.md` | Unit tests, API tests, E2E tests, coverage |
| Docs | `.claude/agents/docs.md` | HTML design docs, API docs, deployment docs, release notes |
| GitHub | `.claude/agents/github.md` | Git workflow, conventional commits, branching, PRs |
| Vercel | `.claude/agents/vercel.md` | Vercel deployment, config, preview/production, rollback |

### Task Routing Rules
When implementing features, route tasks to the correct agent:
1. **Database schema/migration tasks** → Database Engineer (FIRST — schema before code)
2. **Backend API/service tasks** → DotNet Architect
3. **Frontend component/page tasks** → Angular Expert
4. **UI/UX design tasks** → UI/UX Designer (BEFORE Angular Expert for new screens)
5. **Cross-layer review** → Reviewer Agent
6. **All testing** → Tester Agent
7. **Documentation (HTML)** → Docs Agent
8. **Git operations** → GitHub Agent
9. **Vercel deployment** → Vercel Agent

### ⚠️ User Confirmation Gates (CRITICAL)
The Lead Agent **MUST ask the user for explicit confirmation** before these operations:
- **Git stage/commit/push**: Show the exact files and commit messages, wait for "yes"
- **Vercel deployment**: Show pre-deployment checklist, wait for "yes" before preview AND production
- **Never auto-execute** git write operations or deployments, even in `/orchestrate` mode

### Parallel Execution Guidelines
- Database migrations MUST complete before backend code that depends on them
- UI/UX design mockups SHOULD complete before Angular implementation
- Backend API and Frontend components CAN run in parallel if API contracts are defined
- Tests CAN run in parallel with implementation (for existing code)
- Reviews happen AFTER implementation, per chunk

### Chunk Strategy
- Group tasks by layer: DB tasks → Backend tasks → Frontend tasks
- Or group by feature slice: All layers for feature-slice-1, then feature-slice-2
- Each chunk goes through: Build → Review → Test cycle
- Feature-wide API/E2E tests run AFTER all chunks complete

## Code Standards

### C# / .NET
- 4-space indentation
- Nullable reference types enabled
- Async/await for all I/O operations
- Repository pattern for data access
- CQRS for complex domains (optional per feature decision)
- Dependency injection via built-in DI container
- FluentValidation for request validation
- AutoMapper for DTO mapping
- Structured logging with Serilog
- Global exception handling middleware
- Follow Microsoft's C# coding conventions

### Angular / TypeScript
- 2-space indentation, strict mode enabled
- Standalone components (no NgModules for new code)
- OnPush change detection strategy by default
- Smart/Dumb component separation
- RxJS best practices: unsubscribe, takeUntilDestroyed, async pipe
- Angular Signals for simple state, NgRx for complex state
- Lazy loading for feature modules/routes
- WCAG 2.1 AA accessibility compliance
- Follow Angular style guide (official)

### MySQL / Database
- Snake_case for table and column names
- Always include created_at, updated_at timestamps
- Soft deletes (is_deleted flag) unless explicitly decided otherwise
- Foreign key constraints enforced
- Indexes on all foreign keys and frequently queried columns
- Use migrations (EF Core) for all schema changes — never manual DDL

### Testing Requirements
- **80%+ code coverage** for both backend and frontend
- Every test file MUST include:
  - ✅ At least 1 Positive scenario (happy path)
  - ❌ At least 1 Negative scenario (error/failure handling)
  - 🚫 At least 1 Edge case / No-input scenario (null/empty/boundary)
- Backend: xUnit with AAA pattern, descriptive test method names
- Frontend: Jasmine specs with describe/it blocks, Angular TestBed
- API Tests: Integration tests using WebApplicationFactory
- E2E Tests: Playwright or Cypress page object pattern

## Feature Development Lifecycle
1. **Plan** → `/agent-plan` (Interview + Planner Agent)
2. **UI/UX Design** → `/agent-design` (UI/UX Designer Agent — if feature has UI)
3. **Design Docs** → `/agent-design-docs` (Docs Agent → HTML files in `docs/`)
4. **Chunk Loop** (repeat per chunk):
   - `/agent-build` → Database Engineer + DotNet Architect + Angular Expert
   - `/agent-review` → Reviewer Agent
   - `/agent-test` → Tester Agent
5. **API Tests** → `/agent-api-tests` (after all chunks)
6. **E2E Tests** → `/agent-e2e-tests` (after all chunks, if UI exists)
7. **Final Docs** → `/agent-final-docs` (Docs Agent → HTML files including deployment instructions)
8. **Git Commit** → `/agent-commit` (⚠️ asks user before stage/commit/push)
9. **Deploy** → `/agent-deploy` (⚠️ asks user before preview AND production deployment)

## Documentation Format
All documentation is generated as **self-contained HTML files** in `docs/[feature-name]/`. Each file includes embedded CSS, opens in any browser, and requires no external dependencies.

## Context Preservation
The Lead Agent maintains:
- Feature requirements and acceptance criteria in `claude-notes/features/`
- Cross-cutting concerns and dependencies
- Integration points between frontend, backend, and database
- Chunk manifests (`chunk-N.json`) tracking files per chunk
- Agent activity log in `claude-notes/agent-log.md`
