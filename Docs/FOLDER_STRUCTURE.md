# GAMEZ — Folder Structure Specification

## Version

1.0

## Status

Approved

---

# Project Structure

```
GAMEZ/

├── frontend/
│
├── backend/
│
├── docs/
│
└── README.md
```

---

# Frontend Structure

Technology:

- React
- Vite
- Tailwind
- Zustand
- Axios
- React Router

---

```
frontend/

├── public/

├── src/
│
├── assets/
│
├── components/
│
├── pages/
│
├── layouts/
│
├── routes/
│
├── store/
│
├── services/
│
├── hooks/
│
├── utils/
│
├── constants/
│
├── types/
│
├── styles/
│
├── App.jsx
│
├── main.jsx
│
└── index.css
│
├── .env
│
├── package.json
│
└── vite.config.js
```

---

# assets/

Purpose:

Static assets.

```
assets/

├── images/
├── icons/
├── logos/
└── fonts/
```

Examples:

```
gamez-logo.svg
default-cover.png
```

---

# components/

Reusable UI pieces.

```
components/

├── ui/
│
├── dashboard/
│
├── library/
│
├── search/
│
├── auth/
│
└── common/
```

---

## ui/

Generic reusable components.

```
ui/

Button.jsx

Input.jsx

Modal.jsx

Badge.jsx

ProgressBar.jsx

Card.jsx

Loader.jsx
```

---

## dashboard/

Dashboard-specific components.

```
dashboard/

StatCard.jsx

ContinuePlaying.jsx

RecentUpdates.jsx
```

---

## library/

Library-specific components.

```
library/

GameCard.jsx

GameShelf.jsx

GameList.jsx

LibraryFilters.jsx
```

---

## search/

Search-specific components.

```
search/

SearchBar.jsx

SearchResultCard.jsx

SearchResults.jsx
```

---

# pages/

Route pages.

```
pages/

Dashboard/

Library/

Search/

GameDetails/

Profile/

Settings/

Login/

Register/
```

Each page gets its own folder.

Example:

```
Dashboard/

DashboardPage.jsx
```

---

# layouts/

Application layouts.

```
layouts/

MainLayout.jsx

AuthLayout.jsx
```

---

## MainLayout

Contains:

```
Sidebar

Header

Content Area
```

---

## AuthLayout

Contains:

```
Login

Register
```

without main navigation.

---

# routes/

```
routes/

AppRoutes.jsx

ProtectedRoute.jsx
```

Responsibilities:

- Route definitions
- Authentication checks

---

# store/

Zustand stores.

```
store/

authStore.js

libraryStore.js

searchStore.js

uiStore.js
```

---

# services/

API communication.

```
services/

api.js

authService.js

libraryService.js

gameService.js

dashboardService.js
```

Purpose:

Keep API calls outside components.

---

# hooks/

Custom React hooks.

```
hooks/

useAuth.js

useLibrary.js

useSearch.js
```

---

# utils/

Helper functions.

```
utils/

formatDate.js

calculateCompletion.js

truncateText.js
```

---

# constants/

Application constants.

```
constants/

statuses.js

routes.js

themes.js
```

---

# types/

Future TypeScript migration support.

Initially:

```
types/

game.js

user.js
```

Optional.

---

# styles/

Global styles.

```
styles/

animations.css

theme.css
```

---

# Backend Structure

Technology:

- Node.js
- Express
- Prisma
- PostgreSQL
- JWT

---

```
backend/

├── prisma/
│
├── src/
│
├── .env
│
├── package.json
│
└── server.js
```

---

# prisma/

Database layer.

```
prisma/

schema.prisma

migrations/
```

Single source of truth for database design.

---

# src/

Backend source code.

```
src/

├── config/
│
├── controllers/
│
├── routes/
│
├── lib/
│
├── middleware/
│
├── services/
│
├── validators/
│
├── utils/
│
├── constants/
│
└── app.js
```

---

# config/

Application configuration.

```
config/

database.js

jwt.js
```

---

# controllers/

Receive requests.

Return responses.

```
controllers/

authController.js

gameController.js

libraryController.js

dashboardController.js
```

Controllers should remain thin.

---

# services/

Business logic.

```
services/

authService.js

gameService.js

libraryService.js

dashboardService.js
```

This is where most logic lives.

---

# routes/

Express routes.

```
routes/

authRoutes.js

gameRoutes.js

libraryRoutes.js

dashboardRoutes.js
```

---

# lib/

Add a dedicated Prisma client layer

```
lib/

prisma.js
```

---

# middleware/

Express middleware.

```
middleware/

authMiddleware.js

errorMiddleware.js
```

---

# validators/

Request validation.

```
validators/

authValidator.js

libraryValidator.js
```

---

# utils/

Reusable helpers.

```
utils/

generateToken.js

formatResponse.js
```

---

# constants/

Backend constants.

```
constants/

statusEnum.js
```

---

# Documentation Structure

```
docs/

PRD.md

UIUX.md

TRD.md

SDD.md

BACKEND.md

FOLDER_STRUCTURE.md

ROADMAP.md
```

---

# Folder Structure Principles

## Principle 1

Pages own screens.

Components own UI.

---

## Principle 2

Services own API calls.

Components never call APIs directly.

---

## Principle 3

Controllers remain thin.

Services contain business logic.

---

## Principle 4

Prisma is the only layer that talks to PostgreSQL.

---

## Principle 5

A developer should know where a file belongs within 10 seconds.

If not, the structure is wrong.

---

# Approval Status

Version: 1.0

Status: LOCKED

Ready For Development Roadmap