type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type Cache<T> = Map<string, CacheEntry<T>>;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const CLEANUP_INTERVAL = 10 * 60 * 1000; // Run cleanup every 10 minutes

const cache = new Map<string, Cache<any>>();

// Cleanup expired entries periodically to free memory
function cleanupExpiredEntries(): void {
  const now = Date.now();
  let totalRemoved = 0;

  cache.forEach((cacheStore, namespace) => {
    const keysToDelete: string[] = [];

    cacheStore.forEach((entry, key) => {
      if (now - entry.timestamp >= CACHE_TTL) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      cacheStore.delete(key);
      totalRemoved++;
    });

    // Remove empty namespace caches
    if (cacheStore.size === 0) {
      cache.delete(namespace);
    }
  });

  if (totalRemoved > 0) {
    console.log(`[Cache Cleanup] Removed ${totalRemoved} expired entries`);
  }
}

// Start periodic cleanup
const cleanupTimer = setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);

// Ensure cleanup runs even if process is idle
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

function getCache<T>(namespace: string): Cache<T> {
  if (!cache.has(namespace)) {
    cache.set(namespace, new Map());
  }
  return cache.get(namespace) as Cache<T>;
}

export async function getCachedData<T>(namespace: string, key: string, fetcher: () => Promise<T>, ttl: number = CACHE_TTL): Promise<T> {
  const cacheStore = getCache<T>(namespace);
  const now = Date.now();
  const cached = cacheStore.get(key);

  // Return cached data if it exists and is not expired
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // Remove expired entry immediately to free memory
  if (cached) {
    cacheStore.delete(key);
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  cacheStore.set(key, {
    data,
    timestamp: now,
  });

  return data;
}

export function clearCache(namespace?: string, key?: string): void {
  if (!namespace) {
    // Clear all caches
    cache.clear();
    return;
  }

  const cacheStore = cache.get(namespace);
  if (!cacheStore) return;

  if (key) {
    // Clear specific key
    cacheStore.delete(key);
  } else {
    // Clear entire namespace
    cacheStore.clear();
  }
}

export function getCacheStats(): { namespace: string; entries: number }[] {
  const stats: { namespace: string; entries: number }[] = [];

  cache.forEach((cacheStore, namespace) => {
    stats.push({
      namespace,
      entries: cacheStore.size,
    });
  });

  return stats;
}
