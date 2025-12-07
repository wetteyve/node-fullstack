# Server Timing

![Network tab of Chrome DevTools showing the Timing tab of a specific network call "This is what server timings do"](assets/server-timing.png)

This application includes a built-in server timing system that collects and reports performance metrics via the `Server-Timing` HTTP header. The timing middleware is configured in `app/root.tsx` and automatically publishes all timings to help you identify performance bottlenecks.

You can [learn more about the Server Timing header on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing). The metrics passed in this header are visually displayed in [the DevTools "Timing" tab](https://developer.chrome.com/docs/devtools/network/reference/#timing).

## How It Works

The timing middleware (`timingsMiddleware` in `app/utils/middlewares/timings.context.ts`) initializes an empty timings array at the start of each request and automatically:

1. Tracks total request duration
2. Collects timing entries from loaders and actions
3. Adds the `Server-Timing` header to the response with all collected metrics

The middleware sanitizes descriptor values to ensure they're valid for HTTP headers (replaces special characters with underscores).

## Measuring Performance

### Using the `measurePerformance` Helper (Recommended)

The recommended approach is to use the `measurePerformance` helper function, which handles all timing boilerplate automatically:

```tsx
import { measurePerformance } from '#app/utils/middlewares/timings.context';
import type { Route } from './+types/MyRoute';

export const loader = async ({ context }: Route.LoaderArgs) => {
  // Automatically measures and records the promise's performance
  const pages = await measurePerformance({
    context,
    promise: fetchStrapiPages(),
    name: 'fetch', // Optional, defaults to 'timing'
    descriptor: 'strapi_pages', // Optional, defaults to 'promise'
  });

  return { pages };
};
```

**Benefits:**

- Generic type preservation - the returned type matches the promise
- Automatic error handling - timings are still recorded if the promise fails (with `_error` suffix)
- Clean, minimal boilerplate

**Parameters:**

- `context`: The router context from loader/action args
- `promise`: The promise to measure
- `name` (optional): The metric name (e.g., 'fetch', 'db', 'compute') - defaults to `'timing'`
- `descriptor` (optional): A description of what's being measured - defaults to `'promise'`

### Manual Timing (Advanced)

For more control, you can manually access the `timingsContext`:

```tsx
import { timingsContext } from '#app/utils/middlewares/timings.context';
import type { Route } from './+types/MyRoute';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const timings = context.get(timingsContext);
  const start = performance.now();

  // Your operation
  const result = await expensiveOperation();

  timings.push({
    name: 'custom',
    descriptor: 'expensive_operation',
    duration: performance.now() - start,
  });
  context.set(timingsContext, timings);

  return { result };
};
```

Each timing entry requires three properties:

- `name`: The metric name (e.g., 'fetch', 'custom', 'db')
- `descriptor`: A description of what was timed (special characters are automatically sanitized)
- `duration`: The duration in milliseconds

## Viewing Timing Data

To view server timings:

1. Open Chrome DevTools
2. Go to the **Network** tab
3. Select a request
4. Click the **Timing** tab
5. Scroll down to see the **Server Timing** section

Each entry will show the name, descriptor, and duration in milliseconds.
