# HackMate

A full-stack hackathon management platform with a microservices backend and a role-based React frontend.

> GitHub: [https://github.com/improperboy/Hackmate_Devops](https://github.com/improperboy/Hackmate_Devops)

---

## Repositories

| Folder | Description |
|---|---|
| [`hackmate-backend/`](./hackmate-backend) | FastAPI microservices, PostgreSQL, Redis, Docker |
| [`hackmate-frontend/`](./hackmate-frontend) | React + TypeScript + Vite SPA |

---

## Architecture Overview

```
Browser
  └── React SPA (Vite, :5173)
        └── API Gateway (:8000)
              ├── Auth Service        (:8001)
              ├── User Service        (:8002)
              ├── Team Service        (:8003)
              ├── Scoring Service     (:8004)
              ├── Submission Service  (:8005)
              ├── Notification Service(:8006)
              ├── Chatbot Service     (:8007)
              └── Admin Service       (:8008)
```

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+
- A PostgreSQL database (local via Docker or hosted e.g. Supabase)
- An [Upstash Redis](https://console.upstash.com) instance

### 1. Clone the repo

```bash
git clone https://github.com/improperboy/Hackmate_Devops.git
cd Hackmate_Devops
```

### 2. Configure the backend

```bash
cd hackmate-backend
cp .env.example .env
# Fill in your credentials in .env
```

### 3. Start the backend

```bash
docker compose up --build
```

DB migrations run automatically. API Gateway is available at http://localhost:8000.

### 4. Start the frontend

```bash
cd ../hackmate-frontend
cp .env.example .env
npm install
npm run dev
```

App runs at http://localhost:5173.

---

## Tech Stack

**Backend**
- Python, FastAPI, SQLAlchemy, Alembic
- PostgreSQL, Upstash Redis
- Docker, Docker Compose

**Frontend**
- React 18, TypeScript, Vite
- TanStack Query, Zustand, React Router v6
- Tailwind CSS, Radix UI, Recharts

---

## Roles

| Role | Access |
|---|---|
| Participant | Dashboard, teams, submissions, rankings, announcements |
| Mentor | Assigned teams, scoring, schedule, rankings |
| Volunteer | View teams, mentors, support requests |
| Admin | Full platform control — users, analytics, settings, content |

---

## Docs

- [Backend README](./hackmate-backend/README.md)
- [Frontend README](./hackmate-frontend/README.md)
