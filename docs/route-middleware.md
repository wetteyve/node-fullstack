# Route Middleware

The application uses React Router 7's [middleware](https://reactrouter.com/how-to/middleware) feature to process requests before they reach route loaders, enabling shared logic like authentication and configuration across routes.

## Overview

Middleware functions run before route loaders and can:

- Extract and validate request data
- Set shared context values accessible in loaders
- Perform authentication/authorization checks
- Configure application-wide settings

Middleware is defined in route files using the `middleware` export.

## AppLoadContext Pattern

The application uses middleware to extract tenant information from request headers and make it available to all routes:

### Middleware Setup (`app/root.tsx`)

The root route registers the `appLoadMiddleware` which extracts the tenant from the `X-Tenant` header (set by the reverse proxy):

```typescript
import { appLoadMiddleware } from '#app/utils/middlewares/app-load.context';
import { timingsMiddleware } from '#app/utils/middlewares/timings.context';

export const middleware: Route.MiddlewareFunction[] = [timingsMiddleware, appLoadMiddleware];
```

### Middleware Implementation (`app/utils/middlewares/app-load.context.ts`)

The middleware reads the tenant header and sets it in a typed context:

```typescript
export const appLoadMiddleware: Route.MiddlewareFunction = async ({ context, request }) => {
  context.set(appLoadContext, { tenant: request.headers.get('x-tenant') });
};
```

### Route Access

All routes can access the tenant through the typed context helper:

```typescript
import { getTenant } from '#app/utils/middlewares/app-load.context';

export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  // Use tenant in your loader logic
};
```

This pattern is clean and type-safe, avoiding the need for server-side context manipulation.

See [`app/utils/middlewares/app-load.context.ts`](../app/utils/middlewares/app-load.context.ts) for the complete implementation.
