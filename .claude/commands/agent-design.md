# /agent-design — UI/UX Design with Designer Agent

## Usage
`/agent-design [feature-name]`

## Description
Spawns the UI/UX Designer Agent to create visual design specifications for all screens and components in the feature. Run BEFORE implementation if the feature has a user interface.

## Prerequisites
- Feature spec must exist (`claude-notes/features/[folder]/03-spec.md`)
- Task index must exist (`claude-notes/features/[folder]/05-task-index.md`)

## What Happens
1. Lead Agent reads the feature spec to identify UI components
2. If no `[UI]` or `[UIUX]` tasks exist in task-index → Skip with message "No UI components in this feature"
3. Spawn UI/UX Designer Agent with feature spec context
4. Designer produces design specs for each screen/component:
   - `design-[screen-name].md` — Component specification with Tailwind classes
   - `flow-[feature-name].md` — User flow diagram with all paths
5. Save outputs to feature folder
6. Show design summary to user for quick review

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/uiux-designer.md)

PROJECT CONTEXT:
$(cat CLAUDE.md)

FEATURE SPEC:
$(cat claude-notes/features/[folder]/03-spec.md)

TASK INDEX:
$(cat claude-notes/features/[folder]/05-task-index.md)

TASK: Create UI/UX design specifications for all screens and components described in the feature spec. Include component specs with Tailwind CSS classes, all states (default/loading/empty/error/success), responsive behavior, and accessibility requirements. Save each design spec as a separate file."
```

## Output
- Design spec files in `claude-notes/features/[folder]/`
- User flow diagrams
- These are consumed by the Angular Expert Agent during build phase
