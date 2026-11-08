# Project Guidelines (SSoT)

이 파일은 AI 에이전트가 상황에 맞게 최신 규칙(Rules), 서브에이전트(Subagents), 스킬(Skills), 라이프사이클 훅(Hooks), MCP 도구를 탐색하고 오케스트레이션할 수 있도록 안내하는 Antigravity 2.0 단일 진실 공급원(SSoT) 마스터 라우팅 파일입니다.

---

## 📌 1. Core Rules (항상 준수)
코딩 전반에 적용되는 필수 규칙입니다. 작업 착수 전 반드시 해당 파일들을 준수하세요.

- **UI 텍스트 하드코딩 절대 금지 (Zero Hardcoded UI Text Policy - 절대 준수):**
  - 버튼, 제목, 본문, 라벨, 뱃지, 태그, 힌트, placeholder, `aria-label`, 토스트, 메타데이터 등 사용자가 보거나 스크린 리더가 읽는 모든 UI 문자열의 인라인 하드코딩을 엄격히 금지합니다.
  - 모든 텍스트는 반드시 `src/i18n/types.ts`에 정의하고 `ko.ts`, `en.ts`, `ja.ts` 3개 국어 딕셔너리에 100% 동기화한 뒤 `useT()`/`getT()`를 통해서만 참조해야 합니다.
- **원격 푸시 및 PR 생성 제한 (절대 준수):**
  - 에이전트는 어떠한 경우에도 임의로 `git push`를 실행하거나 Pull Request를 생성해서는 안 됩니다.
  - 원격 푸시 및 PR 생성은 오직 사용자가 `/pr`, `/solve-issue` 명령어를 명시적으로 입력하거나 푸시를 직접 지시했을 때만 수행할 수 있습니다. (로컬 커밋 및 빌드 검증 완료 후 작업을 중단하고 사용자에게 보고할 것)
- **언어 제어 전략 (100% 한국어 출력):** `.agents/rules/language-strategies.md`
- **프로젝트 아키텍처 & 스택:** `.agents/rules/project-context.md` (Next.js 15, React 19, Local-First)
- **보안 및 데이터 취급 원칙:** `.agents/rules/security.md`
- **GitHub 커밋 규약 (Conventional Commits):** `.agents/rules/git-commit-rules.md`
- **시니어 엔지니어 행동 규범 & 인덱싱 의식:** `.agents/rules/senior-engineer-conduct.md`, `.agents/rules/indexing-codebase.md`

---

## 🤖 2. Declarative Subagents (선언형 서브에이전트)
메인 컨텍스트를 오염시키지 않고 독립된 관점과 전용 도구 세트로 백그라운드 작업을 수행하는 서브에이전트입니다.

- **전문 코드 리뷰어 (`code-reviewer`):** `.agents/agents/code-reviewer.md` (Next.js App Router, Zero Hardcoded UI Text 감시, 로컬 퍼스트, 접근성 다각도 감사)
- **품질 게이트 검증자 (`quality-guard`):** `.agents/agents/quality-guard.md` (격리된 환경에서 Next.js 빌드, 정적 타입 검사, 린트, i18n 감사 일괄 검증 및 장애 분석)

---

## 🛠️ 3. Specialized Modern Skills (모던 스킬 및 슬래시 커맨드)
Antigravity 2.0 사양에 따라 모든 절차는 점진적 공개(Progressive Disclosure)를 준수하는 모듈형 스킬(`.agents/skills/<name>/SKILL.md`)로 구성됩니다.

