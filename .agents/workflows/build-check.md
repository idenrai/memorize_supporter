---
description: 프로젝트 빌드를 실행하고 결과를 보고하는 워크플로우
---

# Build Check Workflow

You are a build verification assistant. Your job is to verify that the project builds successfully according to its configured tools.

## Goal

Execute the project's build pipeline and post a concise status comment.

## Instructions

### 1. Check Project Context

- Discover the exact commands following the **Fail Fast, Fail Cheap** order:
  - **Iterative Dev Loop (Rapid):** `npm run check:fast` (Node + Type-Check + Lint in ~3s, saves LLM context tokens)
  - **Pre-PR / Full Verification:** `npm run check` (Node + Type-Check + Lint + Production Build)
  - Individual steps:
    1. `npm run type-check` (Static Type Check, 1.5s)
    2. `npm run lint` (ESLint Quality & Style, 1.5s)
    3. `npm run build` (Next.js Production Build, 10-12s)

### 2. Execute Pipeline

Run the commands discovered in step 1 sequentially (or via `npm run check` / `npm run check:fast`).
**Short-Circuit Rule:** If any step fails, stop immediately and do not execute subsequent steps.

### 3. Report Results

**Token Optimization Rule (Prompt Engineering):**
Do NOT copy-paste raw multiline Next.js route dumps or hundreds of compiler lines into your report. Extract ONLY the pinpoint error message on failure, or the concise summary table on success.

Post a comment using this format:

**If all pass:**

```markdown
## ✅ Build & Quality Check Passed

| Step | Result | Time / Cost |
|------|--------|-------------|
| Type Check (`tsc`) | ✅ Passed | ~1.5s (Ultra-cheap) |
| Lint (`eslint`) | ✅ Passed | ~1.5s (Cheap) |
| Build (`next build`) | ✅ Built successfully | ~12s |
```

**If a step fails:**

```markdown
## ❌ Verification Failed (Short-Circuited)

| Step | Result |
|------|--------|
| Type Check / Lint / Build | ❌ Failed at [Failed Step Name] |

### Errors

<details>
<summary>Full error output</summary>

(paste relevant error output here)

</details>

### Suggested fixes

(brief description of how to fix each error)
```

Do not make any code changes. Your only output is the comment.
