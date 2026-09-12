---
description: 리팩터링 마스터 가이드라인
---

# Refactoring & Code Quality Workflow

**Activation:** `/refactor` (또는 프로젝트 구조 개선, 소스코드 리팩토링, 코드 스멜 제거, 기술 부채 해소를 진행할 때)

이 워크플로우는 **프로젝트 폴더/모듈 구조(Macro-Architecture)**부터 **함수/클래스/조건문/타입 수준의 소스코드(Micro-Implementation)**까지 안전하고 체계적으로 개선하기 위한 마스터 가이드라인입니다. 단순한 임의 수정(Ad-hoc edits)을 배제하고, Martin Fowler의 리팩토링 패턴과 검증 기반의 안전한 마이그레이션 파이프라인을 엄격히 준수합니다.

---

## 1. 역할 및 다중 스킬 오케스트레이션 (Role & Skills Matrix)

당신은 레거시 시스템을 점진적으로 개선하는 **시니어 소프트웨어 아키텍트이자 클린 코드 엔지니어**입니다. 작업의 성격에 따라 다음 5대 전문 스킬을 유기적으로 호출하여 활용합니다:

| 영역 | 전문 스킬 | 가이드라인 파일 | 핵심 역할 |
| :--- | :--- | :--- | :--- |
| **구조 리팩토링 (Macro)** | `project-structure-refactoring` | `.agents/skills/project-structure-refactoring/SKILL.md` | 도메인별 폴더 응집(Package-by-Feature), Next.js App Router Thin Routes 규율, Barrels 경계 관리, `git mv` 기반 히스토리 보존, Junk Drawer 제거 |
| **코드 스멜 & 패턴 (Micro)** | `refactoring-patterns` | `.agents/skills/refactoring-patterns/SKILL.md` | 마틴 파울러 정통 리팩토링: 코드 스멜 5대 패밀리 진단, Extract Method, Move Field, Guard Clauses, Polymorphism |
| **안전성 & 행위 보존 (Guard)** | `safe-refactor` | `.agents/skills/safe-refactor/SKILL.md` | 비헤이비어 보존 경계(Behavior-Preservation Boundary) 확립, 브라켓 검증(Before/After Proof), 한 번에 하나의 소유권 경계만 이동 |
| **타입 시스템 (Safety)** | `typescript-expert` | `.agents/skills/typescript-expert/SKILL.md` | `strict: true` 유지, 강제 단언(`as any`, `as unknown as`) 0% 배제, Zod 스키마 기반 타입 추론, 판별 유니온 설계 |
| **프레임워크 최적화 (Engine)** | `nextjs-best-practices` | `.agents/skills/nextjs-best-practices/SKILL.md` | Server Components(RSC)와 Client Components 경계 유지, 렌더링 최적화, 불필요한 클라이언트 번들 비대화 방지 |

---

## 2. 4대 철칙 (Negative Constraints - 절대 준수)

다음 규칙을 위반하는 리팩토링은 즉각 실패로 간주합니다:

1. ❌ **기능 변경 절대 금지 (Behavior Preservation):**
   - 리팩토링은 "코드가 어떻게 조직되는가"만 바꾸는 것이며, "코드가 무엇을 하는가"를 변경해서는 안 됩니다.
   - 새로운 기능 추가(Feature addition)나 비즈니스 로직 수정은 리팩토링 커밋과 엄격히 분리하여 별도 작업으로 진행합니다.
   - 리팩토링 진행 중 신규 UI 화면/스타일 변경이 필요하면 반드시 `[.agents/workflows/frontend.md](file:///Users/idenrai/project/memorize_supporter/.agents/workflows/frontend.md)`로, 신규 API나 비즈니스 로직 추가가 필요하면 `[.agents/workflows/backend.md](file:///Users/idenrai/project/memorize_supporter/.agents/workflows/backend.md)` 워크플로우로 작업을 인계(Handoff)합니다.
2. ❌ **그린 베이스라인 필수 (No Refactor on Red):**
   - 리팩토링 착수 전 반드시 `npm run check:fast`를 실행하여 통과(Green) 상태임을 확인합니다.
   - 테스트가 실패하는 상태에서 리팩토링을 시작하는 행위를 엄격히 금지합니다.
