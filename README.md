# Small Task Management App

A lightweight task management app (in the style of JIRA) with a focused set of features for creating, tracking, and organizing tasks.

## Key features

- Create, edit, and delete tasks
- Task boards (basic columns/statuses)
- Assign tasks and add comments
- Minimal role/permission model (owner, member)
- Responsive UI optimized for quick workflows

## Tech stack

- Bun
- Next.js
- TypeScript
- Tailwindcss
- Shadcn

## Basic Config files

- App configuration in [lib/app-config.ts](lib/app-config.ts)
- Project configuration in [next.config.ts](next.config.ts)
- Package & scripts in [package.json](package.json)

## Important files

- App entry/layouts:
  - [app/layout.tsx](app/layout.tsx)
  - [app/error.tsx](app/error.tsx)
  - [app/loading.tsx](app/loading.tsx)
- Configuration & metadata:
  - [package.json](package.json)
  - [next.config.ts](next.config.ts)
  - [tsconfig.json](tsconfig.json)
  - [.env.local](.env.local) (local environment variables)
- App code & helpers:
  - [lib/app-config.ts](lib/app-config.ts)
  - Source folder: [src/](src/)
- Public assets: [public/](public/)

## Getting started (development)

1. Install dependencies

   ``` npm install ```

2. Set environment variables in .env.local (copy from any example or documented vars in repo).

3. Run the dev server

   ```npm run dev```

4. Open <http://localhost:3000> (See package.json for available scripts.)

Notes
This README is a starting point. Add detailed developer notes, API docs, and architecture diagrams as the project grows.
Check lib/app-config.ts for runtime configuration and any feature flags.
