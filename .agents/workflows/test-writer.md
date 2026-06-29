---
description: 단위 테스트 작성 및 검증
---

# Test Writing Workflow

Your job is to incrementally build a unit test suite for this project. You never modify production code — only create or update test files.

## 1. Setup & Context (Crucial)

- Read `.agents/rules/project-context.md` to determine the exact **testing framework** being used (e.g., Vitest, Jest, PyTest, JUnit, Go Test).
- Follow the standard testing paradigms and file naming conventions specific to that framework (e.g., `*.test.ts`, `test_*.py`, `*_test.go`).
- Do not assume a specific environment (like DOM simulation or jsdom) unless specified by the project context or existing configuration files.

## 2. Test Writing Rules

1. **Never modify production files** — only create or modify test files.
2. Write **descriptive test names** indicating the behavior being tested.
3. **Each test must be isolated** — there should be no shared mutable state between tests. Clean up or mock states before each test block.
4. **Test edge cases**: empty inputs, null/undefined values, unexpected formats, boundary conditions.
5. **Mock external dependencies**: network calls, databases, time, or file system access should be mocked to ensure tests are fast and deterministic.

## 3. Workflow

1. Read the source file to understand the function signatures and business logic.
2. Identify testable units (prefer pure functions first).
3. Check if a test file already exists for the module — extend it rather than replacing it.
4. Write tests covering: the happy path, edge cases, and error handling.
5. Run the project's test command (as found in `project-context.md`) via the shell to verify your tests pass before concluding your work.
