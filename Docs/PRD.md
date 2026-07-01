# GAMEZ — Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

GAMEZ

### Product Type

Personal Gaming Library & Progress Tracking Platform

### Version

MVP v1.0

### Product Vision

GAMEZ is a personal-use-first web application that helps gamers organize, track, and manage their gaming journey.

Instead of maintaining spreadsheets, notes, screenshots, or relying on memory, users can maintain a centralized digital library of games they own, have completed, are currently playing, or wish to play in the future.

The primary goal of GAMEZ is to provide a clean, fast, and enjoyable experience for tracking game progress and maintaining a personal gaming collection.

---

## 2. Problem Statement

Gamers often face several issues:

- Forgetting games they wanted to play.
- Losing track of game completion progress.
- Maintaining scattered game lists across notes, spreadsheets, or multiple platforms.
- Difficulty visualizing gaming backlog and completed titles.
- Lack of a simple personal dashboard focused on individual gaming habits.

GAMEZ solves these problems by providing a single platform for library management and progress tracking.

---

## 3. Product Goals

### Primary Goals

- Create a personal gaming library.
- Organize games into meaningful categories.
- Track completion progress manually.
- Search and discover games using a reliable external database.
- View personal gaming statistics.

### Secondary Goals

- Learn modern full-stack development through a real project.
- Build a scalable foundation for future features.
- Create a portfolio-quality application.

---

## 4. Target Users

### Primary User

The project owner.

Characteristics:

- Plays games across multiple platforms.
- Wants a centralized library.
- Wants progress tracking.
- Wants statistics and completion insights.

### Future Users

Casual gamers.

Characteristics:

- Maintain gaming backlogs.
- Want simple tracking.
- Prefer clean interfaces over social features.

---

## 5. MVP Scope

The following features are included in Version 1.0.

### Authentication

Users can:

- Register
- Login
- Logout

### Game Search

Users can:

- Search games using RAWG API
- View game information
- Open detailed game pages

### Personal Library

Users can:

- Add games to library
- Remove games from library
- Update library entries

### Game Status Management

Supported statuses:

- To Play
- Playing
- Completed
- Discontinued

### Progress Tracking

Users can:

- Set progress percentage
- Update progress manually
- View last updated time

### Dashboard

Users can view:

- Total games
- Total completed games
- Games currently playing
- Games to play
- Completion rate

---

## 6. Out of Scope (Not Included in MVP)

The following features are intentionally excluded.

### Social Features

- Friend system
- Following users
- Public profiles
- Messaging

### External Synchronization

- Steam Sync
- Epic Games Sync
- PlayStation Sync
- Xbox Sync

### Advanced Tracking

- Automatic achievement sync
- Playtime tracking
- Trophy tracking

### AI Features

- Game recommendations
- Personalized discovery
- AI-generated summaries

### Community Features

- Reviews
- Ratings
- Comments
- Forums

### Mobile Applications

- Android App
- iOS App

---

## 7. Core User Stories

### Authentication

As a user,

I want to register an account,

so that I can maintain my personal library.

As a user,

I want to log in securely,

so that my library remains private.

---

### Search

As a user,

I want to search for games,

so that I can easily add them to my collection.

As a user,

I want to view game details,

so that I can decide whether to add the game.

---

### Library

As a user,

I want to add games to my library,

so that I can track them.

As a user,

I want to remove games,

so that my library remains accurate.

---

### Progress

As a user,

I want to update my progress,

so that I know how far I am in a game.

As a user,

I want to categorize games,

so that my library remains organized.

---

### Dashboard

As a user,

I want to view gaming statistics,

so that I understand my gaming habits.

---

## 8. Success Metrics

The MVP will be considered successful if:

- User can create an account.
- User can log in successfully.
- User can search games through RAWG.
- User can add games to library.
- User can update status.
- User can update progress.
- Dashboard statistics display correctly.
- Application remains responsive and stable.

---

## 9. Product Principles

### Simplicity First

Features should remain easy to understand and use.

### Personal Library Focus

GAMEZ is a personal management tool before becoming a social platform.

### Performance Matters

Pages should load quickly and interactions should feel instant.

### Scalable Foundation

Architecture should allow future expansion without major rewrites.

### Clean User Experience

The interface should prioritize clarity over complexity.

---

## 10. Future Roadmap (Post-MVP)

Potential future features:

### Version 2

- AI recommendations
- Advanced filtering
- Platform filtering
- Wishlist prioritization

### Version 3

- Steam integration
- Achievement tracking
- Playtime tracking

### Version 4

- Social profiles
- Reviews
- Community features

### Version 5

- Mobile application
- Push notifications
- Cross-platform sync

---

## MVP Summary

GAMEZ v1.0 is a personal gaming library platform that allows users to:

- Search games via RAWG
- Add games to a library
- Categorize games
- Track completion progress
- View personal gaming statistics

The MVP intentionally excludes AI, social systems, achievements, and platform integrations to focus on delivering a stable, educational, and portfolio-worthy full-stack application.