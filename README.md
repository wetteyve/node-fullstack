# Remix Multi-Tenant Proxy App

This is a **Remix (React Router 7)** application built to support **multi-tenancy** on a single server instance by simulating tenant separation through **reverse proxying**. Each tenant is represented as a top-level route segment and mapped to its respective domain using a combination of Apache `.htaccess` rules and internal path rewriting.

> ⚠️ **Important:** This is a **hacky, cost-efficient solution** intended for small, private projects. It is **not recommended** for large-scale or production-critical applications.

---

## ✨ How It Works

### 🧠 Concept

Instead of running multiple Remix apps (one per tenant/domain), we run **a single Remix server** that internally serves routes like:

```
/my-domain/*
/another-domain/*
```

Through reverse proxying (e.g., Apache + `.htaccess`), incoming requests from real domains (like `911rs.ch` or `uht-herisau.ch`) are rewritten to match the internal Remix route structure.

### ↻ Domain Proxy via `.htaccess`

Apache rewrites incoming requests based on the domain. Here's a simplified breakdown:

- Requests to `/` on `911rs.ch` redirect to `/start`. Use whatever is your applications entry point for this.
- All paths (except API routes) are **proxied** and **prefixed** with `/911rs/`.
- API routes (`/node/v1`) are proxied **as-is** without path rewriting.
- An `X-Tenant` header is injected to provide tenant info to the Remix app. We read this information and pass it to the applications context on the server.

See the example file [here](https://github.com/wetteyve/node-fullstack/blob/main/other/example.htaccess)

### 🧪 Client-Side Routing Adjustment

Because Remix's manifest assumes the full route (`/911rs/start`), we **manipulate the `__reactRouterManifest` before hydration** to strip the tenant prefix and make the client behave as if it's running at `/start`.

This is done in `entry.client.tsx`:

```ts
if (isProdDomain) {
  // Strip tenant prefix from routes before hydration
  const tenant = __TENANT__.tenant;
  const tenantRoutes = //manipulate routes
  ...
  __reactRouterManifest.routes = tenantRoutes;
}
```

> ⚠️ **This is a hack.** We modify Remix’s global router manifest directly. This may break in future versions of Remix and is **not a recommended practice**.

---

## 💠 Setup & Usage

### 📦 Install & Build

```bash
yarn install
yarn build
yarn start
```

### 🌐 Proxy for Local Development

You can run a local reverse proxy using:

```bash
yarn build && yarn start:proxy
```

Make sure your proxy setup mimics the production `.htaccess` logic, including the proper path rewrites and header injection.

---

## ➕ Adding New Tenants

To add a new domain:

1. Create a new route folder in `app/routes`:

   ```
   app/routes/my-new-tenant/home.tsx
   ```

2. Update your proxy configuration to:

   - Match `my-new-tenant.com`
   - Rewrite requests to `/<tenant-name>/...`
   - Set the `X-Tenant` header accordingly

3. That’s it! The client code will dynamically adjust to route properly.

---

## 🧪 Known Limitations

- Requires strict domain-to-route-name mapping (case-sensitive).
- Hacky manipulation of Remix internals — brittle and not future-proof.
- Relies on Apache-specific behavior (can be ported to NGINX, etc.).
- Cannot use `useLocation` or similar hooks before hydration if tenant data isn’t injected.

---

## ✅ When to Use This

- You're building **private, low-traffic** apps for multiple domains.
- You want **one deployment** for all tenants to save costs.
- You understand the trade-offs and accept occasional jank.

---

## 🚫 When _Not_ to Use This

- Public, high-traffic, or security-critical applications
- Projects that require frequent Remix upgrades or long-term maintainability
- If you need solid multi-tenant isolation or domain-level SSR

---

## 📄 License

MIT — Use at your own risk.
