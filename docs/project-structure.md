# Project Structure

This document describes the organization of the codebase and the purpose of each major directory.

## 📁 Directory Overview

```
node-fullstack/
├── app/                    # React Router 7 application code
├── server/                 # Node.js server code
├── 911rs/                  # 911rs.ch tenant implementation
├── uht-herisau/            # uht-herisau.ch tenant implementation
├── scheduler/              # On-call scheduler service
├── docs/                   # Documentation
├── build/                  # Production build output (generated)
├── public/                 # Static assets
└── other/                  # Build scripts & utilities
```

---

## 🎯 Core Directories

### `app/` - React Router Application

The main application framework built with React Router 7. Contains all shared code, route definitions, API endpoints, and utilities used across tenants.

**Key files:**

- `routes.ts` - Route configuration
- `root.tsx` - Root layout & HTML shell
- `routes/` - Route implementations for all tenants
- `utils/` - Shared utilities and middleware

---

### `server/` - Node.js Server

Express server setup and configuration. Handles HTTP requests, static assets, and React Router integration.

**Key files:**

- `index.ts` - Production server
- `dev-server.js` - Development server with Vite

---

### `911rs/` - 911rs Tenant

Complete implementation for the 911rs.ch website (Porsche restoration garage). Self-contained with its own components, pages, styles, and business logic.

**Contains:**

- `components/` - React components
- `pages/` - Page components
- `styles/` - Tailwind config & tenant styles
- `utils/` - CMS integration, caching, page mapping

---

### `uht-herisau/` - UHT Herisau Tenant

Complete implementation for the uht-herisau.ch website (running event). Self-contained with registration system, results, and all tenant-specific functionality.

**Contains:**

- `components/` - React components (including shadcn/ui)
- `pages/` - Page components
- `styles/` - Tailwind config & tenant styles
- `services/` - API services
- `utils/` - CMS integration, registration logic, email utilities

---

## 🔑 Key Concepts

### Tenant Isolation

Each tenant (`911rs/`, `uht-herisau/`) is completely self-contained with its own:

- Components and pages
- Styles and theme
- Utilities and business logic
- CMS integration

**Shared code** lives in `app/utils/` for common functionality across tenants.

### Import Aliases

The project uses TypeScript path aliases for clean imports:

- `#app/*` → `./app/*` - Shared application code
- `#rs911/*` → `./911rs/*` - 911rs tenant code
- `#uht-herisau/*` → `./uht-herisau/*` - UHT Herisau tenant code

Always use these aliases instead of relative imports for cross-directory references.

### Build Output

The build process creates two bundles in `build/`:

1. **Client bundle** (`build/client/`) - Browser JavaScript with code splitting
2. **Server bundle** (`build/server/`) - SSR code for Node.js

Both are optimized for production with fingerprinted assets for cache-forever strategy.
