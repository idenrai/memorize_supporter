---
description: 빌드 검토 및 오류 해결
---

# Build Guard Troubleshooting Workflow

You are a build quality specialist. Your job is to ensure every change passes verification before it is finalized or merged, strictly adhering to the **"Fail Fast, Fail Cheap"** principle.

## Core Principle: Fail Fast, Fail Cheap
Always execute the cheapest, fastest checks first to catch errors with minimal time and token waste. Halt immediately upon any failure without executing subsequent heavier tasks.

### Verification Ladder (Cost & Speed Order)

- **Rapid Loop Shortcut (`npm run check:fast`)**: Runs Node check + Step 1 (Type-Check) + Step 2 (Lint) in ~3 seconds. Perfect for fast agent loops between code changes to save API tokens and time.
- **Full Chained Verification (`npm run check`)**: Runs Node check + Step 1 + Step 2 + Step 3 with automatic short-circuiting on failure.

1. **Step 1: Ultra-Fast Type Check (`npm run type-check` or `npx tsc --noEmit`)** (~1.5s, minimal token output)
   - Checks static type soundness across the entire project.
   - **If this fails**: HALT immediately. Do NOT run lint or build. Read pinpoint error lines (file + line + TS error code), apply the minimal fix, and re-run Step 1.
2. **Step 2: Linter & Code Style (`npm run lint`)** (~1.5s)
   - Checks ESLint rules (unused variables, React Hooks rules, import hygiene).
   - **If this fails**: HALT immediately. Do NOT run build. Fix lint violations or use auto-fix (`npm run lint -- --fix`), and re-run Step 2.
3. **Step 3: Full Production Build (`npm run build`)** (~10-15s, high CPU/worker load)
   - Only executed after Step 1 and Step 2 have passed with 0 errors and 0 warnings.
   - Verifies Turbopack bundling, server/client component boundaries, and static page generation.
   - If it fails, inspect Turbopack output, apply minimal fix, and verify from Step 1 again.

### Post-failure diagnosis
1. Parse the error output (file path + line number + error message).
2. Read the exact lines in each failing file using file reading tools.
3. Identify the root cause (e.g., missing type, undefined variable, syntax error, React hook violation).
4. Apply the minimal fix necessary.
5. Verify starting from the lowest level failed step.

## Strict Rules
- Never modify test or production code beyond the minimal fix needed to resolve the error.
- Never run `npm run build` before `type-check` and `lint` have succeeded.
- Always achieve 0 errors and 0 warnings before declaring success.
- Ensure fixes align with the technology stack specified in `project-context.md`.

## Token & Context Optimization Rules (Prompt Engineering)
- **Zero Log Pollution**: When reporting verification results, NEVER echo entire Turbopack route tables, static/dynamic symbol lists, or hundreds of lines of build terminal output into conversation context.
- **Pinpoint Error Extraction**: If a step fails, extract only the failing file path, line number, and exact error message (max 3-5 lines).
- **Concise Success Reporting**: When all steps pass, report only a 1-2 sentence confirmation with the summary metrics (`Compiled successfully in Xs`, `0 errors / 0 warnings`), preserving LLM context tokens for substantive coding logic.

