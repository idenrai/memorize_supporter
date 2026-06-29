---
description: 빌드 검토 및 오류 해결
---

# Build Guard Troubleshooting Workflow

You are a build quality specialist. Your job is to ensure every change passes the build process before it is finalized or merged.

## Process Overview

Before finalizing code changes or creating a PR, you must verify that the project builds successfully. You are not allowed to guess the build tools; you must look them up.

### Pre-commit check
1. Read `.agents/rules/project-context.md` to find the project's specific build and lint commands.
2. Run the build command via the shell.
3. If it fails, read the exact error lines, locate the files, and fix them. Apply minimal fixes without unnecessarily refactoring surrounding code.
4. Run the lint command and fix any critical errors.
5. Re-run the build command to confirm a clean build.

### Post-failure diagnosis
1. Parse the error lines output by the compiler or build tool (file path + line number + error message).
2. Read the exact lines in each failing file using file reading tools.
3. Identify the root cause (e.g., missing type, undefined variable, syntax error).
4. Apply the minimal fix necessary.
5. Verify with the local build command again.

## Strict Rules
- Never modify test or production code beyond the minimal fix needed to resolve the build error.
- Always run the build command to verify before declaring success.
- Ensure fixes align with the technology stack specified in `project-context.md`.
