# HackMate Frontend

React + TypeScript frontend for HackMate — a hackathon management platform. Built with Vite, Tailwind CSS, and TanStack Query.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server & bundler
- **React Router v6** — client-side routing
- **TanStack Query** — server state management
- **Zustand** — client state management
- **Axios** — HTTP client
- **React Hook Form** + **Zod** — forms & validation
- **Tailwind CSS** + **Radix UI** — styling & accessible components
- **Recharts** — charts & analytics
- **Motion** — animations
- **Vitest** + **Testing Library** — unit tests

## Getting Started

**1. Install dependencies**

```bash
cd hackmate-frontend
npm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API Gateway URL | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:8000` |

**3. Start the dev server**

```bash
npm run dev
```

App runs at http://localhost:5173. API requests are proxied to the backend at `http://localhost:8000` — make sure the backend is running.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint TypeScript/TSX files |
| `npm run test` | Run tests once |

## Roles & Pages

The app has four role-based layouts, each with its own protected route tree:

**Participant** (`/participant`)
- Dashboard, team create/join/manage, join requests, invitations, user search, project submission, mentoring rounds, rankings, announcements, support

**Mentor** (`/mentor`)
- Dashboard, assigned teams, score teams, scoring history, team progress, schedule, rankings, announcements, support

**Volunteer** (`/volunteer`)
- Dashboard, view teams, mentors, support requests, rankings, announcements

**Admin** (`/admin`)
- Dashboard, analytics, export, activity logs, user management, teams, venue (floors/rooms), submissions, mentor/volunteer assignments, AI mentor recommendations, rankings, submission settings, mentoring rounds, announcements, themes, support messages, system settings

## Project Structure

```
src/
├── api/          # Axios instances and API call functions
├── components/   # Shared UI components and layout (AppShell)
├── config/       # App-wide config constants
├── features/     # Feature modules grouped by role
│   ├── auth/
│   ├── participant/
│   ├── mentor/
│   ├── volunteer/
│   └── admin/
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── router/       # React Router config and ProtectedRoute
├── store/        # Zustand stores
├── types/        # TypeScript type definitions
├── validators/   # Zod schemas
└── widgets/      # Reusable widget components
```

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. The build splits vendor chunks (React, TanStack Query, Recharts) for optimal caching.

To preview the build locally:

```bash
npm run preview
```
