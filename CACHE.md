# In-Memory Cache Implementation

## Overview

This implementation adds a 5-minute in-memory cache for all Strapi CMS API calls to reduce server load from bot traffic and frequent requests.

## How It Works

### Cache Structure

- **Namespace-based**: Each type of data (pages, content, sponsors, categories) has its own namespace
- **Key-based**: Within each namespace, data is cached by a unique key (e.g., page slug, ID)
- **TTL**: 5 minutes (300,000ms) default expiration time

### Cached Functions

#### 911rs (911rs/utils/page.utils.tsx)

- `fetchStrapiPages()` - All pages list
- `fetchStrapiContent(path)` - Individual page content by path

#### UHT Herisau (uht-herisau/utils/page.utils.tsx)

- `fetchStrapiPages()` - All pages list
- `fetchStrapiContent(path)` - Individual page content by path
- `fetchStrapiContentById(id)` - Individual page content by ID
- `fetchStrapiSponsors()` - All sponsors
- `fetchStrapiCategories()` - All categories

## Cache Behavior

1. **First Request**: Data is fetched from Strapi, stored in cache with timestamp
2. **Subsequent Requests (< 5 min)**: Data is returned from cache, no Strapi call
3. **After 5 Minutes**: Cache expires, next request fetches fresh data from Strapi

## Benefits

- ✅ Reduces load on Strapi server
- ✅ Faster response times for cached content
- ✅ Handles bot traffic efficiently
- ✅ No external dependencies (Redis, etc.)
- ✅ Automatic memory management per process

## Cache Management

### Manual Cache Clearing

```typescript
import { clearCache } from '#rs911/utils/cache.utils';
// or
import { clearCache } from '#uht-herisau/utils/cache.utils';

// Clear all caches
clearCache();

// Clear specific namespace
clearCache('strapi-pages');

// Clear specific key in namespace
clearCache('strapi-content', 'home');
```

### Cache Invalidation

The cache currently uses a time-based expiration strategy. For content updates:

- Cache will refresh automatically after 5 minutes
- For immediate updates, restart the server or manually clear the cache

## Considerations

- **Server Restarts**: Cache is in-memory, so it's cleared on server restart
- **Multiple Instances**: Each server instance has its own cache
- **Memory Usage**: Cache grows with unique requests but is limited to 5-minute windows
- **Stale Data**: Content may be up to 5 minutes old

## Future Improvements

Consider implementing:

- Cache warmup on server start
- Webhook-based invalidation from Strapi
- Redis cache for multi-instance deployments
- Configurable TTL per content type
