# HackMate Backend

A microservices-based backend for HackMate — a hackathon management platform. Built with FastAPI, PostgreSQL, Redis, and Docker.

## Architecture

All traffic flows through a single API Gateway which handles authentication, rate limiting, and maintenance mode before proxying requests to the appropriate service.

```
Client → API Gateway (:8000)
              ├── Auth Service        (:8001)
              ├── User Service        (:8002)
              ├── Team Service        (:8003)
              ├── Scoring Service     (:8004)
              ├── Submission Service  (:8005)
              ├── Notification Service(:8006)
              ├── Chatbot Service     (:8007)
              └── Admin Service       (:8008)
```

## Services

| Service | Port | Responsibility |
|---|---|---|
| api-gateway | 8000 | Auth middleware, rate limiting, request proxying |
| auth-service | 8001 | Registration, login, JWT issue & refresh |
| user-service | 8002 | User profiles and management |
| team-service | 8003 | Teams, join requests, invitations |
| scoring-service | 8004 | Rounds, scores, leaderboard/rankings |
| submission-service | 8005 | Project submissions |
| notification-service | 8006 | Push notifications, announcements (Redis-backed) |
| chatbot-service | 8007 | AI chatbot (intent matching / OpenAI) |
| admin-service | 8008 | Analytics, settings, venue, export, support, themes |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- A PostgreSQL database (local via Docker or hosted e.g. Supabase)
- An [Upstash Redis](https://console.upstash.com) instance (for notifications & rate limiting)

## Getting Started

**1. Clone and configure environment**

```bash
git clone https://github.com/improperboy/hackmate_Devops.git
cd hackmate-backend
cp .env.example .env
```

Edit `.env` and fill in your credentials (see [Environment Variables](#environment-variables)).

**2. Start all services**

```bash
docker compose up --build
```

DB migrations run automatically before any service starts. Once up:

- API Gateway: http://localhost:8000
- pgAdmin: http://localhost:8080 (admin@hackmate.com / admin)

**3. Explore the API**

Each service exposes Swagger docs at `/docs`:

```
http://localhost:8000/docs   ← recommended (gateway)
http://localhost:8001/docs   ← auth service
...
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `POSTGRES_DB/USER/PASSWORD` | Used by the local Docker DB container |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_ALGORITHM` | Algorithm for JWTs (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL |
| `*_SERVICE_URL` | Internal URLs for each service (used by gateway) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `REDIS_URL` | Redis connection URL (used by notification service) |
| `VAPID_PRIVATE_KEY` | VAPID private key for web push |
| `VAPID_PUBLIC_KEY` | VAPID public key for web push |
| `VAPID_CLAIMS_EMAIL` | Email for VAPID claims |
| `OPENAI_API_KEY` | *(Optional)* OpenAI key for chatbot |
| `GITHUB_API_TOKEN` | *(Optional)* GitHub PAT for higher API rate limits |

**Generate a JWT secret:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Generate VAPID keys:**
```bash
python -c "from py_vapid import Vapid; v=Vapid(); v.generate_keys(); print(v.private_key, v.public_key)"
```

## Database Migrations

Migrations are managed with Alembic and run automatically on `docker compose up`. To run manually:

```bash
docker compose run --rm db-migrations
```

Migration files are in `db-migrations/versions/`.

## Running Tests

Each service has its own test suite under `<service>/tests/`.

```bash
# Example: run auth service tests
cd auth-service
pip install -r requirements.txt
pytest tests/
```

## Project Structure

```
hackmate-backend/
├── api-gateway/
├── auth-service/
├── user-service/
├── team-service/
├── scoring-service/
├── submission-service/
├── notification-service/
├── chatbot-service/
├── admin-service/
├── db-migrations/
├── docker-compose.yml
├── .env.example
└── .env              ← not committed
```
