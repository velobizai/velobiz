# /agent-api-tests — Feature-Wide API Integration Tests

## Usage
`/agent-api-tests [feature-name]`

## Description
Spawns the Tester Agent to generate and run feature-wide API integration tests. Runs AFTER all chunks are complete.

## Prerequisites
- ALL chunks must have status "DONE" in their manifests
- Command validates this before proceeding — refuses to run if any chunk is incomplete

## What Happens
1. Validate all chunks are complete
2. Read feature spec for all API endpoints
3. Spawn Tester Agent (API test mode) with spec + actual code context
4. Tester generates integration tests using WebApplicationFactory:
   - Each endpoint: success, validation failure, not found, unauthorized
   - Cross-endpoint workflows (CRUD lifecycle)
   - Request/response contract verification
   - Error response format verification
5. Run integration tests: `dotnet test --filter Category=Integration`
6. Generate `api-test-report.md` with results
7. If failures → report to user for decision

## Next Step
After API tests pass: `/agent-e2e-tests [feature]` (if UI) or `/agent-final-docs [feature]`
