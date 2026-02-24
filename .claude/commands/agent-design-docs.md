# /agent-design-docs — Pre-Implementation Design Documents (HTML)

## Usage
`/agent-design-docs [feature-name]`

## Description
Spawns the Docs Agent to create pre-implementation design documents as **self-contained HTML files** saved locally to `docs/[feature-name]/`. Run BEFORE any coding starts so stakeholders can review the blueprint.

## Prerequisites
- Feature spec (`03-spec.md`) and decisions (`04-decisions.md`) must exist
- Plan must be approved

## What Happens
1. Create `docs/[feature-name]/` folder if it doesn't exist
2. Spawn Docs Agent (pre-implementation mode) with spec + decisions context
3. Docs Agent generates three HTML design documents:
   - `docs/[feature-name]/design-architecture.html`
   - `docs/[feature-name]/design-api-specification.html`
   - `docs/[feature-name]/design-technical.html`
4. Each file is self-contained HTML — opens directly in any browser
5. Update execution-log.md with design docs phase completion

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/docs.md)

MODE: PRE-IMPLEMENTATION

PROJECT CONTEXT:
$(cat CLAUDE.md)

FEATURE SPEC:
$(cat claude-notes/features/[folder]/03-spec.md)

DECISIONS:
$(cat claude-notes/features/[folder]/04-decisions.md)

TASK INDEX:
$(cat claude-notes/features/[folder]/05-task-index.md)

OUTPUT DIRECTORY: docs/[feature-name]/

TASK: Create three pre-implementation design documents as self-contained HTML files: design-architecture.html, design-api-specification.html, and design-technical.html. Use [Design] prefix in titles. Include Mermaid diagrams, concrete details from the spec — no placeholders. Each HTML file must be fully self-contained with embedded CSS."
```

## Output Files
```
docs/[feature-name]/
├── design-architecture.html         # System context, component diagram, data flow, NFRs
├── design-api-specification.html    # All endpoints with schemas, examples, error catalog
└── design-technical.html            # DB schema, ER diagram, service architecture, component tree
```

## Next Step
Share the HTML files with stakeholders for review, then proceed to `/agent-build`.
