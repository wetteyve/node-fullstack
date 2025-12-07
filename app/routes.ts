import { type RouteConfig, route, prefix } from '@react-router/dev/routes';

import { rs911, uhtHerisau, resource, onCallSheduler } from './utils/app-paths';

export default [
  // Root route
  route('/', 'routes/_index.tsx'),

  // API routes
  ...prefix(resource.api, [
    route(resource.contactForm, 'routes/node.v1.api/contact-form.ts'),
    route(resource.uhtRegistration, 'routes/node.v1.api/uht-registration/registration.ts', [
      route(resource.fcCount, 'routes/node.v1.api/uht-registration/fc-count.ts'),
      route(resource.downloadRegistrations, 'routes/node.v1.api/uht-registration/download-registrations.ts'),
    ]),
  ]),

  // 911rs routes
  route(rs911.base, 'routes/911rs/base.tsx', [
    route(rs911.page, 'routes/911rs/page.tsx'),
    route(rs911.sitemap, 'routes/911rs/sitemap.tsx'),
    route(rs911.legacyRedirect, 'routes/911rs/legacy-redirect.tsx'),
  ]),

  // UHT Herisau routes
  route(uhtHerisau.base, 'routes/uht-herisau/base.tsx', [
    route(uhtHerisau.page, 'routes/uht-herisau/page.tsx'),
    route(uhtHerisau.sitemap, 'routes/uht-herisau/sitemap.tsx'),
    route(uhtHerisau.legacyRedirect, 'routes/uht-herisau/legacy-redirect.tsx'),
  ]),

  // On Call Sheduler routes
  route(onCallSheduler.home, 'routes/on-call-sheduler/home.tsx'),
] satisfies RouteConfig;
