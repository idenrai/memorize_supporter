# Memorize Supporter

[🇰🇷 한국어](#-한국어) | [🇺🇸 English](#-english)

---

## 🇰🇷 한국어

**Memorize Supporter**는 핀포인트 팁, 4지선다형 퀴즈, 영단어 등 다양한 유형의 지식을 효과적으로 학습하고 오래 기억할 수 있도록 돕는 범용 인지 과학 기반 암기 지원 웹 애플리케이션입니다.

### ✨ 주요 기능

- **다양한 학습 모드**: 플래시카드(Flashcards), 4지선다형 연습 퀴즈(Practice Quiz), 단어장(Vocabulary) 지원
- **Active Recall & SRS (간격 반복)**: 능동적 인출 훈련 및 결과(Hard/Easy)에 따른 에빙하우스 망각 곡선 기반 자동 복습 주기 계산
- **시험 모드 및 오답 다시 풀기 (Exam Mode & Retry Incorrect)**: 실전 퀴즈 풀이 후 점수 통계 확인 및 틀린 문제만 골라 즉시 재응시하는 피드백 루프
- **글로벌 다국어 지원 (i18n)**: 동적 라우팅 기반으로 한국어(KO), 영어(EN), 일본어(JA) 완벽 지원 (Hydration Mismatch 방지)
- **JSON 기반 데이터 파이프라인**: `input/` 디렉토리에 JSON 파일만 넣으면 `npm run etl`을 통해 기존 학습 기록을 보존하며 스마트 동기화
- **웹 기반 덱 관리 및 데이터 준비 (Data Management & Preparation)**: 브라우저에서 직접 JSON 덱 업로드, 덱 수정/삭제 및 대화형 덱 빌더/스키마 검증기 제공
- **인지 부하를 줄인 모던 UI/UX**: Tailwind CSS v4 기반 다크 모드, 글래스모피즘, 마이크로 애니메이션, `tabular-nums` 숫자 정렬
- **풀 키보드 단축키 지원**: 마우스 없이도 스페이스바, 숫자키(1~4), 방향키로 모든 학습 및 퀴즈 제어 가능
- **PWA & 모바일 반응형**: 모바일 기기 홈 화면 추가(PWA) 지원 및 완벽한 반응형 레이아웃

---

### 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend Framework** | [Next.js 16 (App Router, Turbopack)](https://nextjs.org/) / [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`) |
| **State & Animation** | [Zustand 5](https://zustand-demo.pmnd.rs/), [Framer Motion 12](https://www.framer.com/motion/) |
| **Database & ORM** | [SQLite](https://www.sqlite.org/) (로컬 파일 기반), [Prisma ORM 6](https://www.prisma.io/) |
| **Icons & Toast** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Data Validation** | [Zod](https://zod.dev/) |

---

### 📋 요구 사항 (Prerequisites)

- **권장 Node.js 버전**: **`Node.js >= 20.9.0` (LTS 20.x 또는 22.x 이상 권장)**
- **패키지 매니저**: `npm >= 10.0.0`

---

### 🚀 시작하기

#### 1. 저장소 클론 및 패키지 설치
```bash
git clone <repository-url>
cd memorize_supporter
npm install
```

#### 2. 환경 변수 설정
데이터베이스 경로 설정을 위해 환경 변수 예제 파일을 복사합니다.
```bash
cp .env.example .env
```
*(Windows 환경의 경우 `copy .env.example .env` 실행)*

#### 3. 데이터베이스 스키마 생성 및 ETL 실행
```bash
npx prisma db push
npm run etl
```
> **참고**: 
> - SQLite는 Prisma에 의해 로컬(`.data/memorize.sqlite`)에 자동 생성되므로 별도의 DB 서버 설치가 필요하지 않습니다.
> - `npm run etl`은 카드를 추가하거나 오타를 수정한 뒤 여러 번 재실행해도, 기존 학습 진도 및 SRS 복습 기록(Learning Progress)을 안전하게 보존합니다.

#### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 애플리케이션을 사용할 수 있습니다.

#### 5. 데이터베이스 완전 초기화 (개발/테스트용)
모든 학습 데이터와 시험 기록을 초기화하고 처음부터 다시 시작할 경우:
```bash
npx prisma db push --force-reset
npm run etl
```

---

## 🇺🇸 English

**Memorize Supporter** is a cognitive-science-driven flashcard and spaced repetition memorization web application designed for learning pinpoint tips, multiple-choice questions, vocabulary, and more.

### ✨ Key Features

- **Multiple Study Modes**: Flashcards, Practice Quiz (4-choice questions), and Vocabulary.
- **Active Recall & Spaced Repetition (SRS)**: Promotes proactive knowledge retrieval and automatically schedules optimal review intervals based on difficulty (Hard/Easy).
- **Exam Mode & Retry Incorrect**: Full quiz scoring, question breakdown, and an instant smart feedback loop to re-test only incorrect answers.
- **Full Internationalization (i18n)**: URL-based routing supporting Korean (KO), English (EN), and Japanese (JA) without hydration mismatch.
- **JSON-Driven Data Pipeline**: Drop JSON files into the `input/` folder and run `npm run etl` to sync decks while preserving existing user study progress.
- **Web Data Management & Preparation**: Upload/edit/delete decks from the browser and compose custom decks with a live interactive schema validator.
- **Polished Cognitive-Friendly UI/UX**: Dark mode, glassmorphic styling, compositor-optimized micro-animations, and `tabular-nums` alignment powered by Tailwind CSS v4.
- **Full Keyboard Accessibility**: Control flashcard flips, quiz choices (1-4), and navigation entirely via keyboard.
- **PWA & Mobile Ready**: Add to Home Screen support with responsive layouts for mobile and desktop.

---

### 🛠 Tech Stack

| Area | Technology |
|------|------------|
| **Frontend Framework** | [Next.js 16 (App Router, Turbopack)](https://nextjs.org/) / [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`) |
| **State & Animation** | [Zustand 5](https://zustand-demo.pmnd.rs/), [Framer Motion 12](https://www.framer.com/motion/) |
| **Database & ORM** | [SQLite](https://www.sqlite.org/) (Local file-based), [Prisma ORM 6](https://www.prisma.io/) |
| **Icons & Toast** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Data Validation** | [Zod](https://zod.dev/) |

---

### 📋 Prerequisites

- **Recommended Node.js Version**: **`Node.js >= 20.9.0` (LTS 20.x or 22.x+ recommended)**
- **Package Manager**: `npm >= 10.0.0`

---

### 🚀 Getting Started

#### 1. Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd memorize_supporter
npm install
```

#### 2. Set Up Environment Variables
```bash
cp .env.example .env
```
*(On Windows Command Prompt, use `copy .env.example .env`)*

#### 3. Initialize Database & Run ETL Pipeline
```bash
npx prisma db push
npm run etl
```
> **Note**:
> - SQLite database is automatically generated locally at `.data/memorize.sqlite`. No external database setup is required.
> - `npm run etl` can be run multiple times safely; it syncs card content while preserving existing user progress and SRS histories.

#### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

#### 5. Reset Database (For Development / Testing)
To wipe all cards and progress records and re-seed from scratch:
```bash
npx prisma db push --force-reset
npm run etl
```

---

## ⌨️ Keyboard Shortcuts (키보드 단축키)

| Mode | Action | Shortcut |
|------|--------|----------|
| **Flashcard** | Flip Card / Show Answer (카드 뒤집기) | `Space` / `Enter` |
| **Flashcard** | Mark Hard (어려움) | `←` (Left Arrow) |
| **Flashcard** | Mark Easy (쉬움) | `→` (Right Arrow) |
| **Quiz** | Select Option 1~4 (보기 선택) | `1`, `2`, `3`, `4` |
| **Quiz** | Submit / Next Question (제출 및 다음 문제) | `Enter` / `Space` |
| **General** | Back to Home (홈으로 이동) | `Esc` |
