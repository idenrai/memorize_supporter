---
name: pr
description: Automates pull request creation with doc synchronization (.github/doc-map.yml), staged logical commits, and GitHub MCP server integration (create_pull_request, issue closing).
---

# Pull Request Automation (PR 자동화 및 이슈 연동)

**트리거:** `/pr` (사용자가 명시적으로 PR 생성을 지시했을 때만 실행)

> [!CAUTION]
> **원격 푸시 제한 규약 준수**: 에이전트는 임의로 `git push`를 실행하거나 PR을 생성하지 않으며, 오직 사용자가 `/pr`을 실행했거나 명시적으로 원격 푸시를 지시했을 때만 진행합니다.

---

## 1. 사전 검증 및 동기화
1. **설계 문서 동기화 (`.github/doc-map.yml`)**:
   - 변경된 파일에 매핑된 `doc/` 문서를 확인하고 명세를 동기화합니다.
2. **품질 게이트 검증**:
   - `./.agents/skills/quality-gate/scripts/verify-all.sh` 100% 통과 확인.
3. **논리적 커밋 분할**:
   - Conventional Commits 형식으로 단계를 나누어 커밋합니다.

---

## 2. GitHub MCP 도구 기반 PR 생성
1. **관련 이슈 조회**:
   - `call_mcp_tool(ServerName: "github-mcp-server", ToolName: "get_issue", Arguments: { owner, repo, issue_number })`
2. **원격 푸시**:
   - 작업 브랜치를 푸시합니다 (`git push -u origin <branch-name>`).
3. **Pull Request 생성**:
   - `create_pull_request` MCP 도구를 호출하거나 `gh pr create`를 실행합니다:
     - **제목**: `type(scope): 한국어 설명`
     - **본문**: 100% 한국어로 개요, 세부 변경사항, 검증 결과를 테이블과 체크리스트로 상세 작성.
     - **이슈 종결**: 본문 하단에 `Closes #<이슈번호>` 명시.

