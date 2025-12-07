# Styles

This project uses **Tailwind CSS 4** with tenant-specific style configurations.

## Per-Tenant Tailwind Setup

Each tenant has its own isolated Tailwind configuration in its respective `styles/app.css` file:

- **911rs**: `911rs/styles/app.css`
- **UHT Herisau**: `uht-herisau/styles/app.css`

### Tenant CSS Structure

Each tenant's `app.css` follows this pattern:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #e30613;
  --color-secondary: #313134;
}

@custom-variant touch {
  @media (any-hover: none), (pointer: coarse) {
    @slot;
  }
}

@custom-variant mouse {
  @media (hover: hover) {
    @slot;
  }
}

.app-container {
  @apply container mx-auto p-5;
  max-width: 1240px !important;
}
```

### Importing Tenant Styles

Tenant styles are imported in the base route file (`app/routes/<tenant>/base.tsx`):

```typescript
import '#rs911/styles/app.css';
// or
import '#uht-herisau/styles/app.css';
```

This ensures each tenant's styles are only loaded for that tenant's routes.

## Tailwind CSS 4 Features

This project uses **Tailwind CSS 4** (new syntax). Key differences from v3:

### Theme Variables

Use the `@theme` directive to define CSS variables:

```css
@theme {
  --color-primary: #e30613;
  --color-secondary: #313134;
}
```

Access in components:

```tsx
<div className='bg-primary text-secondary'>Content</div>
```

### Custom Variants

Define custom variants with `@custom-variant`:

```css
@custom-variant touch {
  @media (any-hover: none), (pointer: coarse) {
    @slot;
  }
}
```

Use in markup:

```tsx
<button className='touch:text-lg mouse:text-sm'>Button</button>
```

### Custom Utilities

Create reusable utility classes with `@utility`:

```css
@utility app-container {
  @apply container mx-auto p-5;
}
```

Or use regular CSS classes:

```css
.app-container {
  @apply container mx-auto p-5;
  max-width: 1240px !important;
}
```

## VS Code IntelliSense Configuration

Tailwind IntelliSense is configured per-tenant in `.vscode/settings.json`:

```json
{
  "tailwindCSS.experimental.configFile": {
    "911rs/styles/app.css": ["911rs/**/*", "app/routes/[911rs.yveswetter]/**/*"],
    "uht-herisau/styles/app.css": ["uht-herisau/**/*", "app/routes/[new.uht-herisau]/**/*"]
  }
}
```

This tells VS Code's Tailwind extension:

- Which CSS file to use for each tenant's components
- Which file patterns belong to each tenant

### Adding a New Tenant

When adding a new tenant, update `.vscode/settings.json`:

```json
{
  "tailwindCSS.experimental.configFile": {
    "911rs/styles/app.css": ["911rs/**/*", "app/routes/[911rs.yveswetter]/**/*"],
    "uht-herisau/styles/app.css": ["uht-herisau/**/*", "app/routes/[new.uht-herisau]/**/*"],
    "new-tenant/styles/app.css": ["new-tenant/**/*", "app/routes/new-tenant/**/*"]
  }
}
```

## Shared vs Tenant-Specific Styles

- **Tenant-specific**: Colors, fonts, spacing, custom utilities → defined in `<tenant>/styles/app.css`
- **Shared**: Global resets, base Tailwind imports → could be in a shared file, but currently each tenant imports independently

## Class Merging

The project uses `clsx` for conditional class names and `tailwind-merge` for merging classes:

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Usage
<div className={cn('bg-primary', isActive && 'bg-secondary')}>Content</div>
```

See `uht-herisau/utils/shadcn.utils.ts` for the implementation.

## Additional Tenant Style Files

Tenants can include additional CSS files for specific purposes:

- `animation.css` - Custom animations
- `typography.css` - Typography styles

Import these in components or the base route as needed:

```typescript
import '#rs911/styles/animation.css';
import '#rs911/styles/typography.css';
```
