# SEO & Meta Tags

This application uses React 19's native meta tag rendering for SEO optimization, providing server-side rendering support and dynamic metadata generation per route.

## Architecture

### Meta Tag Flow

1. **Route Loaders** - Generate metadata and return it via the `meta` field in loader data
2. **Root Component** - Extracts meta data from route matches using `findMetaInMatches()`
3. **MetaTags Component** - Renders meta descriptors as native React elements in the document head

### Key Components

**`meta.utils.tsx`** - Core utilities for meta tag handling:

- `findMetaInMatches()` - Traverses route matches to extract metadata from the deepest matching route
- `getGlobalMetaTags()` - Provides default fallback meta tags
- `MetaTags` - Component that renders meta descriptors using React 19's `use()` hook for streaming support
- `Meta` - Low-level component that renders individual meta descriptors as `<title>` and `<meta>` elements

**`root.tsx`** - Root component that:

- Receives `matches` prop containing all route match data
- Calls `findMetaInMatches(matches)` to extract metadata
- Renders `<MetaTags descriptors={metadata} />` in the document head

## Defining Meta Tags

### Route Loaders

Return a `meta` field in your route loader data containing an array of `MetaDescriptor` objects:

```tsx
export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  const pages = await fetchStrapiPages();

  // Generate meta tags
  const meta = generateMetaTags({ pages, publicUrl, faviconUrl });

  return {
    pages,
    meta, // Return meta in loader data
  };
};
```

### Example: Tenant Base Routes

Both `911rs/base.tsx` and `uht-herisau/base.tsx` use this pattern:

```tsx
export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  const pages = await fetchStrapiPages();
  const url = new URL(request.url);
  const publicUrl = `${url.origin}${url.pathname.replace(`/${tenant}`, '')}`;

  const meta = generateMetaTags({ pages, publicUrl, faviconUrl });

  return { pages, meta };
};

const generateMetaTags = ({ pages, publicUrl, faviconUrl }) => {
  const siteName = 'My Site';
  return [
    { title: siteName },
    { property: 'og:title', content: siteName },
    { property: 'og:url', content: publicUrl },
    { tagname: 'link', rel: 'icon', href: faviconUrl },
    // ... more meta tags
  ];
};
```

### Client Loaders with Streaming

For client-side navigation with streaming support, return a **promise** that resolves to meta tags:

```tsx
export const clientLoader = async ({ params, request }: Route.LoaderArgs) => {
  const dataPromise = fetchData();

  return {
    data: dataPromise,
    meta: dataPromise.then((data) => generateMetaTags(data)),
  };
};
```

The root component uses React 19's `use()` hook (via `MetaTags` component) to unwrap promise-based metadata, enabling progressive meta tag updates during streaming navigation.

## Route Matching Behavior

When multiple nested routes define metadata, `findMetaInMatches()` uses a **last match wins** strategy:

- Traverses route matches in reverse order (deepest to shallowest)
- Returns meta data from the first (deepest) match that has a `meta` field in its loader data
- Falls back to `getGlobalMetaTags()` if no match has a `meta` field

This ensures child routes can override parent route metadata.

### Example Route Hierarchy

```
/911rs (meta: "911rs | Node Fullstack")
  └─ /911rs/start (meta: "Home | 911rs")
```

When viewing `/911rs/start`, the child route's metadata is used.
