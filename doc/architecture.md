# System Architecture (시스템 아키텍처)

[🇰🇷 한국어](#-한국어) | [🇺🇸 English](#-english)

---

## 🇰🇷 한국어

이 문서는 `memorize_supporter` 프로젝트의 시스템 아키텍처를 정의합니다.

### 1. 개요 (Overview)

- **목적**: 사용자가 플래시카드(핀포인트 팁), 객관식 문제, 영단어 등을 효율적으로 암기할 수 있도록 돕는 범용 암기 애플리케이션입니다. 인지 과학적 원리(Active Recall, Spaced Repetition)와 포커스 모드 디자인을 채택하여 학습 효율을 극대화합니다.
- **핵심 컴포넌트**:
  - `DeckGallery`: `useDeferredValue`를 활용한 렌더링 최적화와 함께 실시간 덱 검색 및 시리즈 필터링을 담당하는 클라이언트 컴포넌트
  - `UploadZone`: 서버 전송 없이 브라우저 IndexedDB로 개인 커스텀 덱을 단일 또는 복수 일괄(Multi-file Batch)로 즉시 적재하는 드래그 앤 드롭 파일 임포터 (데이터 관리 페이지)
  - `DeckPlayer` 및 세부 카드 컴포넌트들(`Flashcard`, `VocabularyCard`, `PracticeQuizCard`): 프론트엔드 인터랙티브 카드 렌더러 (마이크로 애니메이션, 피드백 처리)
  - `DeckClientLoader`: 로컬 전용 덱 접근 시 IndexedDB로부터 카드를 로드하여 서버와 동일한 SRS 우선순위로 플레이어를 구동하는 클라이언트 로더
  - `ExamResultView`: 문항별 오답 상세 복습, 시각적 선택지 비교 및 '틀린 문제만 다시 풀기'를 지원하는 시험 결과 뷰어
  - `LocalRecordsView`: 로컬 기기에 저장된 시험 기록을 조회하고, 개별 기록 삭제 및 종합 JSON 백업 내보내기를 지원하는 통합 기록 뷰어
  - `DataManagement` & `DataPreparation`: 웹 브라우저에서 직접 JSON 덱을 업로드/수정/삭제하고 템플릿을 생성/검증하는 관리 도구
  - `IndexedDB 클라이언트 저장소` (`src/lib/client-db.ts`): 개인 소장 학습 데이터, 망각 곡선 진도 및 시험 점수를 브라우저에 안전하게 격리 보존하는 로컬 데이터 계층
  - `CardParser` (`src/lib/card-parser.ts`): 원시 JSON 및 카드 문자열을 Zod 스키마로 검증하여 `CardData` 판별 유니온으로 승격시키는 단일 진실 공급원(SSoT)

### 2. 프론트엔드 (Frontend)

- **프레임워크 및 라우팅 방식**:
  - Next.js (App Router) / React 19
  - Server Components(데이터 패칭: `app/[lang]/deck/[deckId]/page.tsx`)와 Client Components(인터랙션: `Flashcard.tsx`)를 명확히 분리하여 렌더링 성능을 최적화합니다.

- **카드 출제 전략 (Card Selection Strategy)**:
  - **1순위 (미출제 문제)**: 학습 기록이 없는 카드를 최우선 출제하여 덱 전체 커버리지를 확보합니다.
  - **2순위 (오답 문제)**: 틀린 이력이 있는 카드를 추산된 '틀린 횟수'가 높은 순으로 배치하여 약점을 집중 타격합니다.
  - **3순위 (일반 문제)**: 완벽히 맞힌 카드는 '풀이 횟수'가 적은 순으로 출제하여 우연히 맞힌 지식을 확실히 굳힌 뒤, 장기 기억화된 카드를 나중에 복습하도록 설계되었습니다.

- **다국어 처리 및 UX 라이팅 전략 (i18n Strategy)**:
  - **URL 기반 단일 진실 공급원(SSoT)**: URL 기반 동적 라우팅(`app/[lang]/...`)을 활용합니다. 전역 상태 관리자(Zustand 등)를 배제하여 SSR 렌더링 시점의 쿠키 분석에 의존하지 않고, Hydration 에러를 원천 차단합니다.
  - **엄격한 타입 안전 다국어 사전**: `src/i18n/types.ts`를 단일 진실 공급원으로 삼아 한국어(`ko.ts`), 영어(`en.ts`), 일본어(`ja.ts`) 3개 국어의 번역 사전을 완전 동기화하고, 실제 사용자 흐름에 맞춘 직관적인 UX 카피라이팅을 적용합니다.
  - **프록시 기반 로캘 라우팅**: Next.js 16 규칙에 따라 `src/proxy.ts`를 사용하여 동적 로캘 라우팅을 처리합니다. 다국어 상수(locales)는 `src/i18n/settings.ts`로 분리하여 애플리케이션 전체에서 일관되게 관리합니다.

- **상태 관리 전략**:
  - 로컬 상태(`useState`)를 활용하여 현재 데크(Deck)의 학습 진행 상황과 플립 여부를 관리합니다. 복잡한 전역 상태 관리자(Redux 등)는 지양합니다.

- **스타일링, 마이크로 애니메이션 및 접근성**:
  - Tailwind CSS v4 (`@tailwindcss/postcss`)를 활용하여 눈이 편안한 Zinc(배경)와 Teal/Indigo(프라이머리) 기반의 다크 모드 포커스 레이아웃을 제공합니다.
  - `globals.css` 파일에 Tailwind CSS v4의 `@theme` 및 `@utility` 지시어를 활용하여 글로벌 디자인 토큰(`--header-height: 4rem;`) 및 시맨틱 유틸리티(`.glass-panel`, `.btn-indigo`, 3D 변환 등)를 정의함으로써 스타일 코드 결합성과 유지보수성을 극대화했습니다.
  - **CJK 타이포그래피 최적화**: `globals.css`의 `body`에 `word-break: keep-all; overflow-wrap: anywhere;`를 전역 적용하여 한국어/일본어 어절이 음절 단위로 쪼개지는 현상을 방지하고, 좁은 모바일 뷰포트에서의 긴 텍스트 오버플로우를 차단합니다.
  - **가변 높이 및 모션 제어**: 퀴즈 카드 및 상호작용 컨트롤에 `AnimatePresence (initial={false})`와 `useReducedMotion`(`motion-reduce:` 변형자)을 적용하여 컨텐츠 길이에 맞춰 유연하게 조절하고, 모션 덜컹거림(Jitter)을 방지합니다.
  - **다중 선택 문항 개수 제한**: 정답 개수(`content.answers.length`)를 초과하여 선택할 수 없도록 동적으로 상한선을 제한하고, 실시간 진행 뱃지(`(1/2 선택됨)`) 및 안내 토스트를 제공하여 불필요한 중복 클릭을 방지합니다.
  - **전체 선택지 하이라이트 및 해설 강화**: 퀴즈 해설 및 결과 검토 화면에서 문제의 전체 선택지를 렌더링하고, 실제 정답(초록색), 사용자가 고른 오답(빨간색), 미선택 보기를 아이콘과 뱃지로 3중 강조하여 오답 원인을 직관적으로 학습할 수 있도록 지원합니다.
  - **단일 진실 공급원(SSoT) 스티키 헤더 및 공통 `QuizHeader` 컴포넌트**: 전역 헤더 높이 토큰과 완벽히 연동되는 재사용 가능한 `QuizHeader`(및 `QuizHeader.Skeleton`)를 도입하여 스크롤 시 글로벌 네비게이션 바로 아래(`sticky top-(--header-height) z-30`)에 안정적으로 고정됩니다. 상단 기준 정렬을 확립하여 문제 카드와의 비정상적 여백을 해소하고, 누적 레이아웃 시프트(CLS) 없는 일관된 학습 환경을 보장합니다.
  - **끊김 없는 문제 검토 네비게이션 및 단축키**: 시험 기록 및 오답 검토 화면에서 목록으로 나가지 않고도 전후 문제로 즉시 이동할 수 있도록 상단 Sticky 헤더와 하단 액션 버튼을 양방향 제공하며, 키보드 좌우 방향키(`←`, `→`), `Escape`, `Enter` 단축키를 완벽 지원합니다.
  - Vercel Web Interface Guidelines를 엄격하게 준수하여 시맨틱 HTML, WAI-ARIA 속성(`role="group"`, `aria-pressed`, `aria-label`), 견고한 키보드 포커스(`focus-visible`), 고정폭 수치 폰트(`tabular-nums`), 그리고 모바일 터치 피드백(`active:scale-95`) 등 최고 수준의 접근성을 보장합니다.
  - 네이티브 브라우저 엘리먼트를 대체하는 접근성 높은 커스텀 UI 컴포넌트(예: React Portal 기반의 `CustomSelect`)를 구현하여, 모든 플랫폼에서 일관된 프리미엄 룩(글래스모피즘)을 유지하는 동시에 엄격한 WAI-ARIA 콤보박스 표준과 키보드 Type-ahead 네비게이션을 지원합니다.
  - `framer-motion`을 도입하여 180도 3D 플립, Scale Pop 등 시각적 피드백을 제공합니다.

- **PWA 및 메타데이터 전략**:
  - Progressive Web App (PWA) 표준인 `manifest.ts`를 구현하여 네이티브 디바이스 환경(테마 색상 동기화, Standalone 디스플레이 등)에 자연스럽게 녹아들도록 구성했습니다.
  - 동적 파비콘(`icon.tsx`) 및 고해상도 애플 아이콘(`apple-icon.tsx`) 생성 시, Satori 엔진의 중첩 SVG 렌더링 한계를 회피하기 위해 순수 SVG `<linearGradient>` 코드를 단일 레이아웃과 조합하여 크로스 브라우징 렌더링 안정성을 확보했습니다.
  - **브랜드 아이덴티티 및 아이콘 (The Deck)**: 두 장의 플래시카드가 부채꼴로 살짝 펼쳐진 미니멀 픽토리얼 마크로, 학습 카드 덱이라는 제품 본질을 직관적으로 표현합니다. 뒷장은 -8° 회전하여 '복사 아이콘'이 아닌 '카드 덱'으로 인식되며, 단 2색(`#a5b4fc` + `#0f172a`)의 스트로크 전용 디자인으로 파비콘(32px)에서도 선명하게 렌더링됩니다. `icon.tsx`(32×32), `apple-icon.tsx`(180×180), `<BrandLogo />` 컴포넌트를 통해 앱 전반에 걸쳐 일관된 브랜드 정체성을 제공합니다.

### 3. 백엔드 및 타입 아키텍처 (Backend & Type Architecture)

- **API 및 데이터 통신**:
  - 클라이언트 IndexedDB 및 정적 샘플 덱 엔드포인트를 통해 데이터를 공급합니다.

- **도메인 타입 아키텍처 ("Parse, Don't Validate")**:
  - **중앙화된 도메인 파서 (`src/lib/card-parser.ts`)**: DB에 저장된 원시 카드 문자열은 컴포넌트나 액션에서 `as unknown as CardData`와 같은 위험한 타입 단언으로 임의 캐스팅되지 않습니다. 모든 레코드는 `parseCardData(card)` 및 `parseCardDataList(cards)`를 통해 Zod 스키마로 런타임 검증된 후 정식 `CardData` 판별 유니온 타입으로 승격됩니다.
  - **강제 단언 0% 유지**: 코드베이스 전반에서 `as any` 및 `as unknown as`를 완전히 배제하여 컴파일 타임 및 런타임 무결성을 100% 보장합니다.

- **데이터 검증 및 에러 처리 (Zero-Trust)**:
  - **액션 래퍼 (`safe-action.ts`)**: 모든 Server Actions는 중앙화된 HOC(High-Order Component)로 감싸져 내부 `try/catch` 에러를 일괄 처리합니다. 이를 통해 모든 비즈니스 로직에서 에러 핸들링 코드를 제거하고, 애플리케이션 전체에 일관된 `{ success, message, data }` 형태의 응답을 보장합니다.
  - **공유 스키마 (Zod)**: 클라이언트의 입력값은 절대 신뢰하지 않습니다. 5MB 용량 제한 검사부터 미식별 필드 제거까지, 모든 페이로드는 비즈니스 로직에 도달하기 전 반드시 재사용 가능한 Zod 스키마(`src/lib/schemas.ts`, `src/schemas/deck.ts`)를 통해 엄격하게 검증됩니다.

- **데이터베이스 아키텍처 (100% Zero-Database & Local-First)**:
  - **Zero-Server Database**: 서버 측 데이터베이스(Prisma, SQLite, PostgreSQL 등)를 일체 사용하지 않으며, 서버리스 환경(Vercel 등)에서의 DB 연결 오류나 500 렌더링 충돌 위험을 원천 차단(0%)합니다.
  - **브라우저 영구 저장소 (IndexedDB)**: `decks`, `cards`, `progress`, `exam_results`의 모든 데이터는 사용자 브라우저의 클라이언트 저장소(`src/lib/client-db.ts`)에 단일화되어 보관됩니다.
  - **공개 샘플 덱 (Static Sample Decks)**: 기본 제공되는 공개 샘플 덱(웹 기초, JS 퀴즈, 생활 한국어, 비즈니스 영어)은 `input/public/*.json`에서 서버리스 환경 파일시스템 또는 API(`src/app/api/sample-decks/[deckId]`)를 통해 정적으로 제공됩니다.
  - **상세 시험 기록 추적**: 각 세션의 문제별 정오답 기록(사용자가 선택한 오답 포함)이 브라우저 IndexedDB의 `exam_results` 스토어에 영구 보존되며, 상세 오답 노트 및 백업/복원 기능을 100% 클라이언트 환경에서 제공합니다.

### 4. 데이터 파이프라인 (Data Pipeline)

- **클라이언트 사이드 통합 임포트 (`src/lib/client-db.ts` & Web Upload)**:
  - 사용자가 단어장/퀴즈 JSON 파일을 웹 UI(홈 화면 또는 데이터 관리 탭)에 Drag & Drop하면, 파일이 서버로 전송되지 않고 브라우저 메모리 상에서 Zod 스키마로 즉시 파싱 및 유효성 검증됩니다.
  - **데이터 무결성 보장 (Stable ID & Upsert)**: 문항의 텍스트 콘텐츠(Question/Front)를 기반으로 고유한 해시 식별자를 생성하여 IndexedDB에 저장합니다. 이를 통해 카드를 추가하거나 수정하더라도 기존 카드의 고유 ID가 유지되어 망각 곡선 복습 기록(`progress`)이 안전하게 보존됩니다.
  - **다중 탭 실시간 동기화**: `BroadcastChannel`(`memorize_db_events`) API를 통해 여러 탭이 열려 있어도 덱 추가/삭제, 시험 기록 저장 시 모든 탭이 실시간으로 동기화됩니다.

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant UI as Drag & Drop Dropzone
    participant IDB as IndexedDB (Client Storage)
    participant BC as BroadcastChannel
    
    U->>UI: 1. Drop custom JSON file
    UI->>UI: 2. Validate with Zod Schema
    UI->>IDB: 3. Upsert Deck & Cards (Stable Hash ID)
    IDB-->>UI: 4. Storage Complete
    UI->>BC: 5. Broadcast "deck_created" Event
    BC-->>U: 6. All Open Tabs Instantly Updated
```

### 5. Local-First BYOD 아키텍처 및 개인정보 보호 (BYOD Architecture)

- **제로 서버 BYOD(Bring Your Own Data) 원칙**:
  - 사용자의 개인 소장 학습 데이터, 비공개 노트 및 맞춤형 문제집은 중앙 웹 서버에 업로드하지 않고도 온디바이스에서 완전히 독립적으로 동작해야 합니다.
  - 본 애플리케이션은 사용자가 직접 준비한 JSON 덱을 드래그 앤 드롭하여 브라우저 로컬 IndexedDB에 직접 적재하는 Local-First BYOD 아키텍처를 제공하며, 서버로는 단 1바이트의 사용자 학습 데이터도 전송되지 않습니다.

- **IndexedDB 스토리지 계층 (`src/lib/client-db.ts`)**:
  - **오브젝트 스토어 구성**: `decks`(덱 메타데이터), `cards`(카드 내용), `progress`(에빙하우스 SRS 진도), `exam_results`(모의고사 점수 및 풀이 기록).
  - **인덱스 및 스키마 v2**: `deckId` 인덱스 외에 `exam_results`에 `createdAt` 인덱스를 추가하여 고속 역순 쿼리를 지원합니다.
  - **커넥션 풀링 및 싱글톤**: `cachedDbPromise`를 통해 연결 핸드셰이크 오버헤드를 제거하고, `onversionchange`를 처리하여 탭 간 블로킹을 방지합니다.
  - **스키마 무결성 검증**: 임포트되는 모든 JSON 문자열은 Zod `DeckSchema`를 통해 런타임 유효성 검사를 거친 후 저장됩니다.

- **브라우저 스토리지 영구 보존 및 진단 (Anti-Eviction & Diagnostics)**:
  - **영구 보존 보장 (`requestPersistentStorage`)**: Safari ITP의 7일 미사용 시 자동 스토리지 증발 및 디스크 부족 시 브라우저 강제 삭제(Eviction)를 방지하기 위해 `navigator.storage.persist()`를 연동합니다.
  - **용량 진단 (`getStorageEstimate`)**: `navigator.storage.estimate()`를 통해 현재 기기에서 사용 중인 용량(MB)과 영구 보존 상태를 사용자 UI에 직관적으로 제공합니다.

- **멀티 탭 실시간 동기화 (`BroadcastChannel`)**:
  - 웹 표준 `BroadcastChannel`을 활용하여 한 탭에서 덱 추가/삭제, 모의고사 응시, 백업 복원 발생 시 다른 열려있는 모든 탭의 덱 갤러리 및 기록 뷰가 새로고침 없이 즉각 동기화됩니다.

- **클라이언트 사이드 SRS 및 셔플링 (`src/components/cards/DeckClientLoader.tsx`)**:
  - 사용자가 로컬 덱 URL(`/deck/local_...`)로 진입하면 서버 컴포넌트가 `DeckClientLoader`로 위임합니다.
  - `DeckClientLoader`는 IndexedDB에서 카드와 학습 진도를 불러온 뒤, 서버와 100% 동일한 3단계 SRS 우선순위(미출제 -> 취약 문제 -> 일반 복습)와 Fisher-Yates 셔플 알고리즘을 적용하여 플레이어를 기동합니다.

- **데이터 라이프사이클 및 백업/복원 관리**:
  - 사용자는 개별 시험 기록을 삭제하거나, 원클릭으로 로컬 덱과 관련된 모든 진도 및 시험 기록을 단일 트랜잭션으로 영구 삭제할 수 있습니다.
  - 브라우저 캐시 삭제로 인한 데이터 유실을 방지하고 기기 간 데이터를 이전할 수 있도록, 종합 JSON 백업 내보내기(`exportLocalDataJson`) 및 백업 복원(`importBackupJson`)을 지원합니다.

### 6. 인프라 및 배포 (Infrastructure & Deployment)

- **배포 환경**:
  - 기본적으로는 로컬(Self-hosted)에서 `npm run build`로 구동되지만, Vercel 등의 서버리스 호스팅 플랫폼 배포도 완벽하게 지원합니다. (서버리스 배포 시 Turso, Supabase 등 외부 프로덕션 데이터베이스 사용 권장)
- **CI/CD 파이프라인**:
  - GitHub Actions를 구성하여 Type Check 및 Linting(`npm run lint`)을 수행하고, `input/public/` 폴더에 JSON 파일 푸시 시 자동으로 DB 프로덕션 환경에 `npm run etl`을 수행하는 자동화 파이프라인을 연동할 수 있습니다.
- **환경 변수 관리**:
  - `.env` 파일을 통해 `DATABASE_URL` 등 핵심 변수를 주입받습니다.

### 7. 검증 및 Fail Fast 파이프라인 (Verification & Fail Fast Pipeline)

- **Fail Fast, Fail Cheap 원칙**:
  - 검증 단계는 소요 시간과 컴퓨팅/토큰 비용 오름차순으로 엄격하게 배치됩니다.
  - 빠르고 비용이 저렴한 정적 검사를 먼저 수행하여 실패 시 즉시 중단(Short-Circuit)함으로써 무거운 빌드 과정의 토큰 및 시간 낭비를 원천 차단합니다.

```mermaid
flowchart TD
    S1["Step 1: check:node (~0.1s, Engine Verification)"]
    S2["Step 2: type-check (~1.5s, tsc --noEmit)"]
    S3["Step 3: lint (~1.5s, ESLint 0 errors / 0 warnings)"]
    S4["Step 4: build (~10-12s, Turbopack Production Bundle)"]

    S1 -->|Pass| S2
    S2 -->|Pass| S3
    S3 -->|Pass| S4

    S2 -.->|Fail| F1["Halt immediately with pinpoint 1-line TS error"]
    S3 -.->|Fail| F2["Halt immediately on lint rule violation"]
```

- **파이프라인 명령어 체계**:
  - `npm run check:fast`: 개발 루프 중간에 빌드를 제외하고 Node 버전 → 타입 체크 → 린트만 약 3초 만에 검증하는 초고속 루프 명령어 (LLM 턴 시간 및 토큰 절약).
  - `npm run type-check`: 컴파일 출력 없이 타입 무결성만 1.5초 만에 검증하는 초고속 정적 타입 체크 (`tsc --noEmit`).
  - `npm run lint`: 0 에러 / 0 경고를 엄격히 강제하는 ESLint 코드 스타일 및 품질 검사.
  - `npm run build`: Next.js Turbopack 프로덕션 번들 생성 및 정적 페이지 빌드.
  - `npm run check`: Node 버전 검사부터 타입 체크, 린트, 빌드를 순차 실행하며 실패 시 즉시 멈추는 전체 파이프라인.

### 8. 품질 및 진단 표준 (Quality & Diagnostics Standards)

- **Tailwind CSS v4 캐노니컬 표준**: v4 공식 유틸리티(`bg-linear-to-*`, `shrink-0`, `grow-0`, `top-(--header-height)`)를 엄격히 준수하며 구형 문법 및 CSS 충돌을 배제합니다.
- **ESLint 무결성**: `npm run lint` 실행 시 0 에러 / 0 경고를 상시 유지합니다.
- **맞춤법 검사 (cSpell)**: 프로젝트 도메인 용어 및 약어는 `.vscode/settings.json`의 `cSpell.words`에 등록하여 관리합니다.

---

## 🇺🇸 English

This document defines the system architecture of the `memorize_supporter` project.

### 1. Overview

- **Purpose**: A general-purpose memorization application designed to help users efficiently memorize flashcards (pinpoint tips), multiple-choice questions, and vocabulary. It maximizes learning efficiency by adopting cognitive science principles (Active Recall, Spaced Repetition) and a focus-mode design.
- **Core Components**:
  - `DeckGallery`: Client-side component for real-time deck search and series filtering, optimized with `useDeferredValue`.
  - `UploadZone`: Drag & Drop JSON importer in the data management page, supporting single and multi-file batch uploads directly into browser IndexedDB without server transmission.
  - `DeckPlayer`, `Flashcard`, `VocabularyCard`, `PracticeQuizCard`: Frontend interactive card renderer (handling micro-animations and feedback).
  - `DeckClientLoader`: Client-side deck runner that dynamically retrieves and prioritizes cards from IndexedDB for local-only decks.
  - `ExamResultView`: Comprehensive exam review interface supporting question-by-question replay, visual color-coded answer comparison, and "Retry Incorrect Only" session trigger.
  - `LocalRecordsView`: Unified exam records interface for on-device quiz history, featuring local record deletion and one-click JSON backup export.
  - `DataManagement` & `DataPreparation`: Web-based interactive interfaces for JSON deck uploads, metadata edits, and real-time schema validation.
  - `IndexedDB Client Storage` (`src/lib/client-db.ts`): Browser-native persistence layer providing complete local isolation for private user study materials, forgetting curves, and quiz scores.
  - `CardParser` (`src/lib/card-parser.ts`): Single Source of Truth for Zod runtime-to-compile-time domain model promotion.

### 2. Frontend

- **Framework and Routing Strategy**:
  - Next.js (App Router) / React 19
  - Optimizes rendering performance by strictly separating Server Components (data fetching: `app/[lang]/deck/[deckId]/page.tsx`) and Client Components (interactions: `Flashcard.tsx`).

- **Card Selection Strategy**:
  - **Priority 1 (Unasked)**: Cards with no learning history are presented first to ensure full coverage of the deck.
  - **Priority 2 (Incorrect)**: Cards with a history of incorrect answers are prioritized next, sorted descending by their estimated failed count to target weaknesses.
  - **Priority 3 (General)**: Cards perfectly answered are presented last, sorted ascending by their review count to solidify newer knowledge before re-testing heavily drilled cards.

- **i18n Strategy & Product UX Writing**:
  - **URL as Single Source of Truth (SSoT)**: Uses dynamic routing (`app/[lang]/...`) to manage the current language state. This prevents hydration errors caused by resolving language through cookies or local storage during SSR.
  - **Strictly Typed Translations (SSoT)**: Managed via `src/i18n/types.ts` as the single source of truth, synchronizing Korean (`ko.ts`), English (`en.ts`), and Japanese (`ja.ts`) with 100% type safety and natural product-oriented UX copywriting.
  - **Locale Routing via Proxy**: Adheres to Next.js 16 conventions by using `src/proxy.ts` for dynamic locale routing. Locale constants are isolated in `src/i18n/settings.ts` to maintain a single source of truth across the application.

- **State Management Strategy**:
  - Manages the learning progress and flip state of the current deck using local state (`useState`). Avoids using complex global state managers (like Redux).

- **Styling, Micro-animations, and Accessibility**:
  - Focus-mode layout based on a Zinc (background) and Teal/Indigo (primary) dark mode theme using Tailwind CSS v4 (`@tailwindcss/postcss`).
  - Enhances code readability and maintainability by defining global semantic utilities (e.g., `@utility .glass-panel`, `@utility .btn-indigo`, 3D transforms) and design tokens (e.g., `--header-height: 4rem;`) in `globals.css` via Tailwind CSS v4 `@theme` and `@utility` directives.
  - **CJK Typography Optimization**: Configures `word-break: keep-all; overflow-wrap: anywhere;` on `body` in `globals.css` to prevent unnatural word splitting in Korean and Japanese, while preventing text overflow in narrow mobile viewports.
  - **Adaptive Height & Motion Control**: Uses `AnimatePresence` with `initial={false}` and `useReducedMotion` (`motion-reduce:` variants) in cards and interactive controls to adapt smoothly to varying content lengths without layout jitter.
  - **Multiple-Choice Selection Constraint**: Dynamically restricts the maximum number of selectable options to the exact count of correct answers (`content.answers.length`), providing immediate toast feedback and live selection progress badges (`(1/2 selected)`) to prevent accidental excessive clicks.
  - **Comprehensive Explanation & Visual Highlights**: In quiz result/review views, displays all available choices (`content.options`) with color-coded and badged visual highlights (Emerald for correct answers, Rose for user-selected incorrect answers, and neutral for unpicked choices) to reinforce Active Recall.
  - **SSoT Sticky Header & Unified `QuizHeader` Component**: Implements a reusable `QuizHeader` (and matching `QuizHeader.Skeleton`) that sticks beneath the global navigation bar (`sticky top-(--header-height) z-30 backdrop-blur-md`). This resolves header collision, eliminates vertical gaps by replacing dynamic `my-auto` margins with consistent top alignment, and unifies progress tracking across practice, exam, and review modes without layout shift (CLS).
  - **Seamless Review Navigation & Shortcuts**: In exam history and question review views, provides dual navigation controls (sticky top header and card bottom action buttons) along with full keyboard navigation (`ArrowLeft`/`ArrowRight` for prev/next question, `Escape` for list view, `Enter`/`Space` for progression) to review question details consecutively without navigating back and forth.
  - Adheres strictly to Vercel Web Interface Guidelines for accessibility, including proper semantic HTML, WAI-ARIA attributes (`role="group"`, `aria-pressed`, `aria-label`), robust keyboard navigation focus states (`focus-visible`), fixed-width numeric typography (`tabular-nums`), and touch feedback (`active:scale-95`).
  - Implements custom accessible UI components (e.g., `CustomSelect` using React Portals) to replace native browser elements, ensuring a consistent premium look (glassmorphism) across all platforms while maintaining strict WAI-ARIA combobox standards and keyboard type-ahead navigation.
  - Provides visual feedback such as a 180-degree 3D flip and Scale Pop by integrating `framer-motion`.

- **PWA & Metadata Strategy**:
  - Implements a Progressive Web App (PWA) standard `manifest.ts` to seamlessly integrate with native device environments (e.g., theme color matching, standalone display).
  - Ensures cross-browser rendering reliability by using pure SVG `<linearGradient>` code for dynamic favicons (`icon.tsx`) and high-resolution Apple icons (`apple-icon.tsx`), bypassing Satori's nested SVG rendering limitations.
  - **Brand Identity & Iconography (The Deck)**: A minimal pictorial mark of two fanned flashcards representing a study deck. The back card is rotated -8° to distinguish it from a generic "copy" icon. Uses a strict 2-color palette (`#a5b4fc` stroke on `#0f172a` background) with no gradients, ensuring clarity even at favicon size (32px). Rendered consistently across `icon.tsx` (32×32), `apple-icon.tsx` (180×180), and the reusable `<BrandLogo />` component.

### 3. Backend & Type Architecture

- **API and Data Communication**:
  - Supplies data directly through client-side IndexedDB and static sample deck endpoints without an external database server.

- **Domain Type Architecture: "Parse, Don't Validate"**:
  - **Centralized Domain Parser (`src/lib/card-parser.ts`)**: Raw card strings stored in the database are never blindly cast using unsafe assertions like `as unknown as CardData`. All records are validated at runtime against Zod schemas and promoted to the strictly-typed `CardData` discriminated union.
  - **Zero Unsafe Assertions**: Ensures 0% `as any` or `as unknown as` assertions across the entire codebase.

- **Data Validation & Error Handling (Zero-Trust)**:
  - **Shared Schema (Zod)**: Client inputs are never trusted. Every payload (e.g., 5MB limit check, unknown field stripping) is strictly parsed through reusable Zod schemas (`src/lib/schemas.ts`, `src/schemas/deck.ts`) *before* reaching the business logic.

- **Database Architecture (100% Zero-Database & Local-First)**:
  - **Zero-Server Database**: Does not use any server-side database (Prisma, SQLite, PostgreSQL, etc.), eliminating 100% of serverless DB connection errors and 500 rendering crashes.
  - **Browser Persistent Storage (IndexedDB)**: All data (`decks`, `cards`, `progress`, `exam_results`) is stored in the browser's client storage (`src/lib/client-db.ts`).
  - **Static Sample Decks**: Pre-packaged public sample decks are loaded statically from `input/public/*.json` or via `/api/sample-decks`.
  - **Detailed Exam History Tracking**: Question-by-question exam results (including chosen incorrect options) are stored permanently in the `exam_results` IndexedDB object store, providing detailed review and backup/restore entirely client-side.

### 4. Data Pipeline

- **Custom ETL Pipeline (`src/scripts/etl.ts` & Web Upload)**:
  - Parses original JSON data and loads it into the DB via Prisma Client. Web UI drag & drop upload shares the exact same integrity logic.
  - **Data Integrity Guarantee (Stable ID & Upsert)**: Uses the `crypto` module to generate a unique MD5 hash identifier based on the text content of the question/front. Through this, even if cards are added or deleted, the unique ID of existing cards is maintained, so the user's forgetting curve review record (`learningProgress`) is not destroyed and is safely preserved (Upsert).
  - Execution command: `npm run etl` (TypeScript script execution via tsx).

```mermaid
sequenceDiagram
    participant J as JSON Files (input/)
    participant E as ETL Script (etl.ts)
    participant C as Crypto Module
    participant DB as SQLite DB
    
    E->>J: 1. Read JSON Data
    J-->>E: Return Cards Array
    loop For each card
        E->>C: 2. Generate MD5 Hash based on Text
        C-->>E: Return Stable Hash ID
        E->>DB: 3. Upsert Card with Hash ID
        DB-->>E: Success (Preserves Learning Progress)
    end
```

### 5. Local-First BYOD Architecture & Privacy Protection

- **Zero-Server BYOD (Bring Your Own Data) Principle**:
  - User study materials, private notes, and custom flashcards must remain completely private and operable on-device without remote cloud transmission.
  - The application provides a Local-First BYOD architecture where decks and cards are imported directly into the user's browser IndexedDB via drag-and-drop, with 0 bytes transmitted to any server.

- **IndexedDB Storage Layer (`src/lib/client-db.ts`)**:
  - **Object Stores**: `decks` (deck metadata), `cards` (card contents), `progress` (Ebbinghaus SRS state), `exam_results` (quiz scores and answers).
  - **Indexing & Schema v2**: In addition to `deckId`, `exam_results` includes an index on `createdAt` for fast reverse-chronological retrieval.
  - **Connection Pooling & Singleton**: `cachedDbPromise` eliminates handshake overhead across calls, while handling `onversionchange` to prevent cross-tab upgrade blocking.
  - **Schema Validation**: All imported JSON strings are validated at runtime against Zod `DeckSchema` before being persisted.

- **Storage Persistence & Diagnostics (Anti-Eviction & Diagnostics)**:
  - **Persistence Guard (`requestPersistentStorage`)**: Integrates `navigator.storage.persist()` to protect user study material and quiz progress from Safari ITP 7-day inactivity eviction and browser storage pressure wiping.
  - **Quota Diagnostics (`getStorageEstimate`)**: Leverages `navigator.storage.estimate()` to inspect storage usage (MB) and persistence status directly in the user interface.

- **Multi-Tab Reactive Synchronization (`BroadcastChannel`)**:
  - Employs standard `BroadcastChannel` to propagate deck creations, deletions, exam completions, and backup restorations across all open browser tabs in real time without manual reloads.

- **Client-Side SRS & Shuffling (`src/components/cards/DeckClientLoader.tsx`)**:
  - When navigating to a local deck URL (`/deck/local_...`), the server component delegates to `DeckClientLoader`.
  - `DeckClientLoader` loads cards and progress from IndexedDB and applies the exact same 3-tier SRS priority ordering (Unasked -> Weakest -> Review) and Fisher-Yates shuffle algorithm used by the server.

- **Data Lifecycle & Backup/Restore (`exportLocalDataJson`, `importBackupJson`, `deleteLocalDeck`, `deleteLocalExamResult`)**:
  - Users can delete individual local exam records or wipe an entire local deck with all associated progress in a single atomic transaction.
  - To prevent data loss when clearing browser cache and allow seamless data migration across devices, users can export and restore all on-device data via JSON backup files (`exportLocalDataJson` / `importBackupJson`).

### 6. Infrastructure & Deployment

- **Deployment Environment**:
  - By default, it runs locally (Self-hosted) via `npm run build`, but it fully supports deployment on serverless hosting platforms like Vercel. (When deploying serverless, using an external production database such as Turso or Supabase is recommended).
- **CI/CD Pipeline**:
  - GitHub Actions can be configured to perform Type Check and Linting (`npm run lint`), as well as automate the ETL pipeline when JSON files are pushed to `input/public/`.
- **Environment Variable Management**:
  - Core variables like `DATABASE_URL` are injected through the `.env` file.

### 7. Verification & Fail Fast Pipeline

- **The "Fail Fast, Fail Cheap" Principle**:
  - Verification steps are ordered strictly by cost and execution speed.
  - Fast, token-efficient static checks are executed first, short-circuiting immediately upon any failure to avoid running heavy, token-expensive build processes.

```mermaid
flowchart TD
    S1["Step 1: check:node (~0.1s, Engine Verification)"]
    S2["Step 2: type-check (~1.5s, tsc --noEmit)"]
    S3["Step 3: lint (~1.5s, ESLint 0 errors / 0 warnings)"]
    S4["Step 4: build (~10-12s, Turbopack Production Bundle)"]

    S1 -->|Pass| S2
    S2 -->|Pass| S3
    S3 -->|Pass| S4

    S2 -.->|Fail| F1["Halt immediately with pinpoint 1-line TS error"]
    S3 -.->|Fail| F2["Halt immediately on lint rule violation"]
```

- **Pipeline Commands**:
  - `npm run check:fast`: Rapid iterative dev loop check executing Node engine verification → Type Check → Lint in ~3 seconds (saves LLM turn time and tokens).
  - `npm run type-check`: Ultra-fast TypeScript static check without emitting output files (`tsc --noEmit`).
  - `npm run lint`: Strict ESLint check enforcing 0 errors and 0 warnings.
  - `npm run build`: Production Next.js Turbopack compiler and static page generation.
  - `npm run check`: Chained all-in-one verification pipeline executing `check:node && type-check && lint && build`.

### 8. Quality & Diagnostics Standards

- **Tailwind CSS v4 Canonical Rules**: Strict adherence to v4 standard utilities (`bg-linear-to-*`, `shrink-0`, `grow-0`, `@theme` token references like `top-(--header-height)`). Zero CSS conflicts or obsolete syntax.
- **ESLint Zero Tolerance**: All PRs and commits must maintain 0 errors and 0 warnings on `npm run lint`.
- **Domain Spellcheck (cSpell)**: All project domain words, classes, and acronyms are registered and managed in `.vscode/settings.json` under `cSpell.words`.
