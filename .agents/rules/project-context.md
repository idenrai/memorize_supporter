# Instructions for Memorize Supporter

## Project Overview

`memorize_supporter`는 사용자가 단편적인 팁, 4지선다형 문제, 영단어 등 다양한 형태의 지식을 효과적으로 암기할 수 있도록 돕는 범용 암기 지원 웹 애플리케이션입니다. 로컬 SQLite 데이터베이스를 통해 관리되며, 인지 과학에 기반한 Active Recall과 미니멀리즘 디자인 원칙을 적용합니다.

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Next.js (App Router) / React 19 |
| Styling | Tailwind CSS |
| State | React Server Components / React Hooks |
| Backend | Next.js API Routes / Server Actions |
| Validation | Zod (Schema Validation) |
| Database | SQLite (via Prisma ORM) |
| Deployment | Local / Vercel (Optional) |

---

## Command Reference

- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Linting:** `npm run lint`
- **Database Push:** `npx prisma db push`
- **ETL Data Parsing:** `npm run etl` (input 폴더의 내용을 DB로 이관)

---

## Project Structure

```
memorize_supporter/
├── input/                      # JSON 기반 덱 데이터 및 템플릿 (templates/, README.md 지원)
├── prisma/
│   └── schema.prisma           # Prisma 스키마 (SQLite)
├── src/
│   ├── app/                    # Next.js App Router (페이지 라우트)
│   ├── components/             # React UI 컴포넌트 (카드 플립 애니메이션 등)
│   ├── lib/                    # 유틸리티 및 전역 인스턴스 (Prisma Client)
│   └── scripts/                # ETL 등 백그라운드 스크립트 (etl.ts)
├── .data/                      # 로컬 SQLite DB 폴더 (Git Ignore)
└── README.md
```

---

## Coding Conventions

### Language and Types
- 모든 소스 파일은 TypeScript를 사용합니다.
- `any` 타입의 사용을 지양하고 엄격한 인터페이스 및 타입 정의를 권장합니다.

### Naming Conventions
- React 컴포넌트: `PascalCase` (예: `TipCard.tsx`)
- 파일, 유틸리티, 스크립트: `camelCase` 또는 `kebab-case`
- 상수 및 환경 변수: `UPPER_SNAKE_CASE`

### General Guidelines
- **UI/UX 원칙:** `ui-ux-pro-max` 스킬을 준수합니다. 포커스 모드, 높은 가독성(산세리프), 짧고 부드러운 상태 변화 피드백(마이크로 애니메이션)을 최우선으로 설계합니다.
- **아키텍처:** 서버 컴포넌트와 클라이언트 컴포넌트를 명확히 분리합니다. 데이터 패칭은 가급적 서버(Prisma 직접 호출)에서 처리하고, 상태 관리와 애니메이션이 필요한 부분만 클라이언트로 내립니다 (`"use client"`).