# Project Context & Architecture Master (SSoT)

## 1. Project Overview

`memorize_supporter`는 플래시카드, 4지선다형 문제(Practice Quiz), 영단어(Vocabulary) 등 다양한 지식을 인지 과학 기반의 능동적 회상(Active Recall)과 분산 반복을 통해 효과적으로 암기할 수 있도록 돕는 범용 지식 학습 웹 애플리케이션입니다.

### 핵심 기능
- **연습 및 시험 모드 (Practice & Exam Modes)**: 자유로운 카드 플립 연습과 실전 점수 측정 및 문항별 오답 상세 기록을 제공하는 시험 모드.
- **오답 재응시 (Retry Incorrect)**: 시험 후 틀린 문항만을 모아 즉시 재학습하는 스마트 피드백 루프.
- **다국어 지원 (i18n)**: 한국어(`ko`), 영어(`en`), 일본어(`ja`) 3개 국어를 완전 지원하는 동적 라우팅 및 딕셔너리 시스템.
- **웹 기반 덱 관리 및 데이터 준비 (Management & Preparation)**: 웹 인터페이스를 통한 JSON 덱 업로드, 제목/시리즈 수정, 숨김/삭제 및 대화형 덱 데이터 생성기.

---

## 2. Tech Stack Matrix

| 영역 | 기술 / 라이브러리 | 버전 / 비고 |
| :--- | :--- | :--- |
| **Framework & Engine** | Next.js (App Router) | 16.2.9 (Turbopack 번들러 기본 활성화) |
| **Core UI** | React / React DOM | 19.2.4 (`useTransition`, Server Components) |
| **Language** | TypeScript | 5.x (`strict: true`, 강제 단언 0% 지향) |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss`, `@theme` 토큰 기반 CSS 변수 바인딩 |
| **Animations & Icons** | Framer Motion / Lucide React | 12.x / 최신 아이콘 세트 |
| **State Management** | RSC / React Hooks / Zustand | 5.x (클라이언트 전역 상태 보조) |
| **Backend & Actions** | Next.js Server Actions | `src/actions/` (`safe-action.ts` + Zod 스키마 검증) |
| **Schema Validation** | Zod | 3.x/4.x (런타임-컴파일타임 일체형 검증) |
| **Database & ORM** | SQLite / Prisma ORM | Prisma 6.19.x (로컬 `.data/dev.db`) |
| **Toast & Feedback** | Sonner | 2.x (비동기 액션 성공/실패 토스트) |
| **Internationalization** | Next.js Middleware + i18n | `negotiator`, `@formatjs/intl-localematcher`, `useT()` |

---

## 3. Command Reference

- **Development Server:** `npm run dev` (Next.js dev 서버 및 브라우저 자동 오픈)
- **Build for Production:** `npm run build` (Turbopack + TypeScript 엄격 검증)
- **Linting & Code Quality:** `npm run lint` (ESLint 0 errors / 0 warnings 필수)
- **Database Push (Schema Sync):** `npx prisma db push`
- **Prisma Studio (DB GUI):** `npx prisma studio`
- **ETL Data Import Script:** `npm run etl` (`input/` 폴더 내 JSON 덱을 SQLite DB로 적재)

---

## 4. Project Structure

```
memorize_supporter/
├── .agents/                    # AI 에이전트 규칙(SSoT), 워크플로우, 스킬 세트
│   ├── rules/                  # project-context.md, security.md, git-commit-rules.md
│   ├── workflows/              # frontend.md, backend.md, plan.md, review.md 등
│   └── skills/                 # typescript-expert, nextjs-best-practices 등
├── .vscode/
│   └── settings.json           # ESLint 자동 포맷팅, 파일 네스팅, cSpell 사전 관리
├── input/                      # 오프라인 JSON 덱 데이터 및 템플릿 파일
├── prisma/
│   └── schema.prisma           # Prisma 스키마 (Deck, Card, LearningProgress, ExamResult, ExamResultDetail)
├── src/
│   ├── actions/                # Next.js Server Actions (deck.ts, progress.ts, records.ts)
│   ├── app/                    # Next.js App Router
│   │   ├── [lang]/             # 다국어 동적 라우트 세그먼트 (ko, en, ja)
│   │   │   ├── data-management/    # 덱 업로드/수정/삭제 관리 페이지
│   │   │   ├── data-preparation/   # 대화형 JSON 덱 작성/검증 페이지
│   │   │   ├── deck/[deckId]/      # 학습 플레이어 (연습/시험 모드)
│   │   │   ├── records/            # 시험 기록 대시보드
│   │   │   │   └── [examId]/       # 시험 결과 상세 및 오답 다시 풀기
│   │   │   ├── error.tsx           # 전역 에러 바운더리
│   │   │   ├── loading.tsx         # 전역 로딩 스켈레톤
│   │   │   └── page.tsx            # 메인 대시보드 (덱 갤러리)
│   │   ├── globals.css         # Tailwind CSS v4 테마 및 커스텀 유틸리티
│   │   └── icon.png            # 파비콘 및 앱 아이콘
│   ├── components/             # 프레젠테이션 및 인터랙티브 UI 컴포넌트
│   │   ├── cards/              # DeckPlayer, QuizHeader, ExamResultView, PracticeQuizCard 등
│   │   ├── home/               # DeckGallery, DeckList, SearchAndFilter
│   │   ├── layout/             # Header, Navigation
│   │   ├── management/         # DeckTable, UploadZone
│   │   ├── preparation/        # DataPreparationClient, JsonEditor, TemplateSelector
│   │   └── ui/                 # CustomSelect 등 공통 UI 요소
│   ├── hooks/                  # 커스텀 리액트 훅 (useT.ts 등)
│   ├── i18n/                   # 다국어 딕셔너리 (ko.json, en.json, ja.json) 및 타입
│   ├── lib/                    # 핵심 인프라 및 도메인 파서
│   │   ├── card-parser.ts      # Zod 기반 도메인 파서 (단일 진실 공급원)
│   │   ├── prisma.ts           # 전역 Prisma Client 싱글톤
│   │   ├── safe-action.ts      # 타입 안전 Server Action 래퍼
│   │   └── schemas.ts          # Zod 콘텐츠 스키마 (Flashcard, PracticeQuiz, Vocabulary)
│   ├── scripts/                # 백그라운드 ETL 스크립트 (etl.ts)
│   ├── types/                  # 공통 도메인 타입 정의 (card.ts, deck.ts, record.ts)
│   └── proxy.ts (middleware)  # 다국어 로캘 감지 및 리다이렉트 미들웨어
├── .data/                      # 로컬 SQLite DB 디렉토리 (Git 추적 제외)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Core Architectural Principles (아키텍처 핵심 원칙)

