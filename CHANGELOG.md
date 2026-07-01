# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-02

### Added
- Completed **Gothic Neo-Brutalist & Industrial** style system (CRT overlays, rivet corners `[+]`, 3px offset button mechanics).
- Integrated global, non-blocking toast system aligned with Gothic Neo-Brutalist aesthetics.
- Replaced all raw browser `alert()` popups with themed toast notifications.
- Automated structured Pino JSON logger output for server request monitoring.
- Dynamic readiness endpoint `/api/ready` checking database link connectivity and external RAWG API credentials.
- Integrated lightweight in-memory cache layer for details and searches.
- Revamped react ErrorBoundary displaying console recovery screens and manual reboot handles.
- Built a custom 404 Route (`/pages/NotFound/NotFoundPage.jsx`).

### Secured
- Tightened Express CORS configurations.
- Integrated Helmet middleware security headers.
- Implemented route-specific rate-limit thresholds for login, signup, and scraper routes.
- Enforced algorithm strictness (`HS256`) and normalized token errors in `authMiddleware.js`.
- Prevented database stack trace leakage to production clients.
- Enforced strict route guards on protected paths with authentication validation on app boot.
- Added self-healing recovery for corrupted `localStorage` entries on startup to prevent boot crashes.
- Configured global Axios interceptor to trigger clean logout and redirect on `401 Unauthorized` response.
