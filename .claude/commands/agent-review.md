# /agent-review — Code Review with Reviewer Agent

## Usage
`/agent-review [feature-name] chunk-[N]`

## Description
Spawns the Reviewer Agent to perform a cross-stack code review on ONLY the files from the specified chunk.

## Prerequisites
- Chunk must be built (`chunk-N.json` exists with status "built" or "in-progress")

## What Happens
1. Read `chunk-N.json` to get the list of created/modified files
2. Read content of all chunk files
3. Spawn Reviewer Agent with file contents and project context
4. Reviewer produces `review-chunk-[N].md` with findings by severity
5. Lead Agent presents summary:
   - If **no Critical/High** → "Review complete. Proceed to `/agent-test`"
   - If **Critical/High found** → Ask user: "Fix automatically? (yes/no)"
6. If auto-fix approved:
   - Spawn appropriate layer agent (DotNet/Angular) with review findings + fix instructions
   - Re-run build and tests
   - Re-spawn Reviewer to verify fixes
7. Update chunk manifest with review status

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/reviewer.md)
PROJECT: $(cat CLAUDE.md)
CHUNK FILES:
[Contents of all files listed in chunk-N.json]
TASK: Review ONLY these files. Produce review-chunk-[N].md with findings by severity."
```

## Next Step
After review passes: `/agent-test [feature-name] chunk-[N]`
