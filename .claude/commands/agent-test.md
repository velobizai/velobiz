# /agent-test — Chunk Unit Test Verification

## Usage
`/agent-test [feature-name] chunk-[N]`

## Description
Spawns the Tester Agent to verify unit test completeness and quality for a specific chunk. Marks chunk as DONE if all tests pass with adequate coverage.

## Prerequisites
- Chunk must be built and reviewed

## What Happens
1. Read `chunk-N.json` to identify chunk files and tasks
2. Spawn Tester Agent (chunk unit test mode)
3. Tester verifies:
   - Unit tests exist for ALL production code in the chunk
   - Each test file has positive + negative + edge case scenarios
   - All tests pass
   - Coverage ≥ 80% for chunk code
4. If gaps found → Tester generates missing tests
5. Run all tests: `dotnet test` and/or `ng test --watch=false`
6. If all pass and coverage ≥ 80%:
   - Mark chunk status as **DONE** in `chunk-N.json`
   - Update `05-task-index.md`: tasks → ✅ Done
7. Show summary with test results and coverage

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/tester.md)
MODE: CHUNK_UNIT_TESTS
PROJECT: $(cat CLAUDE.md)
CHUNK MANIFEST: $(cat claude-notes/features/[folder]/chunk-N.json)
CHUNK FILES: [Contents of production code and test files]
TASK: Verify unit test completeness for this chunk. Check positive/negative/edge coverage. Generate missing tests. Run all tests and report results."
```

## Next Step
- More chunks to build? → `/agent-build [feature] T[next] to T[end]`
- All chunks done? → `/agent-api-tests [feature]`
