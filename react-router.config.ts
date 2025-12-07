import { type Config } from '@react-router/dev/config';

export default {
  ssr: true,
  // Enable initial route discovery for multi tenancy support
  routeDiscovery: { mode: 'initial' },
  future: {
    unstable_optimizeDeps: true,
    v8_splitRouteModules: true,
    v8_middleware: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
