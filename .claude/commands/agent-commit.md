# /agent-commit — Git Stage, Commit, and Push

## Usage
`/agent-commit [feature-name]`

## Description
Manages git operations for a feature: stages changed files, creates conventional commits per chunk, and pushes to remote. **The Lead Agent MUST ask the user for explicit confirmation before EVERY git write operation** (stage, commit, push).

## Prerequisites
- Feature must have at least one chunk with status DONE
- Git repository initialized (`git init` or cloned)
- Remote configured (`git remote -v` shows origin)

## ⚠️ CRITICAL: User Confirmation Required
This command involves irreversible operations. The Lead Agent MUST:
1. Show exactly what will happen BEFORE doing it
2. Wait for explicit "yes" / "approved" / "go ahead" from the user
3. NEVER auto-execute git write operations

## What Happens

### Step 1: Analyze Changes
1. Read all chunk manifests to identify files created/modified
2. Run `git status` to show current working tree state
3. Run `git diff --stat` to show change summary
4. Present the full list of files to the user

### Step 2: Create Feature Branch (if not already on one)
**ASK USER**: "I'll create branch `feature/[feature-name]` from `main`. Proceed?"
```bash
git checkout main
git pull origin main
git checkout -b feature/[feature-name]
```

### Step 3: Stage Changes (per chunk)
For each completed chunk:
**ASK USER**: "Ready to stage [N] files from chunk-[X]? Here are the files: [list]. Proceed?"
```bash
git add [files from chunk manifest]
```

### Step 4: Commit (per chunk)
Generate commit message using GitHub Agent conventions.
**ASK USER**: "Commit message will be:\n```\nfeat(db): create users table and migration\n\n- Add User entity with EF Core config\n- Create migration 20260214_AddUsersTable\n\nImplements: T01, T02\n```\nProceed with this commit?"
```bash
git commit -m "[generated message]"
```

### Step 5: Push to Remote
After all chunks are committed:
**ASK USER**: "Push `feature/[feature-name]` ([N] commits) to origin? Proceed?"
```bash
git push origin feature/[feature-name]
```

### Step 6: Show Summary
Display git operations report from GitHub Agent format.
Suggest creating a Pull Request with a template.

## Sub-Agent Spawn Command
```bash
claude -p "$(cat .claude/agents/github.md)

PROJECT: $(cat CLAUDE.md)

FEATURE: [feature-name]

CHUNK MANIFESTS:
$(cat claude-notes/features/[folder]/chunk-*.json)

TASK INDEX:
$(cat claude-notes/features/[folder]/05-task-index.md)

TASK: Generate conventional commit messages for each chunk and a pull request description. Return structured output with branch name, commit messages per chunk, and PR template."
```

## Confirmation Flow Example
```
Lead Agent: I've analyzed the changes for feature "user-management":

📂 Files to commit:
  Chunk 1 (DB + API): 15 files added, 2 modified
  Chunk 2 (UI): 8 files added, 1 modified

🌿 Branch: feature/user-management (will create from main)

Shall I proceed with creating the feature branch?
> User: yes

✅ Branch created. Now staging chunk-1 files (15 added, 2 modified):
  src/Domain/Entities/User.cs
  src/Infrastructure/Persistence/UserConfiguration.cs
  ...

Stage these files?
> User: yes

✅ Staged. Commit message:
  feat(api): implement user management CRUD

  - Add User entity, repository, and EF configuration
  - Add UserController with GET/POST/PUT/DELETE endpoints
  - Add MediatR handlers with FluentValidation
  - Add unit tests (92% coverage)

  Implements: T01, T02, T03

Commit with this message?
> User: yes

✅ Committed (abc1234). Now staging chunk-2...
[...repeat for each chunk...]

All chunks committed. Push to origin/feature/user-management?
> User: yes

✅ Pushed. Create a Pull Request on GitHub with the generated description?
```

## Next Step
After push: `/agent-deploy [feature-name]` (for Vercel deployment) or create PR manually on GitHub.
