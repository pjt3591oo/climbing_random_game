# 🧗 Climbing Random

클라이밍 모임에서 오늘 갈 장소를 미니게임으로 재미있게 결정하는 웹 앱

**🔗 [https://randomgame-mocha.vercel.app/](https://randomgame-mocha.vercel.app/)**

## 사용 방법

### 방장 (Host)
1. 클라이밍장 후보 장소 입력 (최소 2개)
2. 게임 유형 선택
3. 방 생성 후 링크를 멤버들에게 공유

### 참가자 (Player)
1. 공유받은 링크로 접속
2. 닉네임 입력
3. 게임 플레이 → 장소 선택됨
4. 결과 화면에서 전체 참가자 현황 확인

## 게임 유형

| 게임 | 설명 |
|------|------|
| 🎡 룰렛 | 원형 룰렛을 돌려서 장소 선택 |
| 🪜 사다리 타기 | 사다리를 타고 장소 선택 |
| 🃏 카드 뒤집기 | 뒤집어진 카드 중 하나를 선택 |
| 🎋 제비뽑기 | 제비통에서 제비를 뽑아 장소 선택 |

## 기술 스택

- **Frontend / Backend** – Next.js 16 (App Router)
- **DB** – PostgreSQL (Supabase)
- **ORM** – Prisma 7
- **UI** – Tailwind CSS, Framer Motion
- **배포** – Vercel

## 로컬 실행

### 사전 준비
- Node.js 20+
- Docker (로컬 DB용)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 PostgreSQL 실행
docker compose up -d

# .env 설정
cp .env.example .env
# DATABASE_URL 수정

# DB 마이그레이션
npm run db:migrate

# 개발 서버 실행
npm run dev
```

`http://localhost:3000` 접속

## 환경 변수

```env
# 로컬
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/climbing_game"

# Supabase (프로덕션)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

## DB 스크립트

```bash
npm run db:generate      # Prisma 클라이언트 재생성
npm run db:migrate       # 마이그레이션 생성 및 적용 (개발)
npm run db:migrate:prod  # 마이그레이션 적용 (프로덕션)
npm run db:push          # 스키마 직접 반영 (마이그레이션 없이)
npm run db:studio        # Prisma Studio (DB GUI)
npm run db:reset         # DB 초기화
```

## 배포

GitHub push 시 Vercel이 자동으로 재배포합니다.

빌드 시 아래 순서로 실행됩니다:
1. `prisma generate` – Prisma 클라이언트 생성
2. `prisma migrate deploy` – 마이그레이션 적용
3. `next build` – Next.js 빌드
