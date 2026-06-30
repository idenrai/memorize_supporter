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

## 2. Visual Design & UI/UX (공통 지침)
- **컴포넌트 수정 및 생성 시:** 기존 프로젝트의 톤앤매너(색상, 여백, 타이포그래피 등) 일관성을 엄격히 유지합니다.
- **반응형 검증:** 항상 모바일 우선(Mobile-first) 레이아웃을 고려하며, 선택된 CSS 프레임워크의 반응형 유틸리티를 활용하여 여백과 크기를 세밀하게 조정합니다.
- UI/UX 변경 시 항상 `.agents/skills/ui-ux-pro-max/SKILL.md`와 `.agents/skills/frontend-design/SKILL.md`를 우선 참조하여 퀄리티 컨트롤을 적용합니다.
- UI 텍스트 작성 시 '디자인 속 글쓰기' 가이드(능동태, 명확한 동사, 일관성 있는 사이니지)를 준수합니다.

## 3. 구조화 및 리팩토링
- 모든 컴포넌트와 모듈은 해당 기술 스택의 모범 사례(Best Practices)에 맞춰 작성합니다.
- 복잡한 로직은 뷰(View) 렌더링과 분리하여 테스트 가능한 유틸리티나 컴포저블/훅으로 분리합니다.
- 내부 모듈 임포트 시, 프로젝트에 설정된 절대 경로(Absolute Path, 예: `@/` 또는 `~/`) 별칭(Alias)이 있다면 적극 활용합니다.

## 4. 다국어 지원 (i18n) 동기화
프로젝트에 다국어 지원이 설정되어 있는 경우, 컴포넌트 내에 사용자에게 노출되는 하드코딩된 텍스트를 피하고 반드시 i18n 번역 키와 로캘 파일을 동기화합니다.
