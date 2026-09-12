---
description: 프론트엔드 UI/UX 컴포넌트 신규 생성, 수정, 리팩토링 및 디자인 시스템 고도화
---

# Frontend Engineering Workflow

**Activation:** `/frontend` (또는 프론트엔드 UI/UX 컴포넌트, 페이지, 상태 관리 로직 등의 신규 생성, 수정, 리팩토링, 디자인 개선을 진행할 때)

이 워크플로우는 프론트엔드 개발 및 디자인의 전 라이프사이클에 적용되는 마스터 가이드라인입니다. 단순한 기능 구현을 넘어, AI 전형적 템플릿(AI Slop)을 배제하고 프로덕션 수준의 시각적 완성도와 접근성을 보장하기 위해 체계적인 단계별 프로세스를 엄격히 준수합니다.

---

## 1. 기술 스택 및 아키텍처 컨텍스트 확인 (필수)
- 작업 시작 전 반드시 `.agents/rules/project-context.md`를 읽고 현재 프로젝트에 설정된 **프론트엔드 프레임워크, 스타일링 방식, 상태 관리 도구**를 확인합니다.
- 어떠한 특정 기술도 임의로 가정하지 않으며, 오직 `project-context.md`에 명시된 기술 스택과 아키텍처 원칙을 준수합니다.
- **아키텍처 스킬 참조:**
  - **Next.js 앱 라우터 최적화:** 서버 컴포넌트(RSC)와 클라이언트 컴포넌트를 분리하거나 데이터를 패칭할 때 `.agents/skills/nextjs-best-practices/SKILL.md`를 숙지하여 렌더링 최적화를 달성합니다.
  - **정밀한 TypeScript 타입 시스템:** 프론트엔드 상태, Props, 컴포저블 훅 등의 정밀한 타입 검증이 필요하면 `.agents/skills/typescript-expert/SKILL.md`를 참조합니다.
  - **로컬 런타임 라이브 검증:** 컴포넌트 수정 후 UI 및 런타임 동작을 최종 확인할 때는 `.agents/skills/next-dev-loop/SKILL.md`를 바탕으로 라이브 검증을 수행합니다.
  - **로컬 퍼스트 & 클라이언트 DB 연동:** 브라우저 로컬 모드(BYOD), 클라이언트 상태 동기화, IndexedDB 연동, `BroadcastChannel` 다중 탭 이벤트 수신 및 스토리지 용량 진단(`getStorageEstimate`) UI 구현 시 `.agents/skills/local-first/SKILL.md`를 참조합니다.
  - **AI 프롬프트 생성기 및 템플릿 UI 작업:** 데이터 준비 덱 생성기(`aiPromptGenerator`), 덱 변환 프롬프트(`promptFormat`), 오답 튜터 질문(`aiDeepPrompt`) 등 AI 프롬프트와 관련된 컴포넌트나 다국어 템플릿을 신규 생성/수정할 때는 반드시 `.agents/workflows/prompt.md` 워크플로우를 참조하여 템플릿 품질과 일관성을 보장합니다.

---

## 2. 디자인 기획 & 디자인 시스템 수립 (Design Read & Planning)

UI/UX 컴포넌트나 신규 페이지 작업 착수 전, 반드시 아래 3대 핵심 디자인 스킬을 순차적으로 가동합니다:

### Step 2-A. 의도 추론 및 3대 다이얼 설정 (`design-taste-frontend`)
- **참조 스킬:** `.agents/skills/design-taste-frontend/SKILL.md`
- **Design Read 선언 (필수):** 코드를 작성하기 전, 한 줄로 설계 방향성을 명시합니다:
  - *"Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<design system or aesthetic family>."*
  - *프로젝트 예시:* `"Reading this as: Flashcard & Quiz learning platform for self-directed learners, with a Linear-style clean language, leaning toward Tailwind v4 utilities + restrained motion + functional minimalism."`
- **3대 다이얼(Core Dials) 설정:**
  - `DESIGN_VARIANCE`: 기본값 7~8 (1=완벽한 대칭 ~ 10=아티스틱한 변주)
  - `MOTION_INTENSITY`: 기본값 5~6 (1=정적 ~ 10=물리 기반 동역학)
  - `VISUAL_DENSITY`: 기본값 3~4 (1=여백 중심 갤러리 ~ 10=고밀도 콕핏/대시보드)
