---
description: Commit and push to main
allowed-tools: Bash(git*), Bash(bun typecheck), Bash(bun format)
---

# Commit to Main

## When to use

- User asks to commit current changes.
- User runs `/commit` with optional `$ARGUMENTS` describing the change.

## Workflow

1. **Gather context:**
   - Run `git status` (never use `-uall`), `git diff`, and `git log --oneline -5`.
   - Confirm you are on `main`. If not, abort and tell the user.

2. **Stage changes:**
   - Use `git add <files>` — stage only relevant files.
   - Never stage `.env`, credentials, or secrets.

3. **Validate:**
   - Run `bun typecheck && bun format`.
   - If either fails, report the errors and stop. Do not commit.

4. **Commit:**
   - Write a commit message following **Conventional Commits**:
     - Format: `type: short description`
     - Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `ci`, `build`
     - Keep the subject line under 72 characters.
     - Use imperative mood ("add feature", not "added feature").
     - Add a body only when the *why* isn't obvious from the subject.
   - Use a HEREDOC to pass the message:
     ```
     git commit -m "$(cat <<'EOF'
     type: subject line

     Optional body explaining why.
     EOF
     )"
     ```
   - Never use `--no-verify`.

5. **Push:**
   - Run `git push`.

## Output

1. Files staged.
2. Commit hash and message.
3. Push result.

## Guardrails

- Only commit on `main`. Abort on any other branch.
- If there are no changes, report and stop.
- No destructive git operations (`--force`, `reset --hard`, etc.).
- No amending or rebasing unless explicitly requested.
