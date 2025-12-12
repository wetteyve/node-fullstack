# React Router Multi-Tenant Proxy App

This is a **React Router 7 (Framework Mode)** application built to support **multi-tenancy** on a single server instance by simulating tenant separation through **reverse proxying**. Each tenant is represented as a top-level route segment and mapped to its respective domain using a combination of Apache `.htaccess` rules and internal path rewriting.

> ⚠️ **Important:** This is a **hacky, cost-efficient solution** intended for small, private projects. It is **not recommended** for large-scale or production-critical applications.

---

## ✨ How It Works

### 🧠 Concept

Instead of running multiple applications (one per tenant/domain), we run **a single React Router server** that internally serves routes like:

```
/911rs/*
/uht-herisau/*
/on-call-scheduler.yveswetter/*
```

Through reverse proxying (e.g., Apache + `.htaccess`), incoming requests from real domains (like `911rs.ch` or `uht-herisau.ch`) are rewritten to match the internal route structure.

### ↻ Domain Proxy via `.htaccess`

Apache rewrites incoming requests based on the domain. Here's how it works for `911rs.ch`:

1. **Remove www prefix** - Redirect `www.911rs.ch` to `911rs.ch`
2. **Root redirect** - Requests to `/` redirect to `/start` (your app's entry point)
3. **Path rewriting** - All paths (except API routes) are proxied and prefixed with `/911rs/`
4. **API passthrough** - API routes (`/node/v1/*`) are proxied as-is without rewriting
5. **Tenant header** - An `X-Tenant` header is injected to provide tenant context to the server

Example `.htaccess` configuration:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
# Redirect www to non-www
RewriteCond %{HTTP_HOST} ^www\.911rs\.ch$ [NC]
RewriteRule ^(.*)$ https://911rs.ch/$1 [R=301,L]
</IfModule>

<IfModule mod_rewrite.c>
RewriteEngine On
# Redirect root to /start
RewriteCond %{HTTP_HOST} ^(www\.)?911rs\.ch$ [NC]
RewriteCond %{REQUEST_URI} ^/?$
RewriteRule ^$ https://911rs.ch/start [R=301,L]
</IfModule>

<IfModule mod_rewrite.c>
RewriteEngine On
# Match the domain
RewriteCond %{HTTP_HOST} ^911rs\.ch$ [NC]
# Exclude API routes from rewriting
RewriteCond %{REQUEST_URI} !^/node/v1 [NC]
# Rewrite and proxy with tenant prefix
RewriteRule ^(.*)$ https://your-server.app/911rs/$1 [P,L]
</IfModule>

<IfModule mod_rewrite.c>
RewriteEngine On
# Proxy API routes as-is
RewriteCond %{HTTP_HOST} ^911rs\.ch$ [NC]
RewriteCond %{REQUEST_URI} ^/node/v1 [NC,OR]
RewriteRule ^(.*)$ https://your-server.app/$1 [P,L]
</IfModule>

<IfModule mod_headers.c>
# Inject tenant identifier
RequestHeader set X-Tenant "911rs"
</IfModule>
```

See the full example [here](https://github.com/wetteyve/node-fullstack/blob/main/other/example.htaccess)

### 🖥️ Server-Side Context

The server reads the `X-Tenant` header and passes it to React Router's load context in `server/index.ts`:

```ts
declare module 'react-router' {
  interface AppLoadContext {
    serverBuild: Promise<any>;
    tenant: string;
  }
}

app.all(
  '{/*splat}',
  createRequestHandler({
    getLoadContext: (req) => ({
      serverBuild: getBuild(),
      tenant: req.headers['x-tenant'] as string,
    }),
    mode: MODE,
    build: async () => {
      const { error, build } = await getBuild();
      if (error) throw error;
      return build;
    },
  })
);
```

This tenant value is available in all loaders and actions via the `context` parameter:

```ts
export const loader = ({ context }: Route.LoaderArgs) => {
  const { tenant } = context;
  // tenant will be "911rs", "uht-herisau", etc.
};
```

### 🌍 Root Layout Integration

The tenant context is injected into the client via a global variable in `app/root.tsx`:

```tsx
export const loader = ({ context: { tenant } }: Route.LoaderArgs) => ({
  tenant,
});

export default function App({ loaderData: { tenant } }: Route.ComponentProps) {
  return (
    <html lang='en'>
      <head>
        {/* ... */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.__TENANT__ = ${JSON.stringify({ tenant })};`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### 🧪 Client-Side Route Manifest Manipulation

Because React Router's manifest assumes the full route path (`/911rs/start`), we **manipulate the `__reactRouterManifest` before hydration** to strip the tenant prefix. This makes the client behave as if it's running at `/start` instead of `/911rs/start`.

This happens in `app/entry.client.tsx`:

```tsx
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

startTransition(() => {
  const { tenant } = __TENANT__;
  const isProdDomain = !!tenant;

  if (isProdDomain) {
    // Strip tenant prefix from routes before hydration
    let tenantRoutes: any = {};

    for (const route in __reactRouterManifest.routes) {
      // Always keep root route
      if (route === 'root') {
        tenantRoutes[route] = __reactRouterManifest.routes[route];
        continue;
      }

      // Check if the route includes the tenant identifier
      if (route.includes(tenant)) {
        // Remove tenant prefix from parent routes
        if (__reactRouterManifest.routes[route].parentId === 'root') {
          tenantRoutes[route] = {
            ...__reactRouterManifest.routes[route],
            path: '/',
          };
        } else {
          // Keep child routes as is
          tenantRoutes[route] = __reactRouterManifest.routes[route];
        }
      }
    }

    __reactRouterManifest.routes = tenantRoutes;
  }

  hydrateRoot(document, <HydratedRouter />);
});
```

> ⚠️ **This is a hack.** We modify React Router's global router manifest directly. This may break in future versions and is **not a recommended practice**.

---

## 💠 Setup & Usage

### 📦 Install & Build

```bash
yarn install
yarn build
yarn start
```

### 🌐 Local Development Proxy

You can run a local reverse proxy that simulates production behavior using:

```bash
yarn build && yarn start:proxy
```

This uses `other/reverse-proxy.ts` which creates local proxy servers on different ports:

- `http://localhost:8080` → proxies to `/911rs/*` with `X-Tenant: 911rs`
- `http://localhost:8081` → proxies to `/uht-herisau/*` with `X-Tenant: uht-herisau`
- `http://localhost:8082` → proxies to `/scheduler.yveswetter/*` with `X-Tenant: scheduler.yveswetter`

The proxy setup:

```ts
const setupPlayProxy = (proxyPort: number, tenant: string, entry: string) => {
  const targetPort = 3000;
  const proxy = httpProxy.createProxyServer();

  proxy.on('proxyReq', (proxyReq) => {
    proxyReq.setHeader('x-tenant', tenant);
  });

  const server = http.createServer((req, res) => {
    if (req.url) {
      const originalPath = req.url;
      // Rewrite path with tenant prefix (except API routes)
      if (!originalPath.startsWith('/node/v1')) {
        req.url = `/${tenant}${originalPath}`;
        console.log(`Rewrite ${originalPath} -> ${req.url}`);
      }
    }

    proxy.web(req, res, {
      target: `http://localhost:${targetPort}`,
      changeOrigin: true,
    });
  });

  server.listen(proxyPort);
};
```

---

## ➕ Adding New Tenants

To add a new domain/tenant:

1. **Create route folder** in `app/routes`:

   ```
   app/routes/my-new-tenant/
     ├── base.tsx        # Layout route
     ├── page.tsx        # Dynamic page route
     └── sitemap.tsx     # Sitemap route
   ```

2. **Register routes** in `app/routes.ts`:

   ```ts
   route('my-new-tenant', 'routes/my-new-tenant/base.tsx', [
     route(':page', 'routes/my-new-tenant/page.tsx'),
     route('sitemap.xml', 'routes/my-new-tenant/sitemap.tsx'),
   ]);
   ```

3. **Configure proxy** (production):
   - Update Apache `.htaccess` to match your domain
   - Rewrite requests to `/my-new-tenant/...`
   - Set `X-Tenant: my-new-tenant` header

4. **Add to local proxy** (development) in `other/reverse-proxy.ts`:

   ```ts
   setupPlayProxy(8083, 'my-new-tenant', '/home');
   ```

That's it! The client code will automatically adjust routing based on the tenant context.

---

## 🧪 Known Limitations

- **Brittle manifest manipulation** - Directly modifies React Router internals, may break on upgrades
- **Apache-specific** - Configuration examples use Apache mod_rewrite (can be adapted to NGINX)
- **Case-sensitive** - Route names must match tenant identifiers exactly
- **No true isolation** - All tenants share the same server process and memory
- **Hydration edge cases** - Client-side routing may misbehave if tenant data isn't properly injected
- **SEO considerations** - Each tenant needs separate sitemap and robots.txt handling

---

## ✅ When to Use This

- Building **private, low-traffic** apps for multiple domains
- Want **one deployment** for all tenants to save infrastructure costs
- Understand the trade-offs and accept occasional complexity
- Have control over the reverse proxy configuration
- Don't need strict tenant data isolation

---

## 🚫 When _Not_ to Use This

- **Public, high-traffic applications** - Use proper multi-tenancy or separate deployments
- **Security-critical projects** - Tenants should be isolated at infrastructure level
- **Frequent React Router upgrades** - Manifest manipulation may break
- **Need solid multi-tenant isolation** - Use database-level or subdomain-based separation
- **Enterprise applications** - Use established multi-tenant architectures
