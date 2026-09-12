# Project Overview

This document provides a high-level overview of the `memorize_supporter` project, its key capabilities, and engineering operational workflows.

이 문서는 `memorize_supporter` 프로젝트의 개요, 핵심 기능 및 엔지니어링 운영 워크플로우에 대한 고수준 개요를 제공합니다.

## Core Capabilities

`memorize_supporter` is a universal cognitive learning web application designed to help users memorize knowledge efficiently using Active Recall and spaced repetition principles across flashcards, 4-choice practice quizzes, and vocabulary lists.

`memorize_supporter`는 플래시카드, 4지선다형 연습 퀴즈, 어휘 목록 등 다양한 형태의 지식을 능동적 회상(Active Recall)과 분산 반복 원리를 통해 효과적으로 암기할 수 있도록 지원하는 범용 인지 학습 웹 애플리케이션입니다.

- **Practice & Exam Modes**: Interactive card flips, exam scoring, and detailed review tracking.
  연습 및 시험 모드: 인터랙티브 카드 플립, 시험 점수 산출 및 문항별 오답 상세 기록.
- **Local-First Architecture**: Zero-server database operating 100% within browser IndexedDB with cross-tab sync and storage persistence protection.
  로컬 퍼스트 아키텍처: 브라우저 IndexedDB 내에서 100% 동작하며 다중 탭 동기화 및 영구 스토리지 보존을 지원하는 서버리스 아키텍처.
- **AI Data Preparation & Prompts**: Built-in prompt engineering templates and generators helping users convert raw study notes into structured deck JSON.
  AI 데이터 준비 및 프롬프트: 사용자의 원본 학습 노트를 구조화된 덱 JSON으로 변환할 수 있도록 지원하는 프롬프트 엔지니어링 템플릿과 생성기 내장.
- **Full Internationalization (i18n)**: 100% synchronized multilingual experience across Korean, English, and Japanese with zero-hardcoded UI strings.
  완전한 다국어 지원: 인라인 하드코딩 없는 엄격한 정책 하에 한국어, 영어, 일본어 3개 국어를 100% 동기화하여 지원.

## AI Engineering Workflows

The repository maintains Single Source of Truth (SSoT) guidelines under `.agents/` to coordinate AI-assisted development across frontend, backend, and prompt engineering domains.

본 저장소는 프론트엔드, 백엔드 및 프롬프트 엔지니어링 전반에 걸친 AI 페어 프로그래밍을 조율하기 위해 `.agents/` 디렉토리 아래에 단일 진실 공급원(SSoT) 가이드라인을 유지 관리합니다.

### Available Engineering Workflows

| Workflow | Activation | Primary Focus |
| :--- | :--- | :--- |
| Frontend Engineering | `/frontend` | UI/UX components, Tailwind CSS v4 canonical styling, accessibility, and zero-hardcoding i18n synchronization. |
| Backend Engineering | `/backend` | Next.js Server Actions, Route Handlers, Local-First storage pooling, and zero-trust validation. |
| Prompt Engineering | `/prompt` | Prompt architecture, Few-Shot demonstrations, CoT reasoning, structured JSON schema enforcement, and i18n template synchronization. |

엔지니어링 작업 영역별 주요 워크플로우 매트릭스:
- 프론트엔드 워크플로우 (`/frontend`): UI/UX 컴포넌트, Tailwind CSS v4 스타일링, 웹 접근성 감사 및 i18n 동기화.
- 백엔드 워크플로우 (`/backend`): Server Actions, Route Handlers, 로컬 스토리지 풀링 및 제로 트러스트 검증.
- 프롬프트 엔지니어링 워크플로우 (`/prompt`): 프롬프트 아키텍처, 퓨샷(Few-Shot) 시연, 단계적 추론(CoT), 구조화된 JSON 스키마 강제 및 다국어 템플릿 동기화.
