# GAMEZ — Backend Design Document (BDD)

## Version

1.1

## Status

FINAL APPROVED MVP BACKEND ARCHITECTURE

---

# 1. Backend Philosophy

GAMEZ follows a normalized relational database architecture.

The system separates:

- User Identity
- Game Metadata
- Personal Tracking Data
- User Preferences

This prevents duplication, improves scalability, and keeps responsibilities clearly defined.

---

# 2. Database Architecture

## Entity Relationship Diagram

```
User
 │
 │ 1 : Many
 ▼

LibraryEntry

 ▲
 │
 │ Many : 1
 │

Game

UserPreference
```

---

# 3. Database Models

## Model 1 — User

Purpose:

Stores account information and authentication data.

### Fields

```
id

username

email

passwordHash

createdAt

updatedAt
```

### Constraints

```
email → UNIQUE

username → UNIQUE
```

### Responsibilities

- Authentication
- Ownership of Library Entries
- Ownership of User Preferences

---

## Model 2 — Game

Purpose:

Stores game metadata imported from RAWG.

Each game exists only once globally in the database.

### Fields

```
id

rawgId

title

coverImage

description

platforms

rating

releaseDate

createdAt

updatedAt
```

### Constraints

```
rawgId → UNIQUE
```

### Platforms Format

```json
["PC", "PS5", "Xbox Series X"]
```

Stored as JSON Array.

### Responsibilities

- Game Information
- RAWG Metadata Storage
- Game Details Page Data

### Notes

The database stores the FULL description.

The frontend is responsible for truncating descriptions for:

- Library Cards
- Search Results
- Dashboard Widgets

---

## Model 3 — LibraryEntry

Purpose:

Stores user-specific tracking information.

Acts as the bridge between User and Game.

### Fields

```
id

userId

gameId

status

progress

lastUpdated

createdAt

updatedAt
```

### Status Enum

```
TO_PLAY

PLAYING

COMPLETED

DISCONTINUED
```

### Progress

```
Integer

Range:
0–100
```

### Constraints

```
userId + gameId
```

Must be unique.

A user cannot add the same game twice.

### Responsibilities

- Game Status Tracking
- Progress Tracking
- Dashboard Statistics
- Continue Playing Section

---

## Model 4 — UserPreference

Purpose:

Stores user customization settings.

### Fields

```
id

userId

theme

defaultView

createdAt

updatedAt
```

### Theme

```
DARK
```

MVP Default.

### Default View

```
CARD

SHELF

LIST
```

### Responsibilities

- Theme Settings
- Library View Preferences

---

# 4. Database Relationships

## User → LibraryEntry

```
One User

can own

Many Library Entries
```

Relationship:

```
1 : Many
```

---

## Game → LibraryEntry

```
One Game

can belong to

Many Users
```

Relationship:

```
1 : Many
```

---

## User → UserPreference

```
One User

has

One Preference Record
```

Relationship:

```
1 : 1
```

---

# 5. API Architecture

Base URL

```
/api/v1
```

---

# 6. Authentication Routes

## Register

```
POST /auth/register
```

Purpose:

Create a new user account.

---

## Login

```
POST /auth/login
```

Purpose:

Authenticate user and return JWT.

---

## Current User

```
GET /auth/me
```

Purpose:

Validate active session.

---

## Logout

```
POST /auth/logout
```

Purpose:

Remove client-side session.

---

# 7. Game Routes

## Search Games

```
GET /games/search?q=
```

Source:

RAWG API

Purpose:

Search external games.

---

## Game Details

```
GET /games/:rawgId
```

Source:

RAWG API

Purpose:

Retrieve detailed game information.

---

# 8. Library Routes

## Get Library

```
GET /library
```

Returns:

All games belonging to current user.

---

## Add Game

```
POST /library
```

Behavior:

```
Search Result

↓

Add Game

↓

Check Game Table

↓

Exists?

├─ YES
│
└─ NO → Create Game

↓

Create LibraryEntry

↓

Success
```

---

## Update Entry

```
PATCH /library/:id
```

Updates:

```
status

progress
```

---

## Delete Entry

```
DELETE /library/:id
```

Behavior:

Removes LibraryEntry.

Does NOT delete Game.

---

# 9. Dashboard Routes

## Dashboard Summary

```
GET /dashboard
```

Returns:

```json
{
  "totalGames": 42,
  "playing": 5,
  "completed": 20,
  "toPlay": 15,
  "discontinued": 2,
  "completionRate": 47.6
}
```

---

## Continue Playing

```
GET /dashboard/continue-playing
```

Returns:

Most recently updated PLAYING games.

---

# 10. Application Flows

## Registration Flow

```
Register Form

↓

Validation

↓

POST /auth/register

↓

Hash Password

↓

Store User

↓

Success
```

---

## Login Flow

```
Login Form

↓

POST /auth/login

↓

Validate Credentials

↓

Generate JWT

↓

Return Token

↓

Authenticated Session
```

---

## Search Flow

```
Search Query

↓

Backend Route

↓

RAWG API

↓

Results

↓

Display
```

---

## Add Game Flow

```
Search Results

↓

Add Game

↓

Check Database

↓

Create Game (if required)

↓

Create LibraryEntry

↓

Update Library
```

---

## Progress Update Flow

```
User Changes Progress

↓

PATCH Request

↓

Update LibraryEntry

↓

Refresh Dashboard
```

---

## Dashboard Flow

```
Open Dashboard

↓

Aggregate LibraryEntry Data

↓

Generate Statistics

↓

Return Dashboard Data

↓

Render Widgets
```

---

# 11. Design Principles

## Principle 1

Game metadata is stored once.

---

## Principle 2

User tracking data is stored separately.

---

## Principle 3

No duplicated game records.

---

## Principle 4

Dashboard data comes from LibraryEntry.

---

## Principle 5

RAWG is used for discovery.

GAMEZ is used for ownership and tracking.

---

# 12. MVP Scope

Included:

✔ User Authentication

✔ Game Search

✔ Game Details

✔ Library Management

✔ Status Tracking

✔ Progress Tracking

✔ Dashboard Statistics

✔ User Preferences

Excluded:

✘ AI Recommendations

✘ Steam Sync

✘ Achievement Tracking

✘ Reviews

✘ Social Features

✘ Mobile Applications

---

# Approval Status

Version: 1.1

Status: LOCKED

Ready For:

1. Folder Structure Specification
2. Development Roadmap
3. Prisma Schema Design
4. Actual Development