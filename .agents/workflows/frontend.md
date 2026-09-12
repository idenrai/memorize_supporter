---
description: 프론트엔드 UI/UX 컴포넌트 신규 생성, 수정 및 리팩토링
---

# Frontend Engineering Workflow

**Activation:** `/frontend` (또는 프론트엔드 UI/UX 컴포넌트, 페이지, 상태 관리 로직 등의 신규 생성 및 수정을 진행할 때)

이 워크플로우는 프론트엔드와 관련된 생성, 수정, 리팩토링, 디자인 개선의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다.

## 1. 기술 스택 확인 (필수)
- 작업 시작 전 반드시 `.agents/rules/project-context.md`를 읽고 현재 프로젝트에 설정된 **프론트엔드 프레임워크, 스타일링 방식, 상태 관리 도구**를 확인합니다.
- 어떠한 특정 기술(React, Vue, Tailwind 등)도 임의로 가정하지 않으며, 오직 `project-context.md`에 명시된 기술 스택과 아키텍처 원칙을 철저히 준수합니다.
- **Next.js & TypeScript 스킬 참조:**
  - 서버 컴포넌트(RSC)와 클라이언트 컴포넌트를 분리하거나 데이터를 패칭할 때 `.agents/skills/nextjs-best-practices/SKILL.md`를 숙지하여 렌더링 최적화를 달성합니다.
  - 프론트엔드 상태, Props, 컴포저블 훅 등의 정밀한 타입 검증이 필요하면 `.agents/skills/typescript-expert/SKILL.md`를 참조합니다.
  - 컴포넌트 수정 후 UI 및 런타임 동작을 최종 확인할 때는 `.agents/skills/next-dev-loop/SKILL.md`를 바탕으로 라이브 검증을 수행합니다.
  - **로컬 퍼스트 & 클라이언트 DB 연동 시:** 브라우저 로컬 모드(BYOD), 클라이언트 상태 동기화, IndexedDB 연동, `BroadcastChannel` 다중 탭 이벤트 수신 및 스토리지 용량 진단(`getStorageEstimate`) UI 구현 시 `.agents/skills/local-first/SKILL.md`를 참조합니다.
  - **AI 프롬프트 생성기 및 템플릿 UI 작업 시:** 데이터 준비 덱 생성기(`aiPromptGenerator`), 덱 변환 프롬프트(`promptFormat`), 오답 튜터 질문(`aiDeepPrompt`) 등 AI 프롬프트와 관련된 컴포넌트나 다국어 템플릿을 신규 생성/수정할 때는 반드시 `.agents/workflows/prompt.md` 워크플로우를 참조하여 템플릿 품질과 일관성을 보장합니다.

## 2. Visual Design & UI/UX (공통 지침 - 항상 준수)
- **컴포넌트 수정 및 생성 시:** 기존 프로젝트의 톤앤매너(색상, 여백, 타이포그래피 등) 일관성을 엄격히 유지합니다.
- **반응형 검증:** 항상 모바일 우선(Mobile-first) 레이아웃을 고려하며, 선택된 CSS 프레임워크의 반응형 유틸리티를 활용하여 여백과 크기를 세밀하게 조정합니다.
- **UI/UX & 웹 접근성 스킬 상시 필수 적용:**
  - UI/UX 설계, 컴포넌트 룩앤필 및 레이아웃 변경 시 반드시 `.agents/skills/ui-ux-pro-max/SKILL.md` 및 `.agents/skills/frontend-design/SKILL.md`를 우선 참조하여 프로 수준의 디자인 완성도를 도출합니다.
  - 작업 완료 전 반드시 `.agents/skills/web-design-guidelines/SKILL.md`를 통해 웹 접근성(WAI-ARIA, 색상 대비 4.5:1 이상, 명시적 트랜지션, 최소 터치 타겟 44px, 모션 리듀스 등) 적합성을 필수로 감사(Audit)합니다.
- **UI 텍스트 작성 시:** '디자인 속 글쓰기' 가이드(능동태, 명확한 동사, 일관성 있는 사이니지)를 준수하며 제로 하드코딩 원칙을 철저히 지킵니다.

## 3. 구조화 및 리팩토링
- 모든 컴포넌트와 모듈은 해당 기술 스택의 모범 사례(Best Practices)에 맞춰 작성합니다.
- 복잡한 로직은 뷰(View) 렌더링과 분리하여 테스트 가능한 유틸리티나 컴포저블/훅으로 분리합니다.
- 내부 모듈 임포트 시, 프로젝트에 설정된 절대 경로(Absolute Path, 예: `@/` 또는 `~/`) 별칭(Alias)이 있다면 적극 활용합니다.

## 4. 다국어 지원 (i18n) 및 UI 하드코딩 제로(Zero Hardcoding) 체크리스트
- **하드코딩 0개 원칙:** 컴포넌트 내에 사용자 대면 텍스트, 버튼 라벨, 뱃지, 태그, `placeholder`, `aria-label`, 페이지 메타데이터 등을 직접 문자열 리터럴로 작성하는 것을 금지합니다.
- **동기화 파이프라인 준수:**
  1. `src/i18n/types.ts`: 신규 번역 키의 타입 정의 추가
  2. `src/i18n/ko.ts`, `src/i18n/en.ts`, `src/i18n/ja.ts`: 3개 국어에 동일한 키와 언어별 번역값 100% 동기화 (누락 금지)
  3. 컴포넌트에서 `const t = useT()` 또는 서버 컴포넌트에서 `getT(lang)`을 호출하여 바인딩
- **사후 자가 점검:** 작업 후 스테이징 전 `git diff`를 전수 조사하여 JSX 내에 하드코딩된 한글/영어/일본어 문자열이 단 하나도 남아있지 않은지 검증합니다.

## 5. Tailwind CSS v4 캐노니컬 클래스 및 진단(Diagnostics) 검증
- 컴포넌트 및 스타일 작성/수정 시, Tailwind CSS v4의 공식 캐노니컬 클래스 규칙을 철저히 준수합니다:
  - 그라디언트: `bg-gradient-to-*` 대신 **`bg-linear-to-*`** 사용
  - 플렉스 축소/확장: `flex-shrink-*` 대신 **`shrink-*`**, `flex-grow-*` 대신 **`grow-*`** 사용
  - 스케일/사이징: 분수/소수점 캐노니컬 클래스(예: `min-w-17.5`, `h-13`, `p-px` 등) 및 `@theme` 토큰 우선 활용
  - CSS 변수 바인딩: `top-[var(--header-height,4rem)]` 대신 **`top-(--header-height)`** 사용
- 작업 완료 전 CSS 충돌(`tailwindcss(cssConflict)`) 및 캐노니컬 제안(`tailwindcss(suggestCanonicalClasses)`) 등의 린트/진단 검출 결과가 남아있지 않은지 필히 확인합니다.

## 6. ESLint 및 맞춤법(cSpell) 진단 검증
- **ESLint 무결성 검증:** 미사용 변수/임포트(`@typescript-eslint/no-unused-vars`), 불필요한 `any` 타입(`@typescript-eslint/no-explicit-any`)이 없도록 `npm run lint`를 실행하여 0 error / 0 warning 상태를 필수로 확인하고 유지합니다.
- **cSpell 맞춤법 검사 준수:** 변수명, 유틸리티 클래스명, UI 텍스트에 오탈자가 없도록 확인하고, 프로젝트 고유 도메인 용어나 약어(예: `nums`, `tabular`, `turbopack` 등)는 `.vscode/settings.json`의 `cSpell.words` 사전에 등록하여 관리합니다.
