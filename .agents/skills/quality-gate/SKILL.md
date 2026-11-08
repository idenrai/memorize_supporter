---
name: quality-gate
description: TypeScript 타입 검사, ESLint 린트, i18n 3개 국어 동기화 감사, 단위 테스트 및 Next.js 프로덕션 빌드를 일괄 검증하는 품질 게이트 스킬
---

# Quality Gate (Next.js 통합 품질 게이트)

**트리거:** `/quality-gate` (커밋 전 전체 빌드 검증, 테스트 스위트 확인, CI 실패 디버깅 시)

이 스킬은 Memorize Supporter의 타입, 린트, 다국어 정합성, 단위 테스트, Next.js 번들 빌드를 일괄 검증하는 런북입니다.

---

## 1. 품질 검증 파이프라인 실행
```bash
./.agents/skills/quality-gate/scripts/verify-all.sh
```

- **1단계**: Node.js 런타임 버전 검증
- **2단계**: TypeScript 정적 타입 검사 (`npm run type-check`)
- **3단계**: ESLint 정적 분석 (`npm run lint`)
- **4단계**: ko, en, ja 3개 국어 키 동기화 감사 (`audit-i18n.sh`)
- **5단계**: 네이티브 노드 단위 테스트 (`npm run test`)
- **6단계**: Next.js 프로덕션 번들 빌드 (`npm run build`)

---

## 2. 서브에이전트 위임 (옵션)
`invoke_subagent(TypeName: "quality-guard", Role: "Quality Guard", Prompt: "Run verify-all.sh and analyze failures")`