- **AI 전형적 기본값(Default Clichés) 적극 탈피:**
  - AI 보라색(AI-purple) 그라디언트, 다크 메쉬 위의 중앙 정렬 히어로, 동일한 3단 카드 나열, 무분별한 글래스모피즘 남발을 엄격히 금지합니다.

### Step 2-B. 디자인 시스템 자동 추천 및 검색 (`ui-ux-pro-max`)
- **참조 스킬:** `.agents/skills/ui-ux-pro-max/SKILL.md`
- **CLI 디자인 시스템 생성 (필수):** 새로운 페이지나 대규모 UI 개편 시 Python CLI를 실행하여 최적의 팔레트, 타이포그래피, 레이아웃 추천을 도출합니다:
  ```bash
  python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system
  ```
  - *프로젝트 추천 키워드 예시:* `"flashcard active-recall quiz educational minimal dark-mode"`, `"learning tool student knowledge-base clean"`
- **10대 우선순위 규칙 체계 준수:**
  - 1순위: 접근성 (Accessibility, CRITICAL)
  - 2순위: 터치 및 인터랙션 (Touch & Interaction, CRITICAL)
  - 3순위: 렌더링 성능 (Performance, HIGH)
  - 4순위: 스타일 일치성 (Style Selection, HIGH)
  - 5순위: 반응형 레이아웃 (Layout & Responsive, HIGH)
  - 6순위: 타이포그래피 및 색상 (Typography & Color, MEDIUM)
  - 7순위: 모션 및 애니메이션 (Animation, MEDIUM)
  - 8순위: 폼 및 사용자 피드백 (Forms & Feedback, MEDIUM)
  - 9순위: 내비게이션 패턴 (Navigation Patterns, HIGH)
  - 10순위: 데이터 시각화 (Charts & Data, LOW)

### Step 2-C. 2-Pass 디자인 플래닝 & 시그니처 요소 선정 (`frontend-design`)
- **참조 스킬:** `.agents/skills/frontend-design/SKILL.md`
- **Pass 1 (브레인스토밍):** 컴팩트 토큰 시스템(4~6개 시맨틱 색상, 헤딩/본문 폰트 역할 정의, 레이아웃 컨셉) 정의.
- **Pass 2 (자기 비판 및 점검):** 도출된 디자인 플랜이 흔한 AI 템플릿(크림색+세리프, 다크+애시드그린, 브로드시트 신문 스타일)에 머물러 있지 않은지 자가 검증 후 차별화.
- **시그니처 요소(Signature Element):** 사용자의 기억에 남을 단 하나의 차별화된 인터랙티브 또는 시각적 포인트를 반드시 정의하고 구현합니다.
- **디자인 속 글쓰기 (Writing in Design):** 능동태 사용("제출" 대신 "변경사항 저장"), 사용자가 통제하는 기능 중심 명명, 상태/에러 안내 시 자책이나 모호한 사과 대신 직관적인 다음 행동 지침 제시.

---

## 3. 비주얼 에셋 & 브랜드 마크 파이프라인 (Visual Assets & Logos)

### Step 3-A. 표준 SVG 로고 및 브랜드 마크 (`svg-logo-designer`)
- **참조 스킬:** `.agents/skills/svg-logo-designer/SKILL.md`
- **이모지/임시 텍스트 로고 금지:** 헤더 로고, 서비스 파비콘, 앱 심볼에 이모지(🎨, 🚀)나 임의의 단순 텍스트(`<span>Logo</span>`)를 구조적 아이콘으로 사용하는 것을 엄격히 금지합니다.
- **시맨틱 SVG 락업(Lockup) 생성 원칙:**
  - **확장성:** 고정 픽셀 대신 `viewBox`를 사용하여 임의 크기에서도 완벽한 스케일링 보장.
  - **접근성:** `<svg role="img" aria-labelledby="logo-title logo-desc">`와 내장 `<title>`, `<desc>` 제공.
  - **락업 베리에이션:** 컨텍스트에 맞게 가로형(Horizontal, 헤더용), 세로형(Vertical, 프로필/카드용), 아이콘형(Icon-only, 파비콘/모바일용)을 적절히 도출.
  - **다크/라이트 모드 대응:** CSS 클래스(`fill-current`, 테마 토큰)를 사용하여 테마 전환 시 자연스럽게 반전되도록 구성.

