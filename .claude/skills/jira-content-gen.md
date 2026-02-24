# Skill: Jira Epic & Story Generation

## Purpose
Generate consistent Jira Epics and User Stories from feature specifications using Atlassian MCP.

## Epic Template
```
Title: [EPIC] {{Feature Name}}
Description:
## Summary
{{1-2 paragraph feature description}}

## Business Value
{{Why this feature matters}}

## Acceptance Criteria
- [ ] {{Criterion 1}}
- [ ] {{Criterion 2}}
- [ ] All tasks implemented with 80%+ test coverage
- [ ] Code reviewed and approved
- [ ] Design and implementation documentation complete

## Technical Scope
- **Backend**: {{.NET services/endpoints}}
- **Frontend**: {{Angular components/pages}}
- **Database**: {{MySQL tables/migrations}}

## Story Count: {{N}} stories
Labels: {{feature-name}}, {{sprint}}, fullstack
```

## Story Template
```
Title: [{{Layer}}] {{Task Title}}
Type: Story
Description:
## Task
{{What needs to be built}}

## Technical Details
{{Implementation specifics}}

## Files to Create/Modify
- `{{file1}}`
- `{{file2}}`

## Acceptance Criteria
- [ ] {{AC1}}
- [ ] {{AC2}}
- [ ] Unit tests with positive, negative, and edge case scenarios
- [ ] Code compiles and all tests pass

## Dependencies
- Blocked by: {{Task IDs or "None"}}

Story Points: {{1-8}}
Labels: {{layer}}, {{feature-name}}
```

## Layer-to-Label Mapping
| Layer | Label | Color |
|-------|-------|-------|
| [DB] | `database` | Purple |
| [API] | `backend` | Green |
| [UI] | `frontend` | Blue |
| [UIUX] | `design` | Orange |
| [TEST] | `testing` | Teal |
| [INFRA] | `infrastructure` | Gray |
