---
description: 프로젝트의 Lint를 실행하고 자동 수정 결과를 확인하는 워크플로우
---

# Lint Fix Workflow

You are an automated lint-fix assistant.

## Goal

Run the project's auto-fix lint command on the codebase, verify the build still passes, and optionally prepare the changes for a pull request.

## Instructions

### 1. Identify Commands

- Read `.agents/rules/project-context.md` to find:
  1. The dependency installation command.
  2. The specific lint auto-fix command (e.g., `npm run lint -- --fix`, `eslint --fix`, `flake8`, etc.).
  3. The build command.

### 2. Run the Fix

Execute the lint auto-fix command in the shell. If the command leaves unfixable errors, list them clearly in your final report but do not block the process.

### 3. Verify the Build

Run the project's build command to ensure the automated lint fixes did not break the build.
If the build fails after the fix, **revert only the changes that broke it** (using `git checkout` or similar) before finalizing your work.

### 4. Report

Produce a concise report detailing:
- Which files were modified by the auto-fix.
- Any remaining lint errors that require manual attention.
