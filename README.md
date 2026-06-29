# AI Agent Harness Template

This repository is a template designed to provide a highly optimized environment for AI Agents (e.g., Gemini, Claude, Cursor) by establishing a standardized structure for Rules, Workflows, Skills, and documentation.

By using this template when starting a new project, you can instantly set up a powerful AI Pair Programming environment regardless of the technology stack.

## 🚀 Getting Started

1. **Create Repository:** Create a new GitHub repository based on this template (Use the "Use this template" button on GitHub).
2. **Project Planning & Setup (REQUIRED):**
   - In your newly created repository, you MUST invoke the AI agent with the `/plan` command first.
   - The AI agent will refuse to write code if this step is skipped. During the planning phase, instruct the AI to update this `README.md` and `.agents/rules/project-context.md` to reflect your specific tech stack and project goals.
3. **Add Skills & MCPs:** Visit [skills.sh](https://www.skills.sh/) to find open-source skills that match your project's concept, and add them using the command `npx skills add <package> -y`. *(Tip: For the best experience, we highly recommend installing the [Context7](https://github.com/context7/mcp-server) and [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) MCP servers for the `/plan` workflow, and the [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github) for the `/solve-issue`, `/pr`, and `/prune` workflows.)*
4. **Customize Workflows & Rules:** If your project requires specific rules or workflows (e.g., tailored linting, specific deployment checks), add them to the `.agents/rules` or `.agents/workflows` directories.
5. **Route in AGENTS.md:** Ensure that any newly added rules, workflows, or skills are properly routed and referenced within `AGENTS.md`.
6. **Vibe Coding:** Start your full-fledged AI vibe coding experience!

## 📂 Structure Overview

- `.agents/rules/`: Core Rules that the agent must always follow, such as coding conventions, architecture guidelines, and security policies.
- `.agents/workflows/`: Step-by-step guides for the agent to execute specific situations (e.g., `/plan`, `/frontend`, `/review`).
- `.agents/skills/`: Tools and extensions available to the agent (e.g., prompt engineering, browser control, UI design).
- `.github/`: CI/CD workflows and Issue/PR templates.
- `doc/`: Default directory structure for project documentation.

---

# AI Agent Harness Template (한국어)

이 리포지토리는 AI 에이전트(예: Gemini, Claude, Cursor 등)가 프로젝트에 최적화된 방식으로 동작할 수 있도록 규칙(Rules), 워크플로우(Workflows), 스킬(Skills) 및 문서 구조를 템플릿화한 것입니다.

새로운 프로젝트를 시작할 때 이 템플릿을 사용하면, 실행 기술 스택에 얽매이지 않고 강력한 AI Pair Programming 환경을 즉시 구축할 수 있습니다.

## 🚀 시작하기

1. **저장소 생성:** 이 템플릿을 기반으로 새로운 GitHub 리포지토리를 생성합니다. (GitHub의 "Use this template" 버튼 활용)
2. **프로젝트 기획 및 설정 (필수 진행):**
   - 새 리포지토리 상에서 코딩을 시작하기 전, **반드시 AI 에이전트에게 `/plan` 명령을 내려** 새 프로젝트의 컨셉을 설계해야 합니다.
   - 이 단계를 건너뛸 경우 AI 에이전트는 코드 작성을 거부하도록 설정되어 있습니다. 기획 과정에서 이 `README.md` 문서와 `.agents/rules/project-context.md` 파일을 실제 사용할 기술 스택과 프로젝트 성격에 맞게 덮어쓰도록 지시하세요.
3. **스킬 및 MCP 추가:** [skills.sh](https://www.skills.sh/)에서 프로젝트 컨셉에 맞는 오픈소스 에이전트 스킬을 탐색하고, `npx skills add <package> -y` 명령어로 추가하세요. *(Tip: 최상의 경험을 위해 클라이언트에 [Context7](https://github.com/context7/mcp-server)과 [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)(`/plan` 워크플로우용), 그리고 [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)(`/solve-issue`, `/pr`, `/prune` 워크플로우용)를 연동하는 것을 강력히 권장합니다.)*
4. **사용자 정의 규칙 및 워크플로우 추가:** 프로젝트 전용 규칙이나 워크플로우가 필요하다면 동일한 방식으로 `.agents/` 내에 추가하세요.
5. **AGENTS.md 라우팅:** 새롭게 추가한 규칙, 워크플로우, 스킬이 에이전트에게 인식될 수 있도록 `AGENTS.md`에서 올바르게 라우팅하세요.
6. **바이브 코딩 시작:** AI를 활용한 본격적인 바이브 코딩(Vibe Coding)을 전개하세요!

## 📂 구조 설명

- `.agents/rules/`: 코딩 컨벤션, 아키텍처 지침, 보안 규칙 등 에이전트가 항상 지켜야 할 Core Rules.
- `.agents/workflows/`: 특정 상황(예: `/plan`, `/frontend`, `/review`)에서 에이전트가 수행해야 할 단계별 가이드.
- `.agents/skills/`: 에이전트가 사용할 수 있는 도구 및 확장 기능(프롬프트, 브라우저 제어, UI 디자인 등).
- `.github/`: CI/CD 워크플로우 및 이슈/PR 템플릿.
- `doc/`: 프로젝트 문서화를 위한 기본 디렉토리 구조.
