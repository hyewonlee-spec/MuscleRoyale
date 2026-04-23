# Muscle Royalty

Local-first, mobile-friendly training tracker scaffold built with React, Vite, TypeScript, and IndexedDB (Dexie).

## What is included
- App shell with bottom tab navigation
- Design system tokens based on soft graphite + muted sage
- IndexedDB as the source of truth
- Today page with daily check-in and readiness summary
- Workout start + active session logging
- Cycle page with optional menstruation tracking
- Progress overview
- More pages for profile, settings, exercise library, data export/import, and about
- Footer on every page:
  - Designed by Hyewon. IG@merchantofthewest

## Commands
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Notes
- No serverless API routes
- No backend dependency for core function
- No Notion dependency
- All important records are stored in IndexedDB
- Export/import is included for local backup and restore
