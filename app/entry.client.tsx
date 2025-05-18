import { startTransition } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

startTransition(() => {
  const { tenant } = __TENANT__;
  const isProdDomain = !!tenant;

  if (isProdDomain) {
    // Adjust the path of the parent route for the active Tenant when the application is requested via prod domains.
    // This strips the unneeded (sub)paths away and allows the client app to run
    // on /home instead of /911rs/home for example.
    let tenantRoutes: any = {};
    for (const route in __reactRouterManifest.routes) {
      if (route === 'root') {
        tenantRoutes[route] = __reactRouterManifest.routes[route];
      }
      if (route.includes(tenant) || route === 'root') {
        let path = __reactRouterManifest.routes[route].path.split(`${tenant}/`).join('');
        if(path === tenant) path = ''
        tenantRoutes[route] = { ...__reactRouterManifest.routes[route], path };
      }
    }
    __reactRouterManifest.routes = tenantRoutes;
  }

  hydrateRoot(document, <HydratedRouter />);
});
