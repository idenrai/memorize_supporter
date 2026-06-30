# Memorize Supporter

암기를 돕는 애플리케이션입니다. 다양한 종류의 데이터를 (핀포인트 팁, 4지선다형, 영단어 등) 효과적으로 학습할 수 있도록 설계되었습니다. 인지 과학 기반의 UI/UX 디자인 원칙을 적용하여 학습 효율을 높입니다.

## 기능
- **단일화된 입력 포맷 (JSON)**: `input/` 디렉토리에 JSON 파일 및 템플릿을 사용하여 확장성 높은 덱 생성 지원
- **Active Recall**: 힌트나 질문을 먼저 제시하고 의도적인 액션으로 정답을 확인
- **간격 반복 (Spaced Repetition, SRS)**: 평가 결과(Hard/Easy)에 따라 복습 주기를 자동 계산하여 최적의 타이밍에 재학습 유도
- **최소화된 인지 부하**: 다크 모드 기반의 미니멀리즘 디자인과 방해 요소 제거 (Empty State 등 친절한 온보딩 UI 제공)
- **키보드 접근성**: 마우스 없이도 모든 학습 과정을 키보드 단축키로 제어 가능
- **PWA 및 모바일 최적화**: 브라우저에서 '홈 화면에 추가'를 통해 네이티브 앱처럼 설치 및 활용 가능
- **SEO 최적화**: OpenGraph 태그 지원을 통해 소셜 미디어 공유 시 유려한 썸네일과 설명 렌더링

## 기술 스택
- **프론트엔드**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **백엔드/데이터베이스**: SQLite, Prisma ORM
- **데이터 파이프라인**: TypeScript (`tsx`) 기반 자체 ETL 스크립트 (JSON 전용 파싱)

## 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
저장소를 클론한 직후, 데이터베이스 경로를 설정하기 위해 환경 변수 파일을 생성합니다.
```bash
cp .env.example .env
```
*(Windows 환경의 경우 `copy .env.example .env`를 사용하거나 직접 파일을 복사하세요.)*

### 3. 데이터베이스 초기화 및 ETL 실행
```bash
npx prisma db push
npm run etl
```
> **참고**: SQLite는 Prisma에 의해 자동으로 구성되므로 별도의 시스템 프로그램 설치가 필요하지 않습니다. DB 파일(`.data/memorize.sqlite`)은 버전 관리(Git)에서 제외됩니다. 
> `npm run etl`은 카드를 추가하거나 정답을 수정한 뒤 여러 번 재실행해도, 기존에 유저가 학습한 망각 곡선 복습 기록(Learning Progress)을 안전하게 보존합니다.

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.

### 5. 데이터베이스 완전 초기화 (개발용)
Prisma 스키마를 수정하거나 모든 학습 데이터를 깔끔하게 날리고 처음부터 다시 시작하고 싶을 경우, 아래 명령어를 통해 데이터베이스를 리셋할 수 있습니다.
```bash
npx prisma db push --force-reset
npm run etl
```
