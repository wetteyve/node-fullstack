import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
