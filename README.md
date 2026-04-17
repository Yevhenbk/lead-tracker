# Lead Tracker

A mini CRM application for managing sales leads and comments. Built with NestJS, Next.js 15, Prisma, and PostgreSQL.

## Tech Stack

- **Backend**: NestJS + TypeScript + Prisma ORM
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Database**: PostgreSQL 16
- **Containerization**: Docker + Docker Compose

## Features

- List, create, update, and delete leads
- Filter leads by status and search by name, email, or company
- Paginated lead listing
- Per-lead comment threads
- Swagger API documentation

---

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 16 running locally (or use Docker for the DB only)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env to point DATABASE_URL at your local Postgres instance
npm install
npx prisma migrate dev --name init
npm run start:dev
```

The API will be available at `http://localhost:3001/api`.  
Swagger docs: `http://localhost:3001/api/docs`

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if your backend runs on a different URL
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Running with Docker

Build and start all services (Postgres, backend, frontend) with a single command:

```bash
docker compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:3001/api        |
| Swagger  | http://localhost:3001/api/docs   |

To stop and remove containers:

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

---

## Environment Variables

### `backend/.env.example`

| Variable       | Default                                                        | Description                  |
|----------------|----------------------------------------------------------------|------------------------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/lead_tracker`  | Prisma database connection   |
| `PORT`         | `3001`                                                         | Port the API listens on      |

### `frontend/.env.example`

| Variable               | Default                        | Description                        |
|------------------------|--------------------------------|------------------------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:3001/api`    | Base URL for backend API calls     |

---

## API Examples

### List leads (with optional filters)

```
GET /api/leads?page=1&limit=10&status=NEW&q=acme&sort=createdAt&order=desc
```

### Create a lead

```
POST /api/leads
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "company": "Acme Corp",
  "status": "NEW",
  "value": 12000,
  "notes": "Met at trade show"
}
```

### Update a lead

```
PATCH /api/leads/:id
Content-Type: application/json

{
  "status": "CONTACTED",
  "notes": "Called on Monday, very interested"
}
```

### Delete a lead

```
DELETE /api/leads/:id
```

### List comments for a lead

```
GET /api/leads/:id/comments
```

### Add a comment to a lead

```
POST /api/leads/:id/comments
Content-Type: application/json

{
  "text": "Followed up via email. Awaiting response."
}
```

---

## Lead Statuses

| Value         | Description                  |
|---------------|------------------------------|
| `NEW`         | Freshly added lead           |
| `CONTACTED`   | Initial contact made         |
| `IN_PROGRESS` | Active negotiation           |
| `WON`         | Deal closed successfully     |
| `LOST`        | Deal did not close           |

---

## Production Build

### Backend

```bash
cd backend
npm run build
node dist/main
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

The frontend is configured with `output: "standalone"` in `next.config.ts`, making it suitable for minimal Docker deployments.

---

## Database Migrations

Run pending migrations in production:

```bash
cd backend
npx prisma migrate deploy
```

Explore the database with Prisma Studio:

```bash
cd backend
npx prisma studio
```
