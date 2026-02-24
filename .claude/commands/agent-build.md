# /agent-build — Build Chunk with Layer-Specific Agents

## Usage
`/agent-build [feature-name] T01 to T[N]`

## Description
Implements a chunk of tasks by spawning the correct specialized agent for each task's layer: Database Engineer for `[DB]` tasks, DotNet Architect for `[API]` tasks, Angular Expert for `[UI]` tasks.

## Prerequisites
- Plan must be approved
- Tasks must exist in `claude-notes/features/[folder]/tasks/`
- Dependencies of tasks in this chunk must be satisfied

## What Happens
1. Create chunk manifest: `claude-notes/features/[folder]/chunk-[N].json`
2. Read task specs for the requested range (T01 to T[N])
3. Order tasks by dependency and layer: `[DB]` → `[API]` → `[UI]`
4. For each task, spawn the appropriate agent:

### [DB] Tasks → Database Engineer Agent
```bash
claude -p "$(cat .claude/agents/database-engineer.md)
PROJECT: $(cat CLAUDE.md)
TASK SPEC: $(cat claude-notes/features/[folder]/tasks/T0X-name.md)
TASK: Implement this database task. Create entity, EF config, migration, repository."
```

### [API] Tasks → DotNet Architect Agent
```bash
claude -p "$(cat .claude/agents/dotnet-architect.md)
PROJECT: $(cat CLAUDE.md)
TASK SPEC: $(cat claude-notes/features/[folder]/tasks/T0X-name.md)
EXISTING CODE CONTEXT: [relevant existing files]
TASK: Implement this API task. Create controllers, services, DTOs, validators, unit tests."
```

### [UI] Tasks → Angular Expert Agent
```bash
claude -p "$(cat .claude/agents/angular-expert.md)
PROJECT: $(cat CLAUDE.md)
TASK SPEC: $(cat claude-notes/features/[folder]/tasks/T0X-name.md)
UI DESIGN: $(cat claude-notes/features/[folder]/design-*.md)
TASK: Implement this UI task. Create components, services, unit tests."
```

5. After each task, Lead Agent verifies:
   - `dotnet build` passes (for backend tasks)
   - `dotnet test` passes (for backend tasks)
   - `ng build` passes (for frontend tasks)
   - `ng test --watch=false` passes (for frontend tasks)
6. On failure: retry up to 2 times with error context, then ask user
7. Update chunk manifest with files created/modified and task status
8. Show summary: tasks completed, files created, build/test results

## Chunk Manifest Format (`chunk-N.json`)
```json
{
  "chunk": 1,
  "feature": "health-check",
  "tasks": ["T01", "T02", "T03"],
  "status": "in-progress",
  "files": {
    "created": ["src/Domain/Entities/HealthCheck.cs", ...],
    "modified": ["src/Infrastructure/ApplicationDbContext.cs", ...]
  },
  "results": {
    "build": "pass",
    "tests": "pass",
    "test_count": 12,
    "coverage": "85%"
  }
}
```

## Next Step
After successful build: `/agent-review [feature-name] chunk-[N]`
