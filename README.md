# GAMEZ Backlog Launcher

GAMEZ is a premium retro-hardware styled game backlog coordinator built for desktop browsers. It allows users to scrape game metadata from RAWG nodes, catalog cartridges into their personalized "Armory", track playtime stats, and configure layout modes.

The platform is designed with a **Dark Gothic Neo-Brutalist + Industrial Hardware** design theme (CRT overlays, warning stripes, LCD progress segments).

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS v4, Zustand 5, Vite, React Router 7.
- **Backend**: Node.js, Express, Prisma (PostgreSQL adapter), Pino logger, Helmet security, Express Rate Limit.
- **Database**: PostgreSQL (Prisma ORM).

---

## 🔑 Environment Configuration

Create a `.env` file in the `backend/` folder based on `.env.example`:

```ini
DATABASE_URL="postgresql://user:password@localhost:5432/gamez?schema=public"
JWT_SECRET="generate_a_cryptographically_secure_key"
RAWG_API_KEY="your_rawg_api_key_here"
FRONTEND_URL="http://localhost:5173"
PORT=5050
```

---

## 🚀 Setup & Run Guide

### 1. Database Initialization
From the `backend/` directory, migrate and seed the database schema:
```bash
# Install dependencies
npm install

# Run Prisma Migrations
npx prisma migrate dev

# Seed database with base platforms and sample operator
npm run seed
```

### 2. Launch Backend API
```bash
# Dev Mode
npm run dev

# Production Build
npm run start
```

### 3. Launch Frontend Client
From the `frontend/` directory:
```bash
# Install dependencies
npm install

# Dev Mode
npm run dev

# Production Build compilation
npm run build
```

---

## 🎛️ Project Architecture

```
GAMEZ/
├── backend/
│   ├── prisma/             # Schema configuration and database seeds
│   └── src/
│       ├── config/         # Startup environment configuration
│       ├── controllers/    # Route controllers
│       ├── lib/            # Shared clients (Prisma, Pino logger)
│       ├── middleware/     # Auth, error, logging interceptors
│       ├── routes/         # Express endpoint definitions
│       └── services/       # Cache logic and RAWG database clients
└── frontend/
    └── src/
        ├── components/     # UI primitives (Cards, Buttons, Modals)
        ├── layouts/        # Layout view wrappers (Sidebar, Headers)
        ├── pages/          # Lazy routes (Dashboard, Armory, Search)
        └── store/          # Zustand global states (Auth, Preferences)
```

---

## 📡 API Telemetry Endpoints
- `GET /api/health` — Checks basic API server status.
- `GET /api/ready` — Checks database link, RAWG configurations, and telemetry coordinates.
- `POST /api/v1/auth/register` — Initializing player profile.
- `POST /api/v1/auth/login` — Establishes operator credentials link.
- `GET /api/v1/games/search` — Query RAWG database nodes.

---

## 🛡️ License
GAMEZ is distributed under the MIT License. See [LICENSE](LICENSE) for details.
