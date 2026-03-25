# 🌱 The Garden

A peaceful, meditative garden simulator where you grow plants, tend your garden, and reflect on life's daily rhythms. Every plant carries a hidden message that is only revealed when it blooms — a reward for patient, consistent care.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) with Compose plugin (`docker compose`)
- Copy the environment file and adjust values if needed:

```bash
cp .env.example .env
```

### Start the application

```bash
docker compose up --build
```

To run in the background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

---

## Service URLs

| Service        | URL                          | Description                      |
|----------------|------------------------------|----------------------------------|
| Frontend       | http://localhost:5173        | React garden app                 |
| Backend API    | http://localhost:3000        | Express REST API                 |
| pgAdmin        | http://localhost:5050        | PostgreSQL database UI           |
| MailHog        | http://localhost:8025        | Email testing UI                 |
| MinIO Console  | http://localhost:9001        | Object storage UI                |
| MinIO API      | http://localhost:9000        | Object storage API               |

---

## Project Structure

```
the-garden/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── src/
│       ├── index.ts
│       ├── db/
│       │   ├── index.ts
│       │   └── schema.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── garden.ts
│       │   └── journal.ts
│       └── middleware/
│           └── auth.ts
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        │   ├── Garden/
        │   ├── Journal/
        │   └── Layout/
        ├── pages/
        ├── hooks/
        └── types/
```

---

## Available npm Scripts

### Backend (`cd backend`)

| Script              | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Start development server with watch  |
| `npm run build`     | Compile TypeScript to `dist/`        |
| `npm start`         | Run compiled production server       |
| `npm run db:push`   | Push Drizzle schema to database      |
| `npm run db:seed`   | Seed the database with sample plants |
| `npm run db:studio` | Open Drizzle Studio                  |

### Frontend (`cd frontend`)

| Script              | Description                         |
|---------------------|-------------------------------------|
| `npm run dev`       | Start Vite development server       |
| `npm run build`     | Build for production                |
| `npm run preview`   | Preview production build            |

---

## Environment Variables

See `.env.example` for all available configuration options. Copy it to `.env` before starting.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + React Router
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Object Storage:** MinIO
- **Email Testing:** MailHog
- **Database UI:** pgAdmin 4
- **Containerization:** Docker + Docker Compose
