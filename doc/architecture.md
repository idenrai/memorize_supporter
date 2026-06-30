# System Architecture

This document defines the system architecture of the `memorize_supporter` project.

이 문서는 `memorize_supporter` 프로젝트의 시스템 아키텍처를 정의합니다.

## 1. Overview

**Purpose:** A general-purpose memorization application designed to help users efficiently memorize flashcards (pinpoint tips), multiple-choice questions, and vocabulary. It maximizes learning efficiency by adopting cognitive science principles (Active Recall, Spaced Repetition) and a focus-mode design.

**목적:** 사용자가 플래시카드(핀포인트 팁), 객관식 문제, 영단어 등을 효율적으로 암기할 수 있도록 돕는 범용 암기 애플리케이션입니다. 인지 과학적 원리(Active Recall, Spaced Repetition)와 포커스 모드 디자인을 채택하여 학습 효율을 극대화합니다.

**Core Components:**
- `DeckPlayer`: Frontend interactive card renderer (handling micro-animations and feedback).
- `SQLite & Prisma`: Lightweight data layer operating in an offline (local file) environment.
- `ETL Script`: Data pipeline script that reads original documents (JSON), parses them, and pushes them (Upsert) into the DB.

**핵심 컴포넌트:**
- `DeckPlayer`: 프론트엔드 인터랙티브 카드 렌더러 (마이크로 애니메이션, 피드백 처리)
- `SQLite & Prisma`: 오프라인(로컬 파일) 환경에서 동작하는 경량 데이터 레이어
- `ETL Script`: 원본 문서(JSON)를 읽고 파싱하여 DB에 밀어넣는(Upsert) 데이터 파이프라인 스크립트

## 2. Frontend

**Framework and Routing Strategy:**
- Next.js (App Router) / React 19
- Optimizes rendering performance by strictly separating Server Components (data fetching: `app/deck/[deckId]/page.tsx`) and Client Components (interactions: `TipCard.tsx`).

**프레임워크 및 라우팅 방식:**
- Next.js (App Router) / React 19
- Server Components(데이터 패칭: `app/deck/[deckId]/page.tsx`)와 Client Components(인터랙션: `TipCard.tsx`)를 명확히 분리하여 렌더링 성능을 최적화합니다.

**State Management Strategy:**
- Manages the learning progress and flip state of the current deck using local state (`useState`). Avoids using complex global state managers (like Redux).

**상태 관리 전략:**
- 로컬 상태(`useState`)를 활용하여 현재 데크(Deck)의 학습 진행 상황과 플립 여부를 관리합니다. 복잡한 전역 상태 관리자(Redux 등)는 지양합니다.

**Styling and Micro-animations:**
- Focus-mode layout based on dark mode using Tailwind CSS.
- Provides visual feedback such as a 180-degree 3D flip and Scale Pop by integrating `framer-motion`.

**스타일링 및 마이크로 애니메이션:**
- Tailwind CSS를 활용한 다크 모드 포커스 레이아웃.
- `framer-motion`을 도입하여 180도 3D 플립, Scale Pop 등 시각적 피드백을 제공합니다.

## 3. Backend

**API and Data Communication:**
- Supplies data to the client through Next.js Server Actions or direct Prisma Client calls without a separate external REST API server.

**API 및 데이터 통신:**
- 별도의 외부 REST API 서버 없이 Next.js의 Server Actions 또는 Prisma Client 직접 호출을 통해 데이터를 클라이언트에 공급합니다.

**Database and ORM Integration:**
- **SQLite:** Built locally at `.data/memorize.sqlite`. This file is excluded from Git tracking (`.gitignore`).
- **Prisma ORM:** Generates type-safe queries and manages the database schema. Maintains a singleton connection in `src/lib/prisma.ts`.

**데이터베이스 및 ORM 연동 방식:**
- **SQLite:** `.data/memorize.sqlite`에 로컬로 구축되며, 이 파일은 Git 추적에서 제외(`.gitignore`)됩니다.
- **Prisma ORM:** 타입 안정성이 보장된 쿼리를 생성하며, 데이터베이스 스키마 관리를 담당합니다. `src/lib/prisma.ts`에 싱글톤 패턴으로 연결을 유지합니다.

## 4. Data Pipeline

**Custom ETL Pipeline (`src/scripts/etl.ts`):**
- Parses original JSON data and loads it into the DB via Prisma Client.
- **Data Integrity Guarantee (Stable ID & Upsert):** Uses the `crypto` module to generate a unique MD5 hash identifier based on the text content of the question/front. Through this, even if cards are added or deleted, the unique ID of existing cards is maintained, so the user's forgetting curve review record (`learningProgress`) is not destroyed and is safely preserved (Upsert).
- Execution command: `npm run etl` (TypeScript script execution via tsx).

**커스텀 ETL 파이프라인 (`src/scripts/etl.ts`):**
- 원본 JSON 데이터를 파싱하여 Prisma Client를 통해 DB에 적재합니다.
- **데이터 무결성 보장 (Stable ID & Upsert):** `crypto` 모듈을 사용해 문항의 텍스트 콘텐츠(Question/Front)를 기반으로 고유한 MD5 해시 식별자를 생성합니다. 이를 통해 카드를 추가하거나 삭제하더라도, 기존 카드의 고유 ID가 유지되어 유저의 망각 곡선 복습 기록(`learningProgress`)이 파괴되지 않고 안전하게 보존(Upsert)됩니다.
- 실행 명령어: `npm run etl` (tsx를 통한 TypeScript 스크립트 실행)

## 5. Infrastructure & Deployment

**Deployment Environment:**
- By default, it runs locally (Self-hosted) via `npm run build`, but it fully supports deployment on serverless hosting platforms like Vercel. (When deploying serverless, using an external production database such as Turso or Supabase is recommended).

**배포 환경:**
- 기본적으로는 로컬(Self-hosted)에서 `npm run build`로 구동되지만, Vercel 등의 서버리스 호스팅 플랫폼 배포도 완벽하게 지원합니다. (서버리스 배포 시 Turso, Supabase 등 외부 프로덕션 데이터베이스 사용 권장)

**CI/CD Pipeline:**
- We plan to configure GitHub Actions later to perform Type Check and Linting, as well as introduce an automation pipeline (see Issue #2) that automatically executes `npm run etl` to the DB production environment when a JSON file is pushed to the `input/public/` folder.

**CI/CD 파이프라인:**
- 추후 GitHub Actions를 구성하여 Type Check 및 Linting을 수행할 뿐만 아니라, `input/public/` 폴더에 JSON 파일 푸시 시 자동으로 DB 프로덕션 환경에 `npm run etl`을 수행하는 자동화 파이프라인(Issue #2 참조)을 도입할 예정입니다.

**Environment Variable Management:**
- Core variables like `DATABASE_URL` are injected through the `.env` file.

**환경 변수 관리:**
- `.env` 파일을 통해 `DATABASE_URL` 등 핵심 변수를 주입받습니다.
