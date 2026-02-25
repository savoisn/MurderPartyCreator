# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

Monorepo with separate folders per concern. All backend code lives in `backend/`.

```
MurderPartyCreator/
├── backend/          # API + DB (HapiJS, Drizzle, PostgreSQL)
└── (frontend/)       # Future web frontend
```

## Backend commands

All commands run from the `backend/` directory:

```bash
pnpm dev              # Start dev server with hot reload (tsx watch)
pnpm build            # TypeScript compilation (tsc)
pnpm test             # Run all tests (vitest run)
pnpm test:watch       # Run tests in watch mode
pnpm vitest run tests/scenarios.test.ts  # Run a single test file
pnpm db:generate      # Generate Drizzle migrations from schema changes
pnpm db:migrate       # Apply migrations to database
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Drizzle Studio GUI
```

## Backend architecture

Murder mystery party creator REST API. Stack: **HapiJS + TypeScript + PostgreSQL + Drizzle ORM**.

### Request flow

`src/routes/*.ts` (route definitions + Joi validation) → `src/handlers/*.ts` (business logic + Drizzle queries) → `src/db/index.ts` (Drizzle client)

### Key conventions

- **ESM project** (`"type": "module"`) — all imports use `.js` extensions
- **Hapi's `server.inject()`** is used for integration tests (no HTTP server needed)
- **Joi validation** is declared in `src/validators/index.ts` and referenced in route `options.validate`
- **Error handling**: throw `@hapi/boom` errors in handlers; `onPreResponse` in `src/server.ts` formats them as `{ error: { statusCode, message } }`
- **Response envelope**: all success responses use `{ data: ... }`
- **DB types**: use `NewX` (insert) and `X` (select) types from `src/types/index.ts`, inferred from Drizzle schema
- Nested resources use parent ID in URL: `/scenarios/{scenarioId}/characters/{characterId}`
- Session status transitions are enforced: `draft → active → completed` (no going back)

### Database

Schema is the source of truth in `src/db/schema.ts`. Six tables: `scenarios`, `characters`, `clues`, `sessions`, `session_players`, `session_clues`. All PKs are UUIDs. Characters/clues cascade-delete with their scenario.

### Testing

Tests live in `tests/`. Uses Vitest with a test PostgreSQL database (configured via `.env.test`). Test helpers in `tests/helpers.ts` provide `getServer()`, `cleanDb()`, and factory functions (`createTestScenario`, `createTestCharacter`, etc.). Tests run sequentially (`fileParallelism: false`) to avoid DB conflicts.
