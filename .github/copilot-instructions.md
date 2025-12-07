# GitHub Copilot Instructions

## Project Overview

Multi-tenant React Router 7 (SSR) application serving multiple websites from a single Node.js instance. Built with TypeScript, Tailwind CSS 4, and Zustand. Uses reverse proxy with Apache `.htaccess` to route domains to tenant-specific paths internally.

**Tech Stack:** React Router 7 (Framework Mode), Express, Vite, TypeScript, Tailwind CSS 4, Zustand, Strapi CMS (headless), Resend (email)

## Architecture

### Multi-Tenancy Model

This app uses a **hacky reverse proxy approach** to serve multiple domains from one server:

- External domains (`911rs.ch`, `uht-herisau.ch`) proxy to internal paths (`/911rs/*`, `/uht-herisau/*`)
- Apache `.htaccess` rewrites requests and injects `X-Tenant` header (see `other/example.htaccess`)
- Server reads tenant from header in `server/index.ts` and passes to React Router load context
- Client-side manifest manipulation in `app/entry.client.tsx` strips tenant prefix for seamless routing

**Important:** Routes are defined in `app/routes.ts` with tenant base paths, but clients see clean URLs without prefixes.

### Tenant Structure

Each tenant lives in its own top-level directory (`911rs/`, `uht-herisau/`) with:

- `components/` - Tenant-specific React components
- `pages/` - Page components (mapped in `utils/page.utils.tsx`)
- `styles/` - CSS files (imported in base route)
- `utils/` - Utilities including Strapi API calls, caching, page mapping

### Path Aliases

Use TypeScript path aliases defined in `tsconfig.json`:

- `#app/*` → `./app/*` (shared app code)
- `#rs911/*` → `./911rs/*` (911rs tenant)
- `#uht-herisau/*` → `./uht-herisau/*` (UHT Herisau tenant)

**Always use these aliases** instead of relative imports for cross-directory references.

### Route Configuration

Routes use programmatic config in `app/routes.ts` with centralized path constants from `app/utils/app-paths.ts`. When adding routes:

1. Define path constants in `app/utils/app-paths.ts`
2. Add route in `app/routes.ts` using `route()` function
3. Create route file in `app/routes/<tenant>/` with typed loader/action

API routes live under `/node/v1/api/*` and bypass tenant rewriting.

### In-Memory Caching

All Strapi CMS calls are cached for **5 minutes** using namespace-based in-memory cache:

- Implementation: `<tenant>/utils/cache.utils.ts`
- Usage: Wrap API calls with `getCachedData(namespace, key, fetchFn)`
- Automatically cleans expired entries every 10 minutes
- Cache clears on server restart (not Redis/persistent)

**Pattern:**

```typescript
return getCachedData('strapi-pages', 'all', async () => {
  // Axios call to Strapi API
});
```

### Environment Variables

Managed via Zod schema in `app/utils/server/env.server.ts`:

- Server validates on startup with `checkEnvironment()`
- Access via global `ENV` object (set in `app/entry.server.tsx`)
- Each tenant has separate CMS credentials (see `docs/environment-variables.md`)

Never use `process.env` directly in app code - use `ENV` global.

### Styles and Tailwind CSS 4

Each tenant has isolated Tailwind configuration in `<tenant>/styles/app.css`:

- **Theme variables**: Define with `@theme { --color-primary: #hex; }`
- **Custom variants**: Use `@custom-variant` (e.g., `touch:`, `mouse:`)
- **Custom utilities**: Define with `@utility` or regular CSS classes
- **VS Code IntelliSense**: Configured per-tenant in `.vscode/settings.json`

Import tenant styles in base route: `import '#rs911/styles/app.css'`

When adding a new tenant, update `.vscode/settings.json` with the new tenant's CSS file path and file patterns for IntelliSense.

### React Router Middleware & Context

The app uses React Router 7's middleware mode to pass tenant information from server to routes:

**Server Setup** (`server/index.ts`):

- `getLoadContext` attaches tenant from `X-Tenant` header to `RouterContextProvider` instance
- Pattern: `(context as any).tenant = req.headers['x-tenant']`

**Root Loader Bridge** (`app/root.tsx`):

- Extracts tenant from raw context using `getTenantHack(context)`
- Sets it in typed `appLoadContext` for child routes: `context.set(appLoadContext, { tenant })`

**Child Route Access**:

- Import: `import { getTenant } from '#app/utils/middlewares/app-load.context'`
- Use: `const tenant = getTenant(context)` in any loader

This pattern allows extending context with additional values beyond tenant. See `docs/route-middleware.md` for details.

## Development Workflow

### Commands

```bash
yarn dev          # Start dev server (http://localhost:3000)
yarn build        # Production build (Remix + server)
yarn start        # Run production build
yarn typecheck    # Type check + generate route types
yarn lint         # ESLint
yarn format       # Prettier
```

### Dev Server Behavior

- Dev mode uses Vite dev server with middleware mode (`server/dev-server.js`)
- Production serves static assets from `build/client/` with `/node/v1/` base path
- Assets fingerprinted for cache-forever strategy in production

### Accessing Tenants Locally

When developing locally, access tenants via path prefixes:

- `http://localhost:3000/911rs/start`
- `http://localhost:3000/uht-herisau/home/registration`

Production domains route automatically via `.htaccess`.

## Key Patterns

### Typed Routes

React Router 7 auto-generates types. Use them:

```typescript
import { type Route } from './+types/page';

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const { tenant } = context; // Available in all loaders/actions
  return { data };
};
```

### Component Rendering from CMS

Pages dynamically render components based on Strapi content type:

```typescript
// In <tenant>/utils/page.utils.tsx
export const renderPage = (content: PageContent) => {
  if (isHomeContent(content)) return <Start content={content} />;
  if (isLeistungenContent(content)) return <Leistungen content={content} />;
  // ... map CMS content to page components
};
```

### SEO Metadata

SEO handled in base routes (`app/routes/<tenant>/base.tsx`) using `meta` export:

- Reads from Strapi `seo_settings` field
- Includes Open Graph tags, keywords, indexing rules
- Dynamic favicon per tenant

### Static Assets

Production assets served with `/node/v1/` base:

- Configured in `vite.config.ts` via `base` option
- Use `resourceBase` from `app/utils/app-paths.ts` for asset URLs
- Favicon URLs constructed with tenant prefix

## Common Tasks

### Adding a New Tenant

1. Create tenant directory: `<tenant-name>/` with `components/`, `pages/`, `styles/`, `utils/`
2. Add path constants to `app/utils/app-paths.ts`
3. Add routes to `app/routes.ts`
4. Create base route: `app/routes/<tenant-name>/base.tsx` (layout + loader)
5. Add TypeScript path alias in `tsconfig.json`
6. Add env vars for CMS credentials
7. Configure `.htaccess` for domain proxy

### Adding API Endpoints

Place in `app/routes/node.v1.api/` and register in `app/routes.ts` under `resource.api` prefix. These bypass tenant rewriting.

### Updating Dependencies

Use exact versions (no `^` or `~`) as seen in `package.json`. This project pins dependencies for stability.

## Important Constraints

- **Node.js 22** required (see `package.json` engines)
- **Tailwind CSS 4** (new syntax, check docs if unfamiliar)
- Cache is **in-memory only** - design for process restarts
- Multi-tenant routing requires both client + server manifest manipulation
- Production assets **must** use `/node/v1/` base path

## Credits

This setup is heavily inspired by the [Epic Stack](https://github.com/epicweb-dev/epic-stack) from Epic Web Dev, especially regarding dev & build processes, tooling configuration, and development workflow patterns.
