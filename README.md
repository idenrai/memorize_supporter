# Memorize Supporter

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://memorize-supporter.vercel.app/)
[![Vercel Deployment](https://img.shields.io/badge/deployed_on-Vercel-black.svg?logo=vercel)](https://memorize-supporter.vercel.app/)

> 🌐 **Live Demo (라이브 데모):** [https://memorize-supporter.vercel.app/](https://memorize-supporter.vercel.app/)

[🇰🇷 한국어](#-한국어) | [🇺🇸 English](#-english)

---

## 🇰🇷 한국어

**Memorize Supporter**는 핀포인트 팁, 4지선다형 퀴즈, 영단어 등 다양한 유형의 지식을 효과적으로 학습하고 오래 기억할 수 있도록 돕는 범용 인지 과학 기반 암기 지원 웹 애플리케이션입니다.

### ✨ 주요 기능

- **다양한 학습 모드**: 플래시카드(Flashcards), 4지선다형 연습 퀴즈(Practice Quiz), 단어장(Vocabulary) 지원
- **Active Recall & SRS (간격 반복)**: 능동적 인출 훈련 및 결과(Hard/Easy)에 따른 에빙하우스 망각 곡선 기반 자동 복습 주기 계산
- **브라우저 로컬 저장 모드 (BYOD: Bring Your Own Data)**: 개인 소장 학습 데이터(JSON)를 드래그&드롭하여 서버 전송 없이 브라우저(IndexedDB)에만 안전하게 저장하고 학습
- **로컬 데이터 백업/복원 및 관리 (Backup, Restore & Delete)**: 기기에 저장된 시험 기록 및 덱을 개별/일괄 삭제하고, 원클릭으로 종합 JSON 백업 파일 다운로드 및 복원(Restore)
- **글로벌 다국어 지원 (i18n)**: 동적 라우팅 기반으로 한국어(KO), 영어(EN), 일본어(JA) 완벽 지원 (Hydration Mismatch 방지)
- **JSON 기반 덱 가져오기 및 샘플 덱 제공**: 기본 샘플 덱(정적 서빙)을 즉시 체험하거나, 개인 소장 JSON 덱을 업로드하여 학습 기록 손실 없이 브라우저에 안전하게 병합
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
| **Client Storage** | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (100% Local-First 영구 보관), Zero-Server Database |
| **Icons & Toast** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Data Validation** | [Zod](https://zod.dev/) |

---

### 📋 요구 사항 (Prerequisites)

- **Node.js 버전**: **`Node.js >= 20.9.0` (LTS 20.x 또는 22.x 이상 권장)**
  - 프로젝트 루트에 [`.nvmrc`](file:///Users/idenrai/project/memorize_supporter/.nvmrc) 및 [`.node-version`](file:///Users/idenrai/project/memorize_supporter/.node-version)이 포함되어 있습니다.
  - `nvm` 사용 시 아래 명령어로 권장 노드 버전을 바로 활성화할 수 있습니다:
    ```bash
    nvm use
    ```
- **패키지 매니저**: `npm >= 10.0.0` (`.npmrc`의 `engine-strict` 설정으로 요구 버전 미충족 시 설치가 차단됩니다)

---

### 🚀 시작하기

#### ⚡ 초간단 1초 실행 (권장)
복잡한 명령어 입력 없이, 운영체제에 맞는 실행 파일을 **더블 클릭**하기만 하면 의존성 설치, 환경 설정 및 서버 실행이 한 번에 완료됩니다.

* **Windows**: [`start.bat`](file:///Users/idenrai/project/memorize_supporter/start.bat) 더블 클릭
* **macOS / Linux**: [`start.sh`](file:///Users/idenrai/project/memorize_supporter/start.sh) 더블 클릭 (또는 터미널에서 `./start.sh` 실행)

---

#### 💻 터미널 명령어로 실행하기
터미널을 선호하시는 경우 단 두 줄의 명령어로 시작할 수 있습니다:
```bash
git clone <repository-url>
cd memorize_supporter
npm install && npm run setup   # 환경 초기화
npm run dev                    # 개발 서버 및 브라우저 자동 실행
```

---

#### 🔒 개인 학습 데이터 프라이버시 & BYOD 배포 가이드
개인 소장 학습 데이터나 비공개 메모는 웹 서버에 업로드하지 않고도 안전하게 학습할 수 있어야 합니다. 본 애플리케이션은 **100% 브라우저 로컬 저장(BYOD: Bring Your Own Data) Local-First** 모드로 동작하므로, 서버에 민감한 데이터를 저장하지 않고도 지인이나 스터디원과 함께 웹 앱을 활용할 수 있습니다.

1. **Vercel 웹 배포**: GitHub 저장소를 Vercel에 연결하여 정적/서버리스 웹 애플리케이션으로 배포합니다. (서버에는 사용자 개인 데이터가 일체 저장되지 않습니다.)
2. **커스텀 덱 준비**: 본인이 학습할 문제나 단어장이 담긴 JSON 파일(예: `custom_deck.json`)을 준비합니다.
3. **브라우저에서 즉시 실행**: 배포된 Vercel 웹사이트([라이브 데모](https://memorize-supporter.vercel.app/))에 접속한 뒤, 상단 네비게이션의 **[데이터 관리]** 페이지에서 해당 파일을 드래그&드롭하거나 탐색기로 선택하여 업로드하기만 하면 끝납니다!
   * 파일이 서버로 전송되지 않고 **사용자 본인의 브라우저(IndexedDB)**에 안전하게 저장됩니다.
   * 브라우저를 껐다 켜도 학습 진도와 시험 기록이 영구적으로 보존됩니다.

---

#### 🛠 고급/수동 설치 절차 (상세)
직접 단계를 하나씩 수행하고 싶은 경우:
1. `nvm use`
2. `npm install`
3. `npm run setup`
4. `npm run dev`

---

#### 🧪 코드 품질 및 빌드 검증 (Fail Fast Verification)
본 프로젝트는 시간과 비용(토큰)을 절약하기 위해 빠르고 가벼운 검사부터 조기 중단(Short-Circuit)하는 파이프라인을 운영합니다:
```bash
npm run check:fast  # 초고속 개발 루프 검사 (Node → Type → Lint, 약 3초 완료)
npm run check       # 4단계 Fail Fast 전체 파이프라인 (Node → Type → Lint → Build)
npm run type-check  # 1.5초 만에 완료되는 초고속 정적 타입 검사 (tsc --noEmit)
npm run lint        # ESLint 정적 분석 (0 에러 / 0 경고 필수)
npm run build       # Next.js Turbopack 프로덕션 빌드
```

---

## 🇺🇸 English

**Memorize Supporter** is a cognitive-science-driven flashcard and spaced repetition memorization web application designed for learning pinpoint tips, multiple-choice questions, vocabulary, and more.

### ✨ Key Features

- **Multiple Study Modes**: Flashcards, Practice Quiz (4-choice questions), and Vocabulary.
- **Active Recall & Spaced Repetition (SRS)**: Promotes proactive knowledge retrieval and automatically schedules optimal review intervals based on difficulty (Hard/Easy).
- **Local-First BYOD Mode (Bring Your Own Data)**: Drag-and-drop custom study JSON files directly into browser IndexedDB without sending data to servers.
- **On-Device Data Backup, Restore & Deletion**: Clean deletion of local decks/records and one-click JSON backup export and restoration.
- **Full Internationalization (i18n)**: URL-based routing supporting Korean (KO), English (EN), and Japanese (JA) without hydration mismatch.
- **JSON-Driven Deck Import & Static Sample Decks**: Explore pre-packaged sample decks instantly, or import custom JSON decks directly into browser storage without losing study progress.
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
| **Client Storage** | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (100% Local-First Persistent Storage), Zero-Server Database |
| **Icons & Toast** | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Data Validation** | [Zod](https://zod.dev/) |

---

### 📋 Prerequisites

- **Node.js Version**: **`Node.js >= 20.9.0` (LTS 20.x or 22.x+ recommended)**
  - Project includes [`.nvmrc`](file:///Users/idenrai/project/memorize_supporter/.nvmrc) and [`.node-version`](file:///Users/idenrai/project/memorize_supporter/.node-version).
  - If using `nvm`, switch to the required version with:
    ```bash
    nvm use
    ```
- **Package Manager**: `npm >= 10.0.0` (Enforced by `engine-strict` in `.npmrc`)

---

### 🚀 Getting Started

#### ⚡ 1-Click Launch (Recommended)
No terminal setup needed. Simply double-click the launcher script for your operating system to automatically install dependencies, initialize the environment, and start the application:

* **Windows**: Double-click [`start.bat`](file:///Users/idenrai/project/memorize_supporter/start.bat)
* **macOS / Linux**: Double-click [`start.sh`](file:///Users/idenrai/project/memorize_supporter/start.sh) (or run `./start.sh` in terminal)

---

#### 💻 Launch via Terminal
```bash
git clone <repository-url>
cd memorize_supporter
npm install && npm run setup   # Automatically sets up .env and environment
npm run dev                    # Starts development server and opens browser
```

---

#### 🔒 User Privacy & BYOD Deployment Guide (Local-First)
Private study materials and custom flashcards can be studied with complete privacy without uploading to any remote cloud server. This application supports **BYOD (Bring Your Own Data) Local-First** mode:

1. **Deploy to Vercel**: Connect your GitHub repository to Vercel to host the web client. (The server contains zero user data, guaranteeing complete privacy and zero data liability).
2. **Prepare Custom Decks**: Prepare your study questions or vocabulary in JSON format (e.g., `custom_deck.json`).
3. **Import & Run in Browser**: Navigate to your deployed web app ([Live Demo](https://memorize-supporter.vercel.app/)) and drag-and-drop the JSON files into the **Upload Zone** on the **Data Management** page.
   * Cards are stored securely inside the **user's local browser (IndexedDB)**.
   * Study progress, review schedules, and exam scores persist permanently across browser restarts without ever uploading to any cloud server.

---

#### 🛠 Manual Setup Steps (Advanced)
If you prefer running steps manually:
1. `nvm use`
2. `npm install`
3. `npm run setup` (or `cp .env.example .env`)
4. `npm run dev`

---

#### 🧪 Quality & Verification Pipeline (Fail Fast)
The project runs a 4-tier cost-ordered verification pipeline that short-circuits on any failure to minimize time and token costs:
```bash
npm run check:fast  # Rapid dev loop verification (Node → Type → Lint in ~3s)
npm run check       # 4-tier Fail Fast pipeline (Node → Type → Lint → Build)
npm run type-check  # Ultra-fast TypeScript static check (~1.5s, tsc --noEmit)
npm run lint        # ESLint code quality & style (0 errors / 0 warnings)
npm run build       # Next.js Turbopack production bundle
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
