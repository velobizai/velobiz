# /agent-plan — Feature Planning with Planner Agent

## Usage
`/agent-plan [feature-name]`

## Description
Conducts a structured interview, then spawns the Planner Agent to generate feature specifications and task breakdown.

## Interview Rounds (Lead Agent conducts)

### Round 1: Context (3 questions)
1. What is the business problem this feature solves? Who are the target users?
2. What are the success criteria? How will you measure if this feature is working?
3. Are there any existing systems, APIs, or databases this integrates with?

### Round 2: Requirements (3 questions)
4. What are the core capabilities this feature needs? (List the must-haves)
5. What data does this feature create, read, update, or delete? Describe the entities.
6. What API endpoints do you envision? (e.g., GET /items, POST /items, etc.)

### Round 3: UI/UX (3 questions)
7. Does this feature have a user interface? If yes, describe the screens/pages.
8. What UI components are needed? (tables, forms, cards, modals, charts, etc.)
9. Are there any specific design requirements? (brand colors, existing design system, etc.)

### Round 4: Constraints (2 questions)
10. What are the non-functional requirements? (performance targets, scalability, security)
11. Are there any technical constraints or preferences? (specific libraries, patterns, hosting)

### Round 5: Confirmation (2 questions)
12. Is there anything else important that we haven't covered?
13. [Show summary of all answers] — Does this accurately capture your requirements?

## After Interview
1. Save all answers to `claude-notes/features/[YYYY-MM]-$ARGUMENTS/interview-context.md`
2. Create feature folder: `claude-notes/features/[YYYY-MM]-$ARGUMENTS/`
3. Spawn Planner Agent with interview context + CLAUDE.md
4. Planner generates: 01-context.md, 02-interview.md, 03-spec.md, 04-decisions.md, 05-task-index.md, tasks/T01-TNN.md, execution-log.md
5. Show plan summary to user

## Approval Loop
After showing the plan:
- User says **"approved"** → Lock plan, proceed to next phase
- User gives **feedback** → Re-spawn Planner with: original context + current plan + revision request
- User says **"show details T01"** or **"show spec"** → Display requested file
- Loop until explicit approval

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/planner.md)

PROJECT CONTEXT:
$(cat CLAUDE.md)

INTERVIEW ANSWERS:
$(cat claude-notes/features/[folder]/interview-context.md)

TASK: Generate all feature specification files for the feature described in the interview answers. Create files in claude-notes/features/[folder]/.
Output each file with its path clearly marked."
```
