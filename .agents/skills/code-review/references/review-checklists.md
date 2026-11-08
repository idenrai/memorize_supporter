# Code Review Checklists for Memorize Supporter

Memorize Supporter 프로젝트의 코드 리뷰 시 검토하는 상세 항목 기준서입니다.

---

## 1. Zero Hardcoded UI Text Policy (최우선 필수 감사)
- [ ] **No Inline Strings**: 컴포넌트 렌더링 영역(JSX/TSX)에 한국어/영어/일본어 문자열이 하드코딩되지 않았는가?
- [ ] **i18n Parity**: 새로운 텍스트가 `src/i18n/types.ts`와 `ko.ts`, `en.ts`, `ja.ts`에 모두 등록되었는가?
- [ ] **Dynamic Parameters**: 동적 텍스트는 인라인 조합(`+`) 대신 파라미터화된 번역 함수(`t.some_key(val)`)를 사용하는가?

---

## 2. Next.js App Router & React 19 체크리스트
- [ ] **Client Boundaries**: `'use client'` 지시어가 필요한 인터랙티브 컴포넌트에만 선언되어 있는가? (과도한 클라이언트 번들 방지)
- [ ] **Data Fetching & Cache**: 서버 컴포넌트와 클라이언트 훅의 데이터 흐름이 명확히 분리되었는가?

---

## 3. Local-First & Storage 체크리스트
- [ ] **Offline Persistence**: 사용자의 암기 진행 상황, 오답 노트가 브라우저 저장소(IndexedDB/localStorage)에 안전하게 저장되는가?
- [ ] **Quota & Exceptions**: 스토리지 용량 초과나 접근 제한 상황에 대한 에러 처리가 구비되었는가?

---

## 4. Accessibility & Keyboard Control 체크리스트
- [ ] **Keyboard Shortcuts**: 플래시카드 뒤집기(`Space`), 암기 완료(`Enter`), 다음 카드(`ArrowRight`) 등 키보드 탐색이 원활한가?
- [ ] **Screen Reader**: 버튼 및 아이콘에 `aria-label`이 누락 없이 번역 키로 바인딩되었는가?

