# Route Middleware

The application uses React Router 7's [middleware](https://reactrouter.com/how-to/middleware) feature to process requests before they reach route loaders, enabling shared logic like authentication and configuration across routes.

## Overview

Middleware functions run before route loaders and can:

- Extract and validate request data
- Set shared context values accessible in loaders
- Perform authentication/authorization checks
- Configure application-wide settings

Middleware is defined in route files using the `middleware` and `clientMiddleware` export.

## AppLoadContext Pattern

The application extends React Router's context system to pass tenant information from the server to all routes:

### Server Setup (`server/index.ts`)

The server attaches tenant data directly to the `RouterContextProvider` instance:

```typescript
getLoadContext: (req) => {
  const context = new RouterContextProvider();
  (context as any).tenant = req.headers['x-tenant'] as string | undefined;
  return context;
};
```

This allows the tenant header (set by the reverse proxy) to be accessible in the initial request context.

### Root Loader Bridge (`app/root.tsx`)

The root loader extracts the tenant from the raw context and sets it in the typed `appLoadContext`:

```typescript
export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenantHack(context); // Extract from raw context
  context.set(appLoadContext, { tenant }); // Set in typed context
  return { tenant };
};
```

### Child Route Access

All child routes can now access the tenant through the typed context:

```typescript
import { getTenant } from '#app/utils/middlewares/app-load.context';

export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  // Use tenant in your loader logic
};
```

See [`app/utils/middlewares/app-load.context.ts`](../app/utils/middlewares/app-load.context.ts) for the context definition and helper functions.
