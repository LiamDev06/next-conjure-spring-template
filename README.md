# next-conjure-spring-template

A full-stack web application template/starter using **Next.js**, **Spring Boot**, and **Palantir Conjure** for type-safe API contracts. Conjure generates both the Java server interfaces and the TypeScript client from a single API definition, keeping the frontend and backend in sync.

A `CLAUDE.md` is included at the root, making this template AI agent-ready out of the box. It documents the project conventions, architecture decisions, and patterns (Jersey vs Spring MVC, Conjure error handling, generated code boundaries, frontend component structure) so that Claude Code understands the codebase without needing manual explanation.

## Why this setup?

This is my personal preferred setup. The technology choices reflect how I like to build things, and they aren't prescriptive or "the right way", just what I reach for when starting a new project.
Conjure for type-safe contracts between frontend and backend is invaluable to me, the code becomes cleaner and fully type-safe across both layers. Next.js on the frontend because it's what I know best.
Once again, the linting rules used are my personal preference of how I like my code to be styled, and also act as a good safety net against too much AI-sloppy code when I let my AI agents go lose on the codebase.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Backend | Spring Boot 4, Jersey (JAX-RS), JPA/Hibernate, Gradle 9 (Kotlin DSL) |
| API contract | Palantir Conjure |
| Database | PostgreSQL (prod), H2 in-memory (tests), Flyway migrations |

## What's pre-configured?

**Backend** (`template-server`)
- Spring Boot with Jersey REST (JAX-RS) instead of Spring MVC (to support Conjure-generated services)
- JPA + Hibernate with PostgreSQL; Flyway migrations ready to enable
- H2 in-memory database wired up for tests
- Actuator, CORS, and error mapping pre-configured
- Code quality: Spotless (Palantir Java Format), Checkstyle, and PMD — run via `./gradlew lint`

**API** (`template-api`)
- Conjure YAML definition with a full example CRUD service
- Generates Java objects + Jersey server interfaces (`template-api-objects`, `template-api-jersey`)
- Generates a TypeScript client (`template-api-typescript`) consumed directly by the frontend

**Frontend** (`template-app`)
- Next.js with `@tanstack/react-query` for data fetching
- Conjure TypeScript client pre-wired in `src/lib/api.ts`
- `react-hook-form` for forms
- `next-intl` for localization and messages
- Code quality: ESLint (Next.js + TypeScript + React Hooks/Compiler checks) and Prettier

## Getting started

### 1. Initialize the project

Replaces all `template` placeholders with your project name throughout all files and directories, then builds everything.

From the root, run:
```bash
make init myproject
```

> `myproject` should be lowercase. Hyphens are supported (e.g. `my-project`).

### 2. Configure environment

`init` auto-copies `.env.example` to `.env.local` (frontend) and `.env` (server). Update the generated files with your values:

- **Frontend** (`myproject-app/.env.local`): set `NEXT_PUBLIC_API_BASE_URL` to your backend URL (defaults to `http://localhost:8080`)
- **Server** (`myproject-server/src/main/resources/.env`): set `DATABASE_URL`, `DATABASE_USER`, and `DATABASE_PASSWORD`

### 3. Run
Run both the backend server and frontend app:

```bash
make dev
```

## Commands

### Make

| Command | Description |
|---|---|
| `make init [project-name]` | Initialize the project with your project name |
| `make dev` | Start the database, server and frontend together |
| `make gen-api-client` | Regenerate the API client after changes |

### Gradle

| Command | Description |
|---|---|
| `./gradlew lint` | Run Spotless, Checkstyle, and PMD |
| `./gradlew test` | Run server tests |
| `./gradlew build` | Compile, lint, and test |

### NPM

Run these from `template-app`.

| Command | Description |
|---|---|
| `npm run lint` | Run frontend ESLint checks |
| `npm run lint:fix` | Auto-fix frontend ESLint issues such as import ordering |
| `npm run format` | Format the frontend with Prettier |
| `npm run format:check` | Check frontend formatting with Prettier |
| `npm run typecheck` | Run the frontend TypeScript type checker |
| `npm run check` | Run frontend typecheck, lint, and format checks |

## Updating the API

1. Edit `template-api/src/main/conjure/api.yml`
2. Run `make gen-api-client` to regenerate and recompile the client
3. Implement the updated interface in `template-server`
