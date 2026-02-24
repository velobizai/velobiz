# /agent-e2e-tests — Feature-Wide E2E/UI Tests

## Usage
`/agent-e2e-tests [feature-name]`

## Description
Spawns the Tester Agent to generate and run feature-wide E2E tests using Playwright. Runs AFTER all chunks are complete. Skipped if the feature has no UI components.

## Prerequisites
- ALL chunks must have status "DONE"
- Feature must have `[UI]` tasks — otherwise skip with message

## What Happens
1. Validate all chunks complete + UI tasks exist
2. Read UI/UX design specs and feature spec
3. Spawn Tester Agent (E2E test mode)
4. Tester generates Playwright tests with Page Object Model:
   - Happy path user flows
   - Error path scenarios
   - Edge cases (empty states, large data, slow connections)
   - Accessibility checks
5. Run E2E tests: `npx playwright test`
6. Generate `e2e-test-report.md`

## Next Step
After E2E tests pass: `/agent-final-docs [feature]`
