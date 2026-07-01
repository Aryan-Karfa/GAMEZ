# GAMEZ — System Design Document (SDD)

## Version

1.0

## Status

MVP Architecture Approved

---

# 1. High-Level Architecture

GAMEZ follows a 3-Tier Architecture.

```
┌─────────────────────┐
│      FRONTEND       │
│ React + Zustand     │
└──────────┬──────────┘
           │
           │ HTTPS
           │
┌──────────▼──────────┐
│      BACKEND        │
│ Node + Express      │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼

PostgreSQL      RAWG API
  Prisma
```

---

# 2. System Components

## Frontend

Responsibilities:

- Render UI
- Manage state
- Handle user interactions
- Call backend APIs
- Display data

Technologies:

- React
- Zustand
- Tailwind
- Axios
- React Router

---

## Backend

Responsibilities:

- Authentication
- Authorization
- Validation
- Business Logic
- Database Operations
- RAWG Integration

Technologies:

- Express
- JWT
- Prisma
- PostgreSQL

---

## Database

Responsibilities:

- Store users
- Store libraries
- Store progress
- Store preferences

---

## RAWG API

Responsibilities:

- Game Search
- Game Metadata
- Screenshots
- Platform Information

---

# 3. Authentication Flow

## Registration

```
User

↓
Register Form

↓
Frontend Validation

↓
POST /auth/register

↓
Backend Validation

↓
Hash Password

↓
Store User

↓
Return Success
```

---

## Login

```
User

↓
Login Form

↓
POST /auth/login

↓
Verify Password

↓
Generate JWT

↓
Return Token

↓
Store Token

↓
Authenticated Session
```

---

## Protected Route Access

```
User Request

↓
JWT Attached

↓
Auth Middleware

↓
Verify Token

↓
Continue Request
```

---

# 4. Search Flow

Purpose:

Search games from RAWG.

```
User Search

↓
Frontend Search Bar

↓
GET /games/search

↓
Backend Route

↓
RAWG API

↓
Return Results

↓
Display Results
```

---

# 5. Add To Library Flow

```
Search Result

↓
Add To Library

↓
POST /library

↓
Backend Validation

↓
Database Insert

↓
Return Updated Game

↓
Update Zustand Store

↓
UI Refresh
```

---

# 6. Update Progress Flow

```
User

↓
Edit Progress

↓
PATCH /library/:id

↓
Backend Validation

↓
Database Update

↓
Return Updated Record

↓
Update Store

↓
Refresh Card
```

---

# 7. Remove Game Flow

```
User

↓
Delete Game

↓
DELETE /library/:id

↓
Database Delete

↓
Return Success

↓
Remove From Store
```

---

# 8. Dashboard Flow

Purpose:

Generate user statistics.

```
Dashboard Opens

↓
GET /dashboard

↓
Backend Queries Database

↓
Calculate Statistics

↓
Return Dashboard Data

↓
Render Widgets
```

---

# 9. State Management Architecture

## Auth Store

Stores:

```
user

token

isAuthenticated
```

---

## Library Store

Stores:

```
games

filters

sortOrder

viewMode
```

---

## Search Store

Stores:

```
query

results

loading
```

---

## UI Store

Stores:

```
theme

sidebarState

preferences
```

---

# 10. Error Handling Flow

```
Request

↓
Validation

↓
Error?

├─ YES
│
└→ Return Error

NO
↓
Continue Processing
```

---

# 11. Database Interaction Flow

```
Express Route

↓
Controller

↓
Service Layer

↓
Prisma

↓
PostgreSQL

↓
Return Data
```

Benefits:

- Clean architecture
- Easier testing
- Easier maintenance

---

# 12. Request Lifecycle

Example:

Add Game

```
Frontend

↓
Axios Request

↓
Express Route

↓
Controller

↓
Service

↓
Prisma

↓
PostgreSQL

↓
Service

↓
Controller

↓
Response

↓
Frontend Update
```

---

# 13. Library Views Architecture

Card View

```
Game Cards
```

Primary View

---

Shelf View

```
Cover Collection
```

Visual Collection View

---

List View

```
Table Layout
```

Power User View

---

# 14. Scalability Design

Future Features Supported

- Recommendations
- Achievements
- Reviews
- Steam Sync
- Mobile App
- Notifications

without major redesign.

---

# 15. MVP Data Ownership Model

```
User

└── Library Games

      ├── Status
      ├── Progress
      └── Last Updated
```

Every game belongs to exactly one user.

---

# SDD Approval Status

Version: 1.0

Status: Approved

Ready For Backend Design Phase