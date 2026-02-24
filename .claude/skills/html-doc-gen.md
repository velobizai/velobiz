# Skill: HTML Documentation Generation

## Purpose
Generate consistent, self-contained HTML documentation for both design (pre-implementation) and implementation (post-implementation) phases. All documents use the same professional styling and are viewable by opening directly in any browser.

## Base HTML Template
Every document MUST start with this template:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{DocTitle}} — {{Feature Name}}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; color: #1a1a1a; }
    h1 { color: #0052CC; border-bottom: 2px solid #0052CC; padding-bottom: 8px; }
    h2 { color: #172B4D; margin-top: 28px; border-bottom: 1px solid #DFE1E6; padding-bottom: 6px; }
    h3 { color: #42526E; margin-top: 20px; }
    code { background: #F4F5F7; padding: 2px 6px; border-radius: 3px; font-family: 'Menlo', 'Monaco', monospace; font-size: 14px; }
    pre { background: #F4F5F7; padding: 16px; border-radius: 6px; overflow-x: auto; border-left: 4px solid #0052CC; }
    pre code { background: none; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #DFE1E6; padding: 10px 12px; text-align: left; }
    th { background: #F4F5F7; font-weight: 600; }
    tr:nth-child(even) { background: #FAFBFC; }
    .info { background: #DEEBFF; border-left: 4px solid #0052CC; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0; }
    .warn { background: #FFFAE6; border-left: 4px solid #FF991F; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0; }
    .success { background: #E3FCEF; border-left: 4px solid #36B37E; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0; }
    .metadata { color: #6B778C; font-size: 0.9em; margin-bottom: 24px; }
    .toc { background: #F4F5F7; padding: 16px 20px; border-radius: 6px; margin: 16px 0; }
    .toc ul { list-style: none; padding-left: 0; }
    .toc li { margin: 4px 0; }
    .toc a { color: #0052CC; text-decoration: none; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: white; }
    .badge-get { background: #36B37E; }
    .badge-post { background: #0052CC; }
    .badge-put { background: #FF991F; }
    .badge-delete { background: #FF5630; }
    .badge-patch { background: #6554C0; }
    .coverage-bar { background: #DFE1E6; border-radius: 4px; height: 20px; position: relative; }
    .coverage-fill { background: #36B37E; border-radius: 4px; height: 100%; }
    a { color: #0052CC; }
  </style>
</head>
<body>
  <h1>{{DocTitle}}</h1>
  <div class="metadata">
    <strong>Feature:</strong> {{Feature Name}} &bull;
    <strong>Date:</strong> {{YYYY-MM-DD}} &bull;
    <strong>Phase:</strong> {{Design / Implementation}}
  </div>
  <!-- CONTENT -->
</body>
</html>
```

## Design Document Templates

### design-architecture.html
Key sections: Overview, System Context (Mermaid), Component Diagram (Mermaid), Data Flow, Technology Stack (table), Non-Functional Requirements, Risks & Mitigations (table).

Technology stack table row example:
```html
<tr><td>Frontend</td><td>Angular 19+</td><td>Angular Material 3+, Signals, standalone components</td></tr>
<tr><td>Backend</td><td>ASP.NET Core 6</td><td>CQRS, MediatR, EF Core</td></tr>
<tr><td>Database</td><td>MySQL 8.x</td><td>EF Core Pomelo provider, code-first migrations</td></tr>
```

### design-api-specification.html
Use HTTP verb badges for endpoints:
```html
<h3><span class="badge badge-get">GET</span> /api/v1/{{resource}}</h3>
<h3><span class="badge badge-post">POST</span> /api/v1/{{resource}}</h3>
<h3><span class="badge badge-put">PUT</span> /api/v1/{{resource}}/{{id}}</h3>
<h3><span class="badge badge-delete">DELETE</span> /api/v1/{{resource}}/{{id}}</h3>
```

Include JSON schemas in `<pre><code>` blocks and curl examples.

### design-technical.html
Include Mermaid ER diagram, class diagram, and sequence diagram. If using Mermaid, add this script before `</body>`:
```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
```

## Implementation Document Templates

### impl-summary.html
Files created table example:
```html
<h3>Backend (12 files)</h3>
<table>
  <tr><th>File</th><th>Purpose</th></tr>
  <tr><td><code>src/Domain/Entities/User.cs</code></td><td>User entity</td></tr>
</table>
```

### impl-test-coverage.html
Coverage bar visualization:
```html
<div class="coverage-bar" style="width: 200px;">
  <div class="coverage-fill" style="width: 92%;"></div>
</div>
<span>92%</span>
```

### impl-deployment.html
Must include these exact sections:
1. Pre-deployment checklist (HTML checkboxes)
2. Environment variables table
3. Database migration commands
4. Backend deployment steps
5. Frontend Vercel deployment steps
6. Post-deployment verification checklist
7. Rollback plan (frontend + backend + database)

### impl-release-notes.html
Two-audience format: user-facing section (non-technical) and developer-facing section (technical with API changes, migration commands, breaking changes).

## File Naming Convention
| Phase | Filename Pattern | Title Pattern |
|-------|-----------------|---------------|
| Design | `design-[type].html` | `[Design] [Type] — [Feature]` |
| Implementation | `impl-[type].html` | `[Implementation] [Type] — [Feature]` |

## Output Directory
```
docs/[feature-name]/
├── design-architecture.html
├── design-api-specification.html
├── design-technical.html
├── impl-summary.html
├── impl-test-coverage.html
├── impl-api-docs.html
├── impl-release-notes.html
├── impl-deployment.html
└── impl-retrospective.html
```

## Variables to Replace
- `{{Feature Name}}` — Human-readable feature name (e.g., "User Management")
- `{{feature-name}}` — kebab-case (e.g., "user-management")
- `{{DocTitle}}` — Full document title with phase prefix
- `{{YYYY-MM-DD}}` — Current date
- `{{resource}}` — API resource name in lowercase plural (e.g., "users")