- **심층 기술 조사 및 아키텍처 원인 규명 (`/deep-dive`):** `.agents/skills/deep-dive/SKILL.md` (Context7 공식 문서 교차검증 + Sequential Thinking 다단계 논리 분석)
- **품질 게이트 & Next.js 빌드 검증 (`/quality-gate`):** `.agents/skills/quality-gate/SKILL.md` (타입 체크, ESLint, i18n 동기화, 단위 테스트, Next.js 번들 빌드 일괄 검증)
- **다국어(i18n) 동기화 & 감사 (`/i18n`):** `.agents/skills/i18n/SKILL.md` (ko, en, ja 3개 국어 키 동기화 1초 감사 스크립트 내장)
- **다각도 전문 코드 리뷰 (`/review`, `/code-review`):** `.agents/skills/code-review/SKILL.md` (`code-reviewer` 서브에이전트 위임 및 UI 하드코딩 텍스트 전수 감사)
- **커밋 메시지 자동 생성 (`/commit`, `/commit-kr`):** `.agents/skills/commit/SKILL.md` (Conventional Commits 한영 규격)
- **문서 동기화 및 PR 자동 생성 (`/pr`):** `.agents/skills/pr/SKILL.md` (원격 푸시 제한 규칙 준수 및 `github-mcp-server` 연동)
- **원격 정리된 로컬 브랜치 일괄 정리 (`/prune`):** `.agents/skills/prune/SKILL.md` (`[gone]` 상태 고립 브랜치 감지, 보호 브랜치 보존 및 일괄 안전 삭제)
- **점진적 무중단 리팩토링 (`/refactor`):** `.agents/skills/refactor/SKILL.md` (Green Baseline, 6단계 파이프라인, 마틴 파울러 코드 스멜 카탈로그)
- **Next.js 모범 사례 & 개발 루프:** `.agents/skills/nextjs-best-practices/SKILL.md`, `.agents/skills/next-dev-loop/SKILL.md`
- **로컬 퍼스트(Local-First) 영속성 & 동기화:** `.agents/skills/local-first/SKILL.md`
- **고급 TypeScript 타입 분석:** `.agents/skills/typescript-expert/SKILL.md`
- **UI/UX 디자인 및 웹 가이드라인:** `.agents/skills/ui-ux-pro-max/SKILL.md`, `.agents/skills/frontend-design/SKILL.md`, `.agents/skills/design-taste-frontend/SKILL.md`, `.agents/skills/web-design-guidelines/SKILL.md`
- **SVG 로고 및 브랜드 심볼 디자인:** `.agents/skills/svg-logo-designer/SKILL.md`
- **키보드 탐색 및 고정 요소 디자인:** `.agents/skills/keyboard/SKILL.md`, `.agents/skills/sticky-and-fixed-elements/SKILL.md`, `.agents/skills/empty-state/SKILL.md`
- **브라우저 테스팅 및 시각적 차이 검증:** `.agents/skills/agent-browser/SKILL.md`, `.agents/skills/before-and-after/SKILL.md`
- **프로젝트 구조 리팩토링:** `.agents/skills/project-structure-refactoring/SKILL.md`, `.agents/skills/refactoring-patterns/SKILL.md`, `.agents/skills/safe-refactor/SKILL.md`
- **프로젝트 인덱싱 및 지식 컷오프 회피:** `.agents/skills/indexing-awareness/SKILL.md`, `.agents/skills/knowledge-cutoff-awareness/SKILL.md`

---

## 🛡️ 4. Lifecycle Hooks (생명주기 안전 가드)
- **PreToolUse 안전 가드 (`.agents/hooks.json`):**
  - 파괴적 셸 명령(`git push --force`, `git reset --hard`, `rm -rf`, `main` 브랜치 삭제, `--no-verify`)을 사전 차단하는 Node.js 고속 가드 (`.agents/hooks/scripts/block-dangerous-commands.cjs`).

---

## 🔌 5. Model Context Protocol (MCP 서버 연동)
- **GitHub MCP (`github-mcp-server`):** PR 생성, 이슈 조회, 커밋 히스토리 추적.
- **Context7 (`context7`):** Next.js 15, React 19 등 최신 프레임워크 공식 문서 실시간 교차검증.
- **Sequential Thinking (`sequential-thinking`):** 복잡한 문제의 다단계 논리 분석 및 가설 검증.
