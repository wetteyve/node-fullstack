import { useEffect, useState } from 'react';

/**
 * Dynamically imports a module only on the client side.
 *
 * @param loadFn A function that returns `import('your-module')`
 * @returns The loaded module, or `undefined` if not yet loaded or on server
 */
export function useClientOnlyModule<T>(loadFn: () => Promise<T>): T | undefined {
  const [mod, setMod] = useState<T>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadFn().then(setMod);
    }
  }, [loadFn]);

  return mod;
}