### Step 3-B. 실제 비주얼 우선 원칙 & 가짜 스크린샷 금지 (`design-taste-frontend`)
- **가짜 스크린샷 div 전면 금지:** `<div>` 박스를 중첩하여 만든 가짜 대시보드, 가짜 터미널, 가짜 작업 목록 등 AI 전형적인 가짜 UI 프리뷰 작성을 금지합니다.
- **실제 에셋 활용 순서:**
  1. 환경 내 이미지 생성 도구(`generate_image` 등)를 활용하여 섹션별 고화질 비주얼 에셋 생성.
  2. 실제 컴포넌트 미니 프리뷰(동작 가능한 실제 미니 UI) 렌더링.
  3. 실사 이미지/라이브러리 벡터 에셋 활용.
  4. 파트너/신뢰 로고 월 구성 시 Simple Icons 등의 실제 브랜드 SVG 사용 (로고 밑 카테고리 텍스트 부착 금지).

---

## 4. 하드 레이아웃 규율 & 부정 제약 조건 (Hard Layout & Negative Constraints)

다음 규칙을 위반하는 것은 '깨진 결과물(Broken Work)'을 배포하는 것과 같습니다:

- **히어로(Hero) 뷰포트 규율:**
  - 데스크톱 초기 뷰포트(`min-h-[100dvh]`) 내에 완전히 안착해야 합니다.
  - 헤드라인은 최대 2줄, 서브텍스트는 **최대 20단어 및 3~4줄 이내**로 제한합니다.
  - 사용자가 스크롤하지 않고도 1차 CTA 버튼이 반드시 보여야 합니다.
  - 상단 패딩 상한: 데스크톱 기준 `pt-24` (≈6rem) 초과를 금지합니다.
  - 로고 월("Trusted by")은 히어로 내부에 욱여넣지 말고, 히어로 직하단 별도 섹션으로 분리합니다.
- **네비게이션 규율:**
  - 데스크톱에서 네비게이션 아이템이 2줄로 꺾이는 현상을 엄격히 금지합니다 (반드시 1줄 렌더링).
  - 네비게이션 높이는 기본 64~72px, 최대 80px 이하로 제한합니다.
- **벤토 그리드(Bento Grid) 셀 일치 규율:**
  - 콘텐츠 개수와 셀 개수가 정확히 1:1로 일치해야 합니다 (빈 셀 남기기 금지).
  - 셀 배경은 흰색 카드 일색을 피하고, 2~3개 셀에는 시각적 다양성(이미지, 은은한 틴트, 패턴 등)을 부여합니다.
- **아이브로우(Eyebrow) 절제 규율:**
  - 섹션 상단의 작은 대문자 라벨(`uppercase tracking-wide`)은 **3개 섹션당 최대 1개**만 허용합니다 (모든 섹션마다 반복 금지).
- **CTA 버튼 규율:**
  - 데스크톱에서 CTA 버튼 텍스트가 줄바꿈(Wrap)되는 것을 금지합니다.
  - 한 페이지 내에 동일한 목적을 가진 중복 CTA 라벨(예: "문의하기"와 "상담 시작하기" 혼용)을 금지하며, 단일 라벨로 통일합니다.
- **애니메이션 & 모션 금지 패턴:**
  - `window.addEventListener("scroll")` 직접 등록을 금지합니다 (Motion의 `useScroll()`, GSAP `ScrollTrigger` 또는 IntersectionObserver 사용).
  - 마우스 위치, 스크롤 진척도 등 연속적인 인터랙션 값을 React `useState`로 추적하는 행위를 금지합니다 (`useMotionValue` / `useTransform` 사용).
  - 모든 모션(`MOTION_INTENSITY > 3`)은 반드시 `prefers-reduced-motion` 미디어 쿼리 및 `useReducedMotion()`을 존중하여 정적 상태로 우아하게 감쇄(degrade)되어야 합니다.

---

## 5. 다국어(i18n) 지원 및 UI 제로 하드코딩 (Zero Hardcoding Policy)

- **하드코딩 0개 원칙 (절대 준수):**
  - 컴포넌트 내에 사용자 대면 텍스트, 버튼 라벨, 뱃지, 태그, `placeholder`, `aria-label`, 툴팁, 페이지 메타데이터 등을 직접 문자열 리터럴로 인라인 작성하는 것을 전면 금지합니다.
