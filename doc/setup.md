# Setup & Installation

이 문서는 `memorize_supporter` 프로젝트의 개발 환경 설정 및 설치 과정을 안내합니다.

## 1. 사전 요구 사항 (Prerequisites)
- **Node.js**: v20.x 이상 권장 (최신 LTS, Next.js 14/15 호환성 보장)
- **운영 체제**: Windows, macOS, Linux 무관 (SQLite 로컬 파일 DB 사용)
- 별도의 외부 데이터베이스 소프트웨어(MySQL, PostgreSQL 등)를 설치할 필요가 없습니다.

## 2. 설치 (Installation)
저장소를 클론한 후, 프로젝트 디렉토리로 이동하여 의존성 패키지를 설치합니다.

```bash
git clone <repository-url>
cd memorize_supporter
npm install
```

## 3. 환경 변수 (Environment Variables)
데이터베이스 파일의 경로가 정의된 환경 변수를 설정해야 합니다. 제공되는 예제 파일을 복사하여 사용하세요.

```bash
cp .env.example .env
```
*(Windows 환경의 경우 `copy .env.example .env`를 사용하거나 직접 복사하세요.)*

> **Note**: 기본적으로 로컬 SQLite(`file:./.data/memorize.sqlite`)가 설정되어 있습니다. 프로덕션 환경 등에서 PostgreSQL을 사용하려면 `.env` 파일의 `DATABASE_URL`을 수정하세요.

## 4. 데이터베이스 및 데이터 초기화 (DB Setup & ETL)
Prisma ORM을 사용하여 SQLite 데이터베이스를 생성하고, ETL 스크립트를 실행하여 `input/` 디렉토리의 데이터를 DB에 적재합니다.

```bash
# 데이터베이스 스키마 푸시 (최초 테이블 생성)
npx prisma db push

# 데이터 파싱 및 DB 적재 (Upsert 방식이므로 여러 번 실행해도 안전함)
npm run etl
```
> **참고**: 데이터베이스 파일은 프로젝트 루트의 `.data/memorize.sqlite` 위치에 생성되며, Git의 추적을 받지 않습니다.

## 5. Running Locally

Start the development server. The browser will automatically open `http://localhost:3000` once the server is ready.

설정이 완료되면 개발 서버를 실행합니다. 서버 구동이 완료되면 시스템 기본 브라우저가 자동으로 열리며 `http://localhost:3000` 페이지에 접속됩니다.

```bash
npm run dev
```

## 6. 문제 해결 (Troubleshooting)
데이터베이스 스키마를 직접 변경했거나 전체 학습 기록을 깔끔하게 초기화하고 싶은 경우 아래의 명령어를 사용하세요.

```bash
npx prisma db push --force-reset
npm run etl
```
