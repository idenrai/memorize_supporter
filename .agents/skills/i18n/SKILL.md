---
name: i18n
description: 한국어(ko), 영어(en), 일본어(ja) 3개 국어 번역 키 동기화, 감사(Audit), 및 Zero Hardcoded UI Text Policy 준수를 관리하는 다국어 스킬
---

# i18n Management (다국어 관리 및 Zero Hardcoded UI Text 정책)

**트리거:** `/i18n` (신규 번역 키 추가, 언어 간 동기화, UI 텍스트 하드코딩 감사 시)

이 스킬은 Memorize Supporter의 **UI 텍스트 하드코딩 절대 금지(Zero Hardcoded UI Text Policy)**를 지원하기 위한 런북입니다.

---

## 1. 번역 키 추가 절차
1. `src/i18n/types.ts`의 `Translations` 인터페이스에 신규 키 및 타입 정의.
2. `src/i18n/ko.ts`, `src/i18n/en.ts`, `src/i18n/ja.ts` 3개 파일에 모두 동일한 키 추가.
3. 컴포넌트에서 `useT()` 또는 유틸에서 `getT()`로 호출하여 렌더링.

---

## 2. 3개 국어 Parity 감사 실행
```bash
./.agents/skills/i18n/scripts/audit-i18n.sh
```
누락된 키나 언어 간 불일치가 감지되면 즉시 리포트합니다.

