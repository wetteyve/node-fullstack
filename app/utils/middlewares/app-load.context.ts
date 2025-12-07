import { createContext, type RouterContextProvider } from 'react-router';

type AppLoadContext = {
  tenant?: string;
};

export const appLoadContext = createContext<AppLoadContext>({});
export const getTenant = (context: Readonly<RouterContextProvider>) => context.get(appLoadContext).tenant;

// Utility function to extract tenant from the request handler context. This is only intended to be used in the root loader!
export const getTenantHack = (context: Readonly<RouterContextProvider>) => {
  const untypedContext = context as any;
  const tenant = untypedContext.tenant && typeof untypedContext.tenant === 'string' ? (untypedContext.tenant as string) : undefined;
  return tenant;
};
