---
name: code-review
description: Audits recent git changes for Next.js App Router, Zero Hardcoded UI Text Policy, Local-First integrity, and accessibility using the code-reviewer subagent or checklists.
---

# Code Review (전문 코드 리뷰)

**트리거:** `/review` 또는 `/code-review` (코드 변경사항에 대한 다각도 전문 피드백이 필요할 때)

이 스킬은 Memorize Supporter의 변경된 코드베이스를 독립된 시각에서 객관적으로 감사(Audit)하기 위한 런북입니다.

---

## 1. 대상 자동 식별 (Target Identification)
1. `git status` 및 `git diff --name-only` (또는 `git diff --cached --name-only`)를 확인하여 검토 대상 파일 목록을 확정합니다.
2. 검토 대상 파일이 없는 경우 변경사항을 안내하고 종료합니다.

---

## 2. 서브에이전트 위임 또는 직접 리뷰 실행
- **서브에이전트 위임 (권장)**:
  - `code-reviewer` 서브에이전트를 호출합니다:
    `invoke_subagent(TypeName: "code-reviewer", Role: "Code Reviewer", Prompt: "Review the recent git diff against Zero Hardcoded UI Text Policy and Next.js standards...")`
- **직접 리뷰 수행 시**:
  - [상세 체크리스트](./references/review-checklists.md)를 기준으로 Zero Hardcoded UI Text, Next.js App Router, 로컬 퍼스트, 접근성을 점검합니다.

---

## 3. 출력 형식 (Review Report)
1. **Executive Summary**: 변경 범위 요약 및 전반적 코드 품질 등급 (A/B/C/F)
2. 🔴 **Critical Blockers**: 하드코딩된 UI 문자열 발견, 빌드/타입 결함, 보안 취약점
3. 🟡 **Suggestions**: i18n 구조 개선, 성능 최적화, 리팩토링 제안
4. 🟢 **Good Patterns**: 프로젝트 표준을 훌륭히 준수한 모범 사례