### 1) Type Safety: "Parse, Don't Validate"
- 데이터베이스(Prisma)의 원시 직렬화 필드(`Card.content: string`)는 컴포넌트나 액션에서 임의로 형변환하거나 `as unknown as CardData` 같은 강제 단언을 절대 사용하지 않습니다.
- 반드시 `src/lib/card-parser.ts`의 `parseCardData(card)` 및 `parseCardDataList(cards)`를 통해 Zod 런타임 검증을 통과한 데이터만 `CardData` 판별 유니온 타입으로 승격시킵니다.

### 2) Safe Server Actions
- 모든 백엔드 비즈니스 로직 및 뮤테이션은 `src/actions/` 내 Server Actions로 구현합니다.
- `src/lib/safe-action.ts`의 `actionClient`를 활용하여 진입점에서 Zod 스키마로 입력을 무결하게 검증하고, 구조화된 `ActionState<T>` 형태로 클라이언트에 안전하게 결과를 전달합니다.

### 3) Server Components (RSC) vs Client Components 분리
- 데이터 패칭(Prisma 직접 조회) 및 메타데이터 생성은 서버 컴포넌트(`page.tsx`)에서 최우선으로 처리합니다.
- 클라이언트 컴포넌트(`"use client"`)는 브라우저 이벤트(클릭, 입력), `framer-motion` 애니메이션, React 19 `useTransition` 비동기 상태 관리가 필요한 경우에만 한정하여 작성합니다.

### 4) Tailwind CSS v4 캐노니컬 스타일링 표준
- 그라디언트는 `bg-gradient-to-*` 대신 **`bg-linear-to-*`**를 사용합니다.
- 플렉스 축소/확장은 `flex-shrink-*`/`flex-grow-*` 대신 **`shrink-*`**, **`grow-*`**를 사용합니다.
- CSS 변수는 `top-[var(--header-height)]` 대신 **`top-(--header-height)`**로 바인딩합니다.
- 임의의 hex 코드 대신 `globals.css`의 `@theme` 토큰 및 시맨틱 컬러를 활용합니다.

### 5) 다국어 동기화 (i18n Strict Synchronization)
- 모든 UI 텍스트는 하드코딩을 엄격히 금지하며, `src/i18n/dictionaries/`의 `ko.json`, `en.json`, `ja.json` 3개 파일에 누락 없이 동기화한 후 `useT()` 훅을 통해 렌더링합니다.

### 6) 무결성 보장 (Lint & Spellcheck Diagnostics)
- `npm run lint` 실행 시 **0 error / 0 warning**을 상시 유지합니다.
- 클래스명이나 도메인 용어에 오탈자가 발생하지 않도록 확인하고, 프로젝트 도메인 단어는 `.vscode/settings.json`의 `cSpell.words`에 체계적으로 등록하여 관리합니다.