- **엄격한 3개 국어 동기화 파이프라인:**
  1. `src/i18n/types.ts`: 신규 번역 키의 TypeScript 인터페이스 정의 추가
  2. `src/i18n/ko.ts`, `src/i18n/en.ts`, `src/i18n/ja.ts`: 3개 국어 파일에 동일한 키와 언어별 정밀 번역값 100% 동기화 (누락 금지)
  3. 클라이언트 컴포넌트에서는 `const t = useT()`, 서버 컴포넌트에서는 `getT(lang)`을 호출하여 바인딩
- **사후 자가 점검:** 작업 후 스테이징 전 `git diff`를 전수 조사하여 JSX 내에 하드코딩된 한글/영어/일본어 문자열이 단 하나도 남아있지 않은지 검증합니다.

---

## 6. Tailwind CSS v4 캐노니컬 스타일링 표준

- 컴포넌트 및 스타일 작성/수정 시, Tailwind CSS v4의 공식 캐노니컬 클래스 규칙을 철저히 준수합니다:
  - 그라디언트: `bg-gradient-to-*` 대신 **`bg-linear-to-*`** 사용
  - 플렉스 축소/확장: `flex-shrink-*` 대신 **`shrink-*`**, `flex-grow-*` 대신 **`grow-*`** 사용
  - 스케일/사이징: 분수/소수점 캐노니컬 클래스(예: `min-w-17.5`, `h-13`, `p-px` 등) 및 `@theme` 토큰 우선 활용
  - CSS 변수 바인딩: `top-[var(--header-height,4rem)]` 대신 **`top-(--header-height)`** 사용
- 작업 완료 전 CSS 충돌(`tailwindcss(cssConflict)`) 및 캐노니컬 제안(`tailwindcss(suggestCanonicalClasses)`) 등의 린트/진단 검출 결과가 남아있지 않은지 필히 확인합니다.

---

## 7. 구조화 및 리팩토링 모범 사례

- 모든 컴포넌트와 모듈은 Next.js 및 React 모범 사례에 맞춰 작성합니다.
- 복잡한 상태 로직은 뷰(View) 렌더링과 격리하여 테스트 가능한 커스텀 훅이나 순수 함수 유틸리티로 분리합니다.
- 모듈 임포트 시 프로젝트 절대 경로 별칭(`@/`)을 일관되게 사용합니다.

---

## 8. 사후 전수 감사 및 무결성 검증 (Audit & QA Checklist)

작업 완료 전 다음 3단계 검증을 전수 통과해야 합니다:

### Step 8-A. 웹 인터페이스 가이드라인 감사 (`web-design-guidelines`)
- **참조 스킬:** `.agents/skills/web-design-guidelines/SKILL.md`
- 수정한 컴포넌트에 대해 Vercel Web Interface Guidelines 규칙을 바탕으로 정밀 감사를 수행하고 결함을 `file:line` 포맷으로 식별하여 수정합니다:
  - [ ] 텍스트 대비율 최소 4.5:1 (대형 텍스트 3:1) 이상 충족
  - [ ] 대화형 요소 최소 터치 타겟 44×44px 확보 및 터치 간격 8px 이상 유지
  - [ ] 모든 대화형 컨트롤에 명확한 키보드 포커스 링(`focus-visible`) 표시
  - [ ] 모든 아이콘 전용 버튼에 유효한 `aria-label` 부여
  - [ ] 폼 입력 필드에 레이블(`label for`) 및 에러 문구(`role="alert"`) 연결

### Step 8-B. UI/UX Pro Max 프리 딜리버리 체크리스트 (`ui-ux-pro-max`)
- [ ] 구조적 아이콘에 이모지를 사용하지 않고 일관된 SVG 아이콘 세트 적용
- [ ] 클릭/탭 시 80~150ms 이내에 시각적 피드백(opacity/scale/ripple) 제공
- [ ] 레이아웃 점프를 유발하지 않도록 미디어 요소에 명시적 비율(`aspect-ratio`) 또는 스켈레톤 적용
- [ ] 라이트 모드와 다크 모드 각각에서 텍스트 및 경계선 가독성 전수 확인

### Step 8-C. 프로젝트 정적 진단 및 린트 검증
- **린트 무결성:** `npm run lint` 실행 시 **0 error / 0 warning** 필수 유지.
- **맞춤법(cSpell):** 오탈자 검출 여부 확인 및 프로젝트 도메인 단어는 `.vscode/settings.json` 등록.
- **초고속 통합 진단:** `npm run check:fast` (타입 검사 + 린트) 통과 확인.
