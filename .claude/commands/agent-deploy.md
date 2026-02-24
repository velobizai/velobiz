# /agent-deploy — Deploy to Vercel

## Usage
`/agent-deploy [feature-name]`

## Description
Generates deployment instructions and configuration for Vercel, then optionally executes the deployment. **The Lead Agent MUST ask the user for explicit confirmation before ANY deployment action** (preview or production).

## Prerequisites
- All chunks DONE, tests passed
- Code committed and pushed (run `/agent-commit` first)
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account linked (`vercel login`)

## ⚠️ CRITICAL: User Confirmation Required
Deployment is an irreversible production action. The Lead Agent MUST:
1. Show the pre-deployment checklist BEFORE any deployment
2. Wait for explicit "yes" / "approved" / "deploy" from the user
3. NEVER auto-deploy to preview or production

## What Happens

### Step 1: Generate Deployment Configuration
1. Spawn Vercel Agent to generate:
   - `vercel.json` configuration (if not exists)
   - Pre-deployment checklist
   - Environment variables list
   - Deployment instructions document (HTML format in `docs/[feature-name]/`)
2. Save deployment instructions to `docs/[feature-name]/deployment-instructions.html`

### Step 2: Pre-Deployment Checklist
Present to user:
```
📋 PRE-DEPLOYMENT CHECKLIST — [feature-name]

Build:
  [ ] ng build --configuration=production succeeds
  [ ] No TypeScript errors
  [ ] Bundle size acceptable

Tests:
  [ ] All unit tests pass
  [ ] API integration tests pass
  [ ] E2E tests pass (if applicable)

Environment:
  [ ] API_BASE_URL set in Vercel for target environment
  [ ] Backend API deployed and healthy
  [ ] Database migrations applied

Configuration:
  [ ] vercel.json present and valid
  [ ] .gitignore excludes dist/, node_modules/, bin/, obj/
  [ ] Security headers configured

Shall I proceed with deploying to Preview first?
```

### Step 3: Deploy to Preview
**ASK USER**: "Deploy to Vercel Preview environment? This creates a temporary URL for testing."
```bash
vercel deploy
```
- Capture and display the preview URL
- Show build logs summary
- Present verification checklist

### Step 4: Verify Preview
**ASK USER**: "Preview is live at [URL]. Please verify, then confirm to proceed to Production — or say 'rollback' to cancel."

### Step 5: Deploy to Production
**ASK USER**: "Deploy to Production? This will make the changes live at your production URL."
```bash
vercel deploy --prod
```

### Step 6: Post-Deployment Report
Generate deployment report (HTML format) and save to `docs/[feature-name]/deployment-report.html`.

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/vercel.md)

PROJECT: $(cat CLAUDE.md)

FEATURE SPEC:
$(cat claude-notes/features/[folder]/03-spec.md)

TASK INDEX:
$(cat claude-notes/features/[folder]/05-task-index.md)

EXISTING VERCEL CONFIG:
$(cat vercel.json 2>/dev/null || echo 'No vercel.json found')

TASK: Generate vercel.json configuration, pre-deployment checklist, deployment instructions document (in HTML format), and deployment report template. Include environment variables needed, security headers, and rollback plan."
```

## Confirmation Flow Example
```
Lead Agent: I've prepared deployment for feature "user-management":

📋 Pre-Deployment Checklist:
  ✅ Build succeeds (ng build --configuration=production)
  ✅ 48 unit tests pass, 92% coverage
  ✅ 12 API tests pass
  ✅ vercel.json configured

⚠️ Environment Variables Needed:
  API_BASE_URL → must be set in Vercel Dashboard

Would you like to deploy to Preview first?
> User: yes

🚀 Deploying to Preview...
✅ Preview deployed: https://user-mgmt-abc123.vercel.app

Please verify the preview, then say "production" to go live, or "rollback" to cancel.
> User: production

🚀 Deploying to Production...
✅ Production deployed: https://yourapp.vercel.app

📄 Deployment report saved to docs/user-management/deployment-report.html
```

## Output Files
- `vercel.json` — Vercel project configuration (project root)
- `docs/[feature-name]/deployment-instructions.html` — Full deployment guide
- `docs/[feature-name]/deployment-report.html` — Post-deployment report

## Next Step
After deployment: `/agent-status [feature-name]` to see the complete feature status including deployment.