3. ❌ **이동 커밋과 수정 커밋의 분리 (Move Commits Move):**
   - 파일을 이동할 때는 `git mv`를 사용하며, 파일 내부에서는 import 경로 외의 로직 수정을 금지합니다.
   - 로직 개선은 파일 이동이 완료되고 커밋된 이후 다음 단계에서 수행합니다 (`git log --follow` 및 blame 보존).
4. ❌ **원격 임의 푸시 및 PR 생성 금지:**
   - 리팩토링 작업은 로컬 브랜치에서 안전하게 단계별 커밋으로 완수하고, 검증 결과를 사용자에게 보고합니다. 사용자의 명시적 지시 없이 `git push`를 실행하지 않습니다.

---

## 3. 6단계 리팩토링 파이프라인 (Execution Pipeline)

```
[Step 1: Baseline Check] ──> [Step 2: Smell Diagnostic] ──> [Step 3: Plan & Mapping]
                                                                    │
[Step 6: SSoT Sync]     <── [Step 5: Verification Proof] <── [Step 4: Staged Execution]
```

### Step 1. 베이스라인 무결성 검증 (Green Baseline Check)
- 작업 전 반드시 검증 명령을 실행하여 정상 동작 여부를 확인합니다:
  ```bash
  npm run check:fast
  ```
- 만약 베이스라인이 깨져 있다면, 리팩토링을 즉각 중단하고 원인 버그를 먼저 사용자에게 보고하거나 해결합니다.

### Step 2. 리팩토링 수준 진단 및 코드 스멜 식별 (Diagnostic & Smell Catalog)
대상 코드를 분석하고 문제 유형을 정확한 학술적 용어로 명명합니다:

- **Macro Level (구조적 문제):**
  - *Junk Drawer:* `utils/`, `common/`, `helpers/`에 성격이 다른 함수들이 무분별하게 혼재됨.
  - *Thin Routes 위반:* Next.js `app/` 라우팅 트리 내부에 대규모 클라이언트 뷰/비즈니스 컴포넌트가 직접 구현됨.
  - *Misplaced Component:* 도메인에 맞지 않는 폴더에 컴포넌트가 방치됨 (예: 홈 화면 카드가 `cards/`에 위치).
  - *Barrels Anti-pattern:* 모든 서브폴더마다 `index.ts`를 두고 순환 참조를 유발함.
- **Micro Level (코드 레벨 문제):**
  - *Bloaters:* 10줄을 초과하는 복잡한 함수(Long Method), 5개 이상의 인자를 받는 매개변수 목록(Long Parameter List), 신(God) 클래스/컴포넌트.
  - *Dispensables:* 사용되지 않는 데드 코드(Dead Code), 무의미한 임시 변수, 코드 기능을 설명하려는 주석.
  - *Change Preventers:* 하나의 변경이 여러 파일로 번지는 산탄총 수술(Shotgun Surgery), 단일 클래스가 여러 이유로 변경되는 분산 변경(Divergent Change).
  - *Conditional Complexity:* 깊게 중첩된 `if/else` 및 거대한 `switch` 문.
  - *Primitive Obsession:* 도메인 개념을 순수 문자열이나 숫자로만 다루는 행위.

### Step 3. 매핑 테이블 및 불변식(Invariants) 수립
본격적인 수정 전, 변경 계획을 명확히 문서화합니다:
- **구조 이동 시:** `Old Path` ➡️ `New Path` 및 영향받는 import 참조 목록을 매핑 테이블로 작성.
- **코드 수정 시:** 대상 함수/심볼, 적용할 리팩토링 패턴(Extract Method, Guard Clauses 등), 반드시 유지되어야 할 불변식(Invariants)과 엣지 케이스 동작을 명시.

### Step 4. 단일 책임 단위의 점진적 실행 (Staged Execution)
- 한 번에 모든 것을 바꾸는 빅뱅(Big-Bang) 방식을 전면 금지합니다.
- 논리적으로 독립된 단위로 스테이지(Stage)를 나누어 진행합니다:
  - **Stage N:** 파일 이동 (`git mv`) ➡️ import 경로 조정 ➡️ `npm run check:fast` ➡️ Git Commit.
  - **Stage N+1:** 함수 추출 및 조건문 단순화 ➡️ `npm run check:fast` ➡️ Git Commit.
- 각 단계가 끝날 때마다 빌드와 테스트가 100% Green이어야 합니다.

