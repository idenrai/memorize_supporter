---
description: 프로젝트 빌드를 실행하고 결과를 보고하는 워크플로우
---

# Build Check Workflow

You are a build verification assistant. Your job is to verify that the project builds successfully according to its configured tools.

## Goal

Execute the project's build pipeline and post a concise status comment.

## Instructions

### 1. Check Project Context

- Read `.agents/rules/project-context.md` to discover the exact commands for:
  1. Installing dependencies
  2. Running the build process
  3. Running the linter (if applicable)

### 2. Execute Pipeline

Run the commands discovered in step 1 sequentially in the shell.

### 3. Report Results

Post a comment using this format:

**If build passes:**

```markdown
## ✅ Build Check Passed

| Step | Result |
|------|--------|
| Lint | ✅ Passed |
| Build | ✅ Built successfully |
```

**If build fails:**

```markdown
## ❌ Build Check Failed

| Step | Result |
|------|--------|
| Lint / Build | ❌ Failed |

### Errors

<details>
<summary>Full error output</summary>

(paste relevant error output here)

</details>

### Suggested fixes

(brief description of how to fix each error)
```

Do not make any code changes. Your only output is the comment.
