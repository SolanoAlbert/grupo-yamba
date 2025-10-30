# Server-first architecture (Next.js App Router)

This project follows Next.js server-first recommendations. Server Components by default, Route Handlers for APIs, and server-only utilities in `lib/`.

## Top-level layout

- app/ — routes, layouts, server actions, route handlers
- lib/ — server-only modules (DB, auth, services)
- components/ — UI components (server by default; add `"use client"` for client)
- public/ — static assets
- types/ — shared TypeScript types
- hooks/ — React hooks (client/server depending on usage)
- core/ — domain logic (value objects, entities)
- middleware.ts — edge middleware for auth/role guards

## Current structure

```
src/
  app/
    layout.tsx
    page.tsx
    admin/
      page.tsx
    dashboard/
      page.tsx
    login/
      page.tsx
    api/
      auth/
        [...all]/
          route.ts   # Better Auth handler
      health/
        route.ts     # Health check (DB + auth)
  lib/
    auth.ts          # Better Auth config (server-only)
    db/
      mongodb.ts     # MongoDB client + helpers (server-only)
      mongoose.ts    # Cached mongoose connector (server-only)
  components/        # Your UI components
  hooks/
  core/
    shared/
      errors/
      value-objects/
    users/
    news/
  infra/             # Legacy bridge (temporary)
    auth/auth.ts     # Re-exports from lib/auth
    db/mongodb-client.ts  # Re-exports from lib/db/mongodb
    db/mongoose.ts   # Re-exports from lib/db/mongoose
    db/schemas/      # Mongoose models (to move to lib/db/models)
    services/cloudinary/cloudinary-config.ts
  types/
public/
middleware.ts         # Protects /dashboard, /admin (edge-safe)
```

## Conventions

- Server Components by default; use `"use client"` only when needed (state, effects, browser APIs).
- Keep server-only code under `lib/` and import it only in server contexts (Server Components, Route Handlers, server actions, middleware).
- API endpoints are Route Handlers: `app/<segment>/route.ts`.
- Server Actions: define inline in server components (recommended) or export from a server-only module and mark with `"use server"`.
- Use environment variables only in the server (`process.env.*`). Prefix with `NEXT_PUBLIC_` to expose to client if required.

## Auth

- Better Auth initialized in `lib/auth.ts` with `mongodbAdapter`.
- Exposed to Next via `app/api/auth/[...all]/route.ts`.
- Middleware fetches `GET /api/auth/session` to guard routes in edge runtime.

## Data

- Native driver in `lib/db/mongodb.ts` (clientPromise, dbPromise, helpers).
- Optional Mongoose in `lib/db/mongoose.ts`.
- Prefer server-side data fetching (in Server Components or route handlers).

## Client vs Server

- Server Components: default for pages, layouts, and most components.
- Client Components: add `"use client"` when using hooks like `useState`, `useEffect`, or browser APIs.

## Testing

- Keep unit tests close to modules or under a dedicated `__tests__/`.
- Use Testing Library for components and Jest DOM matchers.

## Next steps (optional)

- Move `infra/db/schemas/*` to `src/lib/db/models/*` and update imports.
- Create `src/lib/cloudinary.ts` (server-only) and remove `infra/services/cloudinary/*`.
- Add server actions for mutations (e.g., create/edit news) under route segments.
- Add CI (GitHub Actions) to run `npm run lint` and `tsc -p tsconfig.json` on PRs.