### Step 5. 사후 전수 증명 및 롤백 가드 (Verification Proof)
- 변경이 완료되면 전체 통합 파이프라인을 실행합니다:
  ```bash
  npm run check
  ```
- **롤백 가드 (Rollback on Red):**
  - 만약 테스트나 빌드가 실패하면, 깨진 상태를 앞으로 땜질(Patch Forward)하지 말고 해당 스테이지의 변경사항을 즉시 롤백(`git restore` / `git checkout`)하여 안전한 이전 상태로 복구한 뒤 다시 접근합니다.

### Step 6. 문서 및 단일 진실 공급원(SSoT) 동기화
- 리팩토링으로 인해 파일 경로, 아키텍처 구조, 공개 인터페이스가 변경된 경우 다음 문서들을 즉시 동기화합니다:
  - `.agents/rules/project-context.md` (디렉토리 구조 및 원칙)
  - `doc/architecture.md` (아키텍처 설계 문서)
  - `README.md` (필요 시 기술 스택 및 설명)

---

## 4. Few-Shot 모범 사례 (Reference Examples)

### Case 1. 중첩된 조건문 단순화 (Replace Nested Conditional with Guard Clauses)
```typescript
// ❌ BAD: 깊게 중첩된 복잡한 조건문 (인지 부하 높음)
function getDeckBadge(deck: Deck | null, isExam: boolean) {
  if (deck) {
    if (isExam) {
      if (deck.cards.length > 0) {
        return "exam-ready"
      } else {
        return "empty"
      }
    } else {
      return "practice"
    }
  } else {
    return "not-found"
  }
}

// ✅ GOOD: 보호 구문(Guard Clauses)으로 조기 반환 및 평탄화
function getDeckBadge(deck: Deck | null, isExam: boolean): DeckBadgeStatus {
  if (!deck) return "not-found"
  if (!isExam) return "practice"
  if (deck.cards.length === 0) return "empty"
  return "exam-ready"
}
```

### Case 2. 함수 추출 및 의도 드러내기 (Extract Function)
```typescript
// ❌ BAD: 주석으로 무엇을 하는지 설명하고 있는 긴 함수
function processDeckUpload(rawContent: string) {
  // 1. JSON 파싱 및 기본 검사
  const json = JSON.parse(rawContent)
  if (!json || typeof json !== "object") throw new Error("Invalid format")

  // 2. 카드 개수 및 필수 필드 검사
  if (!Array.isArray(json.cards) || json.cards.length === 0) {
    throw new Error("No cards found")
  }
  // ... 수십 줄의 처리 로직
}

// ✅ GOOD: 작고 명확한 책임을 가진 순수 함수들로 분해
function parseRawDeckJson(rawContent: string): unknown {
  const json = JSON.parse(rawContent)
  if (!json || typeof json !== "object") throw new Error("Invalid format")
  return json
}

function validateDeckCardCount(cards: unknown): asserts cards is unknown[] {
  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error("No cards found")
  }
}
```

---

## 5. 품질 자가 진단 체크리스트 (10/10 Scorecard)

작업 완료 전 다음 8대 진단 문항을 전수 통과해야 합니다:

- [ ] **1. Green Baseline:** 리팩토링 전후 모두 테스트와 빌드가 통과했는가?
- [ ] **2. Behavior Preservation:** 외부에서 관찰 가능한 동작이나 API 응답이 100% 동일하게 유지되었는가?
- [ ] **3. Named Smells:** 개선한 코드 스멜의 공식 명칭(Long Method, Shotgun Surgery 등)을 식별하고 적절한 패턴을 적용했는가?
- [ ] **4. Small Methods:** 추출된 함수/메서드가 단일 책임을 가지며 15줄 내외로 간결한가?
- [ ] **5. Flat Conditionals:** 중첩된 `if/else`가 제거되고 Guard Clause나 매핑 테이블로 평탄화되었는가?
- [ ] **6. History Preservation:** 파일 이동 시 `git mv`를 사용하여 커밋 히스토리가 보존되었는가?
- [ ] **7. Zero Hardcoded UI Text:** 컴포넌트 리팩토링 시 UI 텍스트 하드코딩이 발생하지 않고 `useT()`/`getT()`를 유지했는가?
- [ ] **8. SSoT Synced:** 프로젝트 규칙 파일(`project-context.md`, `architecture.md`)과 실제 코드가 일치하는가?
