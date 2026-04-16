## Project overview

Full-stack web application with a **Next.js** frontend, **Spring Boot** backend, and **Palantir Conjure** as the API contract layer. Conjure generates both the Java server interfaces and the TypeScript client from a single YAML definition — the frontend and backend are always in sync by construction.

## Project structure

```
├── template-api/                        # Conjure API definition + generated code
│   ├── src/main/conjure/api.yml        # Source of truth for the API — edit this
│   ├── template-api-objects/            # Generated Java types (never edit)
│   ├── template-api-jersey/             # Generated Java server interfaces (never edit)
│   └── template-api-typescript/         # Generated TypeScript client (never edit)
├── template-server/                     # Spring Boot application
│   └── src/main/java/com/template/server/
├── template-app/                        # Next.js application
│   └── src/
│       ├── app/                         # Next.js app router
│       ├── components/
│       └── lib/api.ts                   # Conjure HTTP bridge setup
└── scripts/
```

---

## Backend

### This is not standard Spring MVC

The backend uses **Jersey (JAX-RS)** instead of Spring MVC. This is required because Conjure generates JAX-RS server interfaces. Do not use `@RestController`, `@GetMapping`, `@PostMapping`, etc.

Instead, implement the Conjure-generated interface. The generated interface already carries all JAX-RS annotations — you only implement the method body.

**Example:**
```java
// DO NOT do this
@RestController
public class UserController {
    @GetMapping("/user/{userId}")
    public User getUser(@PathVariable UUID userId) { ... }
}

// DO this — implement the generated interface
@Component
public class UserResource implements UserService {
    @Override
    public User getUser(UUID userId) {
        // implementation here
    }
}
```

Register the resource in `JerseyConfig`:
```java
register(UserResource.class);
```

### Errors

Use Conjure's `ServiceException` with error types defined in `api.yml`. Do not use Spring's `@ExceptionHandler` or `ResponseStatusException`. The `ServiceExceptionMapper` already maps `ServiceException` to the correct HTTP response.

**Conjure generates the error factory class for you.** The `namespace` field on an error in `api.yml` determines the class name — `namespace: User` generates `UserErrors`, `namespace: Auth` generates `AuthErrors`, etc. Each error becomes a static factory method on that class (e.g., `UserNotFound` → `UserErrors.userNotFound(...)`).

Do not construct `ServiceException` inline and do not write your own `*Errors` class — use the generated one from the API package.

**Example:**
```java
// DO NOT do this — constructing ServiceException inline
throw new ServiceException(ProjectErrors.USER_NOT_FOUND, SafeArg.of("userId", userId));

// DO this — use the generated errors factory from the API package
throw UserErrors.userNotFound(userId);
```

The import comes from the generated API package, not the server:
```java
import com.template.api.user.UserErrors;
```

When adding a new error, define it in `api.yml` under `errors:` with the appropriate `namespace`, run `make gen-api-client`, and call the generated factory method in your resource.

### Database

- JPA + Hibernate with PostgreSQL in production
- Flyway migrations live in `src/main/resources/database/migration/` — currently disabled in `application.yml`, enable by setting `spring.flyway.enabled: true` when ready
- Database credentials are read from `src/main/resources/.env` via `springboot4-dotenv`

### Tests

Tests use H2 in-memory database. Annotate test classes with `@ActiveProfiles("test")` to pick up `application-test.yml`, which configures H2 and disables Flyway.

```java
@SpringBootTest
@ActiveProfiles("test")
class MyServiceTest { ... }
```

---

## API (Conjure)

### Never edit generated code

The contents of `template-api-objects/`, `template-api-jersey/`, and `template-api-typescript/` are fully generated. Any manual changes will be overwritten. All API changes go through `api.yml`.

### Changing the API

1. Edit `template-api/src/main/conjure/api.yml`
2. Run `make gen-api-client` — regenerates Java interfaces and TypeScript client
3. Implement any new/changed methods in the server resource class
4. The TypeScript client is automatically available in the frontend via `src/lib/api.ts`

### Conjure types

Conjure has its own type system that maps to both Java and TypeScript:

| Conjure | Java | TypeScript |
|---|---|---|
| `string` | `String` | `string` |
| `integer` | `int` | `number` |
| `uuid` | `UUID` | `string` |
| `boolean` | `boolean` | `boolean` |
| `list<T>` | `List<T>` | `T[]` |
| `optional<T>` | `Optional<T>` | `T \| undefined` |

---

## Frontend

### API calls

The Conjure TypeScript client is set up in `src/lib/api.ts`. Use it directly with `@tanstack/react-query`:

```typescript
import { api } from "@/lib/api";

const QUERY_KEY = ["useListUsers"]

const { data } = useQuery({
  queryKey: QUERY_KEY,
  queryFn: () => api.userService.listUsers(),
});
```

Do not write manual `fetch` calls for endpoints that exist in the Conjure definition — use the generated client.

### Component structure

Each component lives in its own directory with an `index.tsx` entry point. Styles use CSS Modules in a co-located `style.module.css` file.

```
// DO NOT do this
src/components/SomeComponent.tsx

// DO this
src/components/SomeComponent/
  index.tsx
  style.module.css
```

Import styles as `classes` in the component:
```typescript
// DO NOT do this
import styles from "./style.module.css";

// DO this
import classes from "./style.module.css";

export default function SomeComponent() {
  return <div className={classes.container}>...</div>;
}
```

### Localization

`next-intl` is set up for localisation and messages. Add message files under `messages/` and use `useTranslations` in components.

### Environment

`NEXT_PUBLIC_API_BASE_URL` controls the backend URL the client connects to (configured in `.env.local`).

### Frontend code quality

The frontend uses ESLint and Prettier. When working in `template-app`, treat lint compliance as part of the implementation, not as optional cleanup after the fact.

Important frontend commands, run from `template-app`:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run typecheck
npm run check
```

`npm run lint:fix` auto-fixes import ordering and some other mechanical issues. Prettier handles formatting only; import ordering is handled by ESLint auto-fix, not Prettier.

Key frontend rules that are intentionally strict to reduce AI-slop:

- Use `function` declarations for named components and helper functions where possible, not `const Foo = () =>`
- Use named exports by default; reserve default exports for framework-required files such as Next app entry files
- Do not use JSX `&&` rendering; use an explicit ternary instead
- Use meaningful identifier names; avoid one-letter names except common loop/index idioms like `i`, `j`, `k`, `x`, `y`, `z`
- Use explicit boolean conditions in TypeScript; avoid vague truthy/falsy checks
- Keep files reasonably small: frontend files are capped at 500 lines
- Keep lines readable: frontend lines are capped at 100 characters unless covered by configured exceptions
- File naming under `src/` must use `camelCase` or `PascalCase`, with explicit exceptions for Next special files like `page.tsx`, `layout.tsx`, `route.ts`, and `not-found.tsx`

When adding imports, prefer normal imports over inline fully qualified access patterns. Let `npm run lint:fix` keep import order consistent.

---

## Commands

### Make

| Command | Description |
|---|---|
| `make dev` | Start server and frontend together |
| `make gen-api-client` | Regenerate TypeScript client after API changes |

### Gradle

| Command | Description |
|---|---|
| `./gradlew :server:bootRun` | Start the server only |
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
