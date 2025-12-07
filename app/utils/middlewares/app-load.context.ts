import { createContext, type RouterContextProvider } from 'react-router';

import { type Route } from '../../+types/root';

type AppLoadContext = {
  tenant: string | null;
};

export const appLoadContext = createContext<AppLoadContext>({ tenant: null });
export const getTenant = (context: Readonly<RouterContextProvider>) => context.get(appLoadContext).tenant;
export const appLoadMiddleware: Route.MiddlewareFunction = async ({ context, request }) => {
  // Initialize app load context
  context.set(appLoadContext, { tenant: request.headers.get('x-tenant') });
};
