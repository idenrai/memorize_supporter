# Setup & Installation (설치 및 개발 환경 안내)

[🇰🇷 한국어](#-한국어) | [🇺🇸 English](#-english)

---

## 🇰🇷 한국어

이 문서는 `memorize_supporter` 프로젝트의 개발 환경 설정, 설치, 실행 및 품질 검증 과정을 상세히 안내합니다.

### 1. 사전 요구 사항 (Prerequisites)

- **Node.js**: `Node.js >= 20.9.0` (Next.js 16 호환을 위해 LTS v20.x 또는 v22.x 이상 권장).
  프로젝트 루트에 Node 22가 지정된 `.nvmrc` 및 `.node-version`이 포함되어 있으므로, `nvm` 사용자는 아래 명령어로 즉시 전환할 수 있습니다:
  ```bash
  nvm use
  ```
- **패키지 매니저**: `npm >= 10.0.0` (`.npmrc`의 `engine-strict=true` 설정을 통해 요구 버전을 엄격히 강제합니다).
- **운영 체제**: macOS, Windows, Linux 무관 (브라우저 네이티브 클라이언트 저장소인 IndexedDB를 사용하므로 별도의 외부 DB 설치 불필요).

### 2. 빠른 시작 (Quick Start)

일반 사용자는 설치 없이 브라우저에서 바로 학습을 진행할 수 있습니다:
- **라이브 데모 바로가기**: [https://memorize-supporter.vercel.app/](https://memorize-supporter.vercel.app/)

### 3. 로컬 개발 환경 설치 (Local Development Setup)

터미널 환경에서 프로젝트를 클론하여 실행할 경우 아래 명령어를 실행하세요:

```bash
# 1. 저장소 복제 및 디렉토리 이동
git clone <repository-url>
cd memorize_supporter

# 2. 권장 Node.js 활성화
nvm use

# 3. 의존성 설치
npm install

# 4. 개발 서버 기동 및 브라우저 자동 오픈
npm run dev
```

### 4. 환경 변수 (Environment Variables)

애플리케이션 설정 및 정책은 `.env` 파일에 정의할 수 있습니다. 코드에 안전한 기본값이 내장되어 있어 `.env` 없이도 즉시 실행 가능하며, 설정을 변경하려는 경우 `.env.example`을 복사하여 사용합니다:

```bash
cp .env.example .env
```

| 변수명 | 기본값 | 설명 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB` | `5` | JSON 덱 파일 1개당 최대 업로드 허용 크기(MB) |
| `NEXT_PUBLIC_PASS_MARK_PERCENT` | `80` | 시험 모드 합격 커트라인 백분율 (기본 80%) |
| `MAX_SESSION_RESULTS` | `2000` | 단일 세션에 유지할 최대 시험 결과 수 |
| `FAILED_REVIEW_INTERVAL_MINUTES` | `10` | 오답 복습 권장 인터벌 시간(분) |

### 5. 품질 검증 파이프라인 (Verification & Fail Fast Pipeline)

본 프로젝트는 최소한의 컴퓨팅 및 토큰 비용으로 오류를 조기에 포착하기 위해 엄격한 **"Fail Fast, Fail Cheap"** 검증 사다리를 운영합니다:

```bash
# 1. 초고속 정적 타입 검사 (~1.5초, tsc --noEmit, 0 에러 필수)
npm run type-check

# 2. ESLint 정적 분석 (~1.5초, 0 에러 / 0 경고 필수)
npm run lint

# 3. Next.js Turbopack 프로덕션 번들 빌드
npm run build

# 4. 원스톱 체이닝 검증 파이프라인 (Node 버전 -> 타입 -> 린트 -> 빌드, 실패 시 즉시 중단)
npm run check
```

### 6. 문제 해결 (Troubleshooting)

브라우저의 로컬 학습 기록이나 덱 데이터를 완전히 초기화하고 싶은 경우:

- **웹 UI 이용**: 상단 네비게이션의 **[데이터 관리]** 페이지로 이동하여 개별 덱을 삭제하거나 새 JSON 덱을 다시 등록합니다.
- **브라우저 개발자 도구 이용**: 개발자 도구(F12) -> **Application (애플리케이션)** -> **IndexedDB** -> `memorize_supporter_local_db`를 삭제 후 새로고침합니다.

---

## 🇺🇸 English

This document provides comprehensive guides for setting up, installing, running, and verifying the `memorize_supporter` project.

### 1. Prerequisites

- **Node.js**: `Node.js >= 20.9.0` (LTS v20.x or v22.x+ recommended for Next.js 16 compatibility).
  The project includes `.nvmrc` and `.node-version` configured to Node 22. If using `nvm`, switch versions by running:
  ```bash
  nvm use
  ```
- **Package Manager**: `npm >= 10.0.0` (Enforced strictly by `.npmrc` via `engine-strict=true`).
- **Operating System**: macOS, Windows, Linux (Uses browser-native IndexedDB client storage; no external database server like MySQL or PostgreSQL required).

### 2. Quick Start

For general users, no local installation is needed. You can use the app immediately in your browser:
- **Live Demo**: [https://memorize-supporter.vercel.app/](https://memorize-supporter.vercel.app/)

### 3. Local Development Setup

To clone and run the application locally:

```bash
# 1. Clone repository and change directory
git clone <repository-url>
cd memorize_supporter

# 2. Use recommended Node.js version
nvm use

# 3. Install dependencies
npm install

# 4. Start development server & open browser
npm run dev
```

### 4. Environment Variables

Application configuration and policies can be customized via `.env`. Safe default fallbacks are built directly into the codebase so the app runs without a `.env` file. To customize limits or pass marks, create a `.env` from the example template:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB` | `5` | Maximum per-file upload size limit in MB for custom JSON decks |
| `NEXT_PUBLIC_PASS_MARK_PERCENT` | `80` | Minimum score percentage for passing exam mode |
| `MAX_SESSION_RESULTS` | `2000` | Maximum number of exam results retained per session |
| `FAILED_REVIEW_INTERVAL_MINUTES` | `10` | Recommended interval in minutes for reviewing failed questions |

### 5. Verification & Quality Pipeline

The project enforces a strict **"Fail Fast, Fail Cheap"** verification ladder to catch errors early with minimal compute and token cost:

```bash
# 1. Fast static type checking (~1.5s, 0 errors required)
npm run type-check

# 2. ESLint code quality & style (~1.5s, 0 errors & 0 warnings required)
npm run lint

# 3. Production Next.js bundle & Turbopack build
npm run build

# 4. Full Chained Verification Pipeline (Short-circuits immediately upon any failure)
npm run check
```

### 6. Troubleshooting

If you wish to completely reset your local study history and deck data stored in the browser:

- **Via Web UI**: Navigate to the **[Data Management]** page from the top navigation bar to delete individual decks or re-upload JSON decks.
- **Via Browser DevTools**: Open DevTools (F12) -> **Application** tab -> **IndexedDB** -> Delete `memorize_supporter_local_db` and refresh the page.
