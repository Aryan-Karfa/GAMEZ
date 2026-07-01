# GAMEZ — UI/UX Specification (Part 1: Design Philosophy)

## Design Philosophy

GAMEZ should feel like a physical gaming journal forged from steel, ink, and midnight darkness.

The interface should communicate ownership, progress, and collection rather than social interaction.

Unlike modern gaming platforms that rely on glass effects, gradients, and soft surfaces, GAMEZ embraces strong structure, visible hierarchy, and tactile interfaces.

Every card should feel like a collectible object.

Every interaction should feel deliberate.

Every page should feel like a command center for a serious gamer.

---

## Design Style

### Primary Style

Dark Neo-Brutalism

Characteristics:

- Thick borders
- Sharp corners
- High contrast
- Heavy shadows
- Bold typography
- Strong visual hierarchy
- Functional over decorative

---

### Secondary Style

Gothic Gaming Atmosphere

Characteristics:

- Deep dark surfaces
- Metallic accents
- Crimson highlights
- Minimal glow usage
- Serious mood
- High immersion

---

## Emotional Goals

The interface should feel:

- Personal
- Powerful
- Organized
- Focused
- Tactical
- Gamer-centric

The interface should NOT feel:

- Corporate
- Social-media-like
- Overly playful
- Cartoonish
- Futuristic neon overload

---

## Visual Inspirations

Conceptually inspired by:

- Dark fantasy game menus
- Physical game collections
- Tactical command interfaces
- Gothic architecture
- Industrial design
- Neo-Brutalist web design

Without directly copying any existing product.

---

## Design Principles

### Principle 1 — Information First

Content should always be more important than decoration.

---

### Principle 2 — Every Element Must Feel Physical

Cards should feel like objects.

Buttons should feel pressable.

Containers should feel weighty.

---

### Principle 3 — Contrast Creates Hierarchy

Hierarchy should come from:

- Size
- Weight
- Spacing
- Borders

Not excessive animations.

---

### Principle 4 — Motion Must Be Purposeful

Animations should communicate state changes.

No decorative animations.

No floating effects.

No unnecessary transitions.

---

### Principle 5 — Collection Above Discovery

GAMEZ is primarily a library manager.

The library should always feel like the heart of the application.

---

## Theme Direction

Theme Name:

Gothic Neo-Brutal

Core Mood:

"Personal Gaming Command Center"

Keywords:

- Dark
- Industrial
- Gothic
- Tactical
- Structured
- Heavy
- Intentional

---

# GAMEZ — UI/UX Specification (Part 2: Information Architecture & Screens)

## Application Structure

GAMEZ should feel small, focused, and intentional.

The user should never be more than 2–3 clicks away from any important action.

---

# Primary Navigation

Desktop Sidebar Navigation

```
GAMEZ

Dashboard

Library

Search

Profile

Settings
```

Future Features:

```
Recommendations
Achievements
Friends
```

These should not appear in MVP.

---

# Page Hierarchy

Dashboard

├── Quick Stats

├── Recently Updated

└── Continue Playing

Library

├── Card View

├── Shelf View

└── List View

Search

├── Search Results

└── Game Details

Profile

└── User Information

Settings

└── Application Preferences

---

# Dashboard

Purpose:

Provide an instant overview of the user's gaming activity.

---

## Dashboard Layout

Top Section:

```
TOTAL GAMES
PLAYING
COMPLETED
TO PLAY
```

Displayed as Neo-Brutalist statistic cards.

Example:

┌─────────────┐

│ TOTAL GAMES │

│ 42 │

└─────────────┘

---

## Continue Playing Section

Shows:

- Cover Image
- Game Name
- Progress
- Status

Example:

Cyberpunk 2077

Progress: 67%

---

## Recently Updated

Shows the most recently modified games.

Purpose:

Help user quickly resume tracking.

---

## Completion Statistics

Simple charts:

- Completion Rate
- Status Distribution

No advanced analytics in MVP.

---

# Library

Purpose:

The heart of GAMEZ.

The library should feel like a personal collection.

---

## View Toggle

```
[ Cards ]
[ Shelf ]
[ List ]
```

User preference saved locally.

---

## Filtering

Status Filter:

All

To Play

Playing

Completed

Discontinued

---

## Sorting

Alphabetical

Recently Added

Recently Updated

Progress %

---

## Search Within Library

Separate from RAWG search.

Searches only games already owned by the user.

---

# Search

Purpose:

Discover and add games.

---

## Search Layout

Top:

Search Bar

Example:

[ Search games... ]

---

## Search Results

Each result displays:

- Cover
- Name
- Platforms
- Release Year
- Rating

Action:

Add To Library

---

## Result Actions

If game already exists:

Button becomes:

Already Added

instead of Add To Library.

---

# Game Detail Page

Purpose:

Combine RAWG information with personal tracking.

---

## Hero Section

Displays:

Cover Image

Game Name

Platforms

Rating

Release Date

User Status

User Progress

---

## Tracking Panel

Editable:

Status

Progress

Notes (Future Feature)

---

## Description

RAWG description.

---

## Screenshots Gallery

Horizontal scroll.

---

## Metadata Section

Developer

Publisher

Genres

Release Date

---

# Profile

Purpose:

Basic user information.

MVP Fields:

Username

Email

Join Date

Total Games

---

# Settings

Purpose:

User customization.

MVP Options:

Theme

Default Library View

Account Settings

Logout

---

# Empty States

Library Empty:

"No games in your collection yet."

Action:

Search Games

---

Search Empty:

"No games found."

Action:

Try another search.

---

Dashboard Empty:

"Start building your collection."

Action:

Add your first game.

---

# Mobile Experience

Navigation becomes:

Bottom Navigation Bar

Dashboard

Library

Search

Profile

Settings

---

Cards stack vertically.

Shelf View becomes horizontal scrolling.

---

# Design Rule

Every page should answer one primary question:

Dashboard:

"What is happening?"

Library:

"What do I own?"

Search:

"What can I add?"

Game Detail:

"What do I know about this game?"

Profile:

"Who am I?"

Settings:

"How do I customize GAMEZ?"