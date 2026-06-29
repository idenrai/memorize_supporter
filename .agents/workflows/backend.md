---
description: 백엔드 아키텍처 설계, API 개발 및 리팩토링
---

# Backend Engineering Workflow

**Activation:** `/backend` (또는 백엔드 서버, REST API, Serverless Function 등 백엔드 영역의 생성, 수정, 아키텍처 결정을 진행할 때)

이 워크플로우는 백엔드와 관련된 아키텍처 설계, API 개발, 리팩토링 및 성능 최적화의 모든 라이프사이클에 적용되는 마스터 가이드라인입니다. 단순한 코딩을 넘어 **의사결정(Decision-making)과 보안 검증(Security Validation)**에 초점을 맞춥니다.

## 1. 기술 스택 및 아키텍처 확인 (필수)
- 작업 시작 전 반드시 `.agents/rules/project-context.md`를 읽고 현재 프로젝트에 설정된 **백엔드 언어, 프레임워크, 데이터베이스, 배포 환경**을 확인합니다.
- 특정 언어나 프레임워크(예: Node.js, Express)를 암묵적으로 가정하지 않으며, 지정된 스택에 최적화된 아키텍처 패턴을 따릅니다.

## 2. Architecture & Design
- 복잡해지는 비즈니스 로직은 단일 책임 원칙(SRP)에 따라 적절한 계층(예: Controller/Router, Service, Repository)으로 분리하여 관리합니다.
- 데이터베이스 설계 및 변경 시, 기존 스키마와의 호환성을 고려하고 필요 시 마이그레이션 스크립트를 작성합니다.

## 3. Security & Validation (Zero-Trust)
- **모든 경계에서 검증:** 클라이언트로부터 들어오는 입력(Query params, Body, Headers)을 절대 신뢰하지 않습니다.
- 선택된 백엔드 언어의 검증(Validation) 라이브러리를 활용하여 API 진입점에서 반드시 데이터 스키마 유효성 검사를 수행합니다.
- 비밀키, 데이터베이스 URL 등 민감한 정보는 절대 하드코딩하지 않으며 환경 변수(Environment Variables)를 통해서만 접근합니다.

## 4. Error Handling
- **중앙화된 에러 처리:** 모든 계층에서 발생한 에러는 상위 미들웨어나 핸들러에서 일괄적으로 잡을 수 있도록 구성합니다.
- 클라이언트에게는 상황에 맞는 명확한 HTTP Status Code와 안전한 메시지를 반환합니다.
- 서버의 내부 정보(Stack Trace 등)는 오직 서버 로그에만 남기며 절대 클라이언트에게 노출해서는 안 됩니다.
