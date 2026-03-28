# next-conjure-spring-template

A full-stack web application template/starter using **Next.js**, **Spring Boot**, and **Palantir Conjure** for type-safe API contracts. Conjure generates both the Java server interfaces and the TypeScript client from a single API definition, keeping the frontend and backend in sync.

A `CLAUDE.md` is included at the root, making this template AI agent-ready out of the box. It documents the project conventions, architecture decisions, and patterns (Jersey vs Spring MVC, Conjure error handling, generated code boundaries, frontend component structure) so that Claude Code understands the codebase without needing manual explanation.

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

| Command | Description |
|---|---|
| `make init [project-name]` | Initialise the project with your project name |
| `make dev` | Start the server and frontend together |
| `make gen-api-client` | Regenerate the TypeScript client after API changes |
| `./gradlew lint` | Run Spotless, Checkstyle, and PMD |
| `./gradlew test` | Run server tests |
| `./gradlew build` | Compile, lint, and test |

## Updating the API

1. Edit `template-api/src/main/conjure/api.yml`
2. Run `make gen-api-client` to regenerate and recompile the client
3. Implement the updated interface in `template-server`
