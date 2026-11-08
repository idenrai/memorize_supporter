---
name: refactor
description: Applies Martin Fowler refactoring patterns from folder structure down to micro-functions, maintaining behavior preservation and green test baselines.
---

# Refactoring & Code Quality (안전한 무중단 점진적 리팩토링)

**트리거:** `/refactor` (코드 스멜 제거, 함수 분리, 중복 제거, 구조 개선 요청 시)

이 스킬은 기존 동작을 100% 보존하면서 코드베이스의 구조와 가독성을 개선하는 런북입니다.

---

## 1. 4대 철칙 (Negative Constraints)
1. **기능 보존 (Behavior Preservation)**: "코드가 무엇을 하는가"는 완전히 유지하고 "어떻게 조직되는가"만 개선합니다.
2. **그린 베이스라인 (No Refactor on Red)**: 착수 전 `verify-all.sh` 통과 상태를 먼저 확인합니다.
3. **이동/수정 커밋 분리**: 파일 이동 시 `git mv`를 사용하여 커밋 히스토리를 보존합니다.
4. **점진적 실행**: 큰 변경을 한 번에 적용하지 않고 원자적 단위로 단계별 검증 및 커밋을 진행합니다.

---

## 2. 6단계 리팩토링 파이프라인
1. **Baseline Check**: 타입 체크, 린트, 테스트 검증 통과 확인.
2. **Smell Diagnostic**: [리팩토링 카탈로그](./references/refactoring-catalog.md)를 참조하여 코드 스멜 진단.
3. **Plan & Mapping**: 변경할 심볼의 역방향/정방향 의존성 파악.
4. **Staged Execution**: 가드 절 도입, 함수 추출, 인터페이스 단순화 적용.
5. **Verification Proof**: 단위 테스트 실행으로 회귀 버그 발생 여부 검증.
6. **SSoT Sync**: 배럴 내보내기(`index.ts`) 및 설계 문서 동기화.

