import { createContext, type RouterContextProvider } from 'react-router';

import { type Route } from '../../+types/root';

export const timingsContext = createContext<{ descriptor: string; duration: number; name: string }[]>([]);

export const timingsMiddleware: Route.MiddlewareFunction = async ({ context }, next) => {
  // Cleanup timings context
  context.set(timingsContext, []);
  const startTime = performance.now();

  // Await request processing
  const response = await next();
  const totalDuration = performance.now() - startTime;
  const timings = context.get(timingsContext);
  timings.unshift({ descriptor: 'total', duration: totalDuration, name: 'request' });

  if (timings.length > 0) {
    const headerValue = timings
      .map((t) => `${t.name};dur=${t.duration.toFixed(2)};desc=${t.descriptor.replaceAll(/(:| |@|=|;|,|\/|\\)/g, '_')}`)
      .join(',');
    response.headers.set('Server-Timing', headerValue);
  }

  return response;
};

export const measurePerformance = async <T>({
  context,
  promise,
  name = 'timing',
  descriptor = 'promise',
}: {
  context: Readonly<RouterContextProvider>;
  promise: Promise<T>;
  name?: string;
  descriptor?: string;
}): Promise<T> => {
  const timings = context.get(timingsContext);
  const start = performance.now();

  try {
    const result = await promise;
    timings.push({
      name,
      descriptor,
      duration: performance.now() - start,
    });
    context.set(timingsContext, timings);
    return result;
  } catch (error) {
    // Still record timing even if promise fails
    timings.push({
      name,
      descriptor: `${descriptor}_error`,
      duration: performance.now() - start,
    });
    context.set(timingsContext, timings);
    throw error;
  }
};
