import { styleText } from 'node:util';
import { createRequestHandler } from '@react-router/express';
import { ip as ipAddress } from 'address';
import closeWithGrace from 'close-with-grace';
import compression from 'compression';
import express from 'express';
import getPort, { portNumbers } from 'get-port';
import { type ServerBuild } from 'react-router';

declare module 'react-router' {
  interface AppLoadContext {
    serverBuild: Promise<any>;
    tenant: string;
  }
}

declare global {
  var __TENANT__: { tenant: string };
  var __reactRouterManifest: {
    routes: Record<string, any>;
  };
}

const MODE = process.env.NODE_ENV ?? 'development';
const IS_PROD = MODE === 'production';
const IS_DEV = MODE === 'development';
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== 'false';

const viteDevServer = IS_PROD
  ? undefined
  : await import('vite').then((vite) =>
      vite.createServer({
        server: {
          middlewareMode: true,
        },
        // We tell Vite we are running a custom app instead of
        // the SPA default so it doesn't run HTML middleware
        appType: 'custom',
      })
    );

const app = express();

// no ending slashes for SEO reasons
// https://github.com/epicweb-dev/epic-stack/discussions/108
app.get('*', (req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(302, safepath + query);
  } else {
    next();
  }
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/node/v1/assets',
    express.static('build/client/assets', {
      immutable: true,
      maxAge: '1y',
      // We need to set the correct content type for wasm files
      setHeaders(res, filePath) {
        if (filePath.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
        }
      },
    })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(
    '/node/v1',
    express.static('build/client', {
      maxAge: '1h',
      // We need to set the correct content type for wasm files
      setHeaders(res, filePath) {
        if (filePath.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
        }
      },
    })
  );
}

async function getBuild() {
  try {
    const build = viteDevServer
      ? await viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      : // @ts-expect-error - the file might not exist yet but it will
        await import('../build/server/index.js');

    return { build: build as unknown as ServerBuild, error: null };
  } catch (error) {
    // Catch error and return null to make express happy and avoid an unrecoverable crash
    console.error('Error creating build:', error);
    return { error: error, build: null as unknown as ServerBuild };
  }
}

if (!ALLOW_INDEXING) {
  app.use((_, res, next) => {
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
  });
}

// Silence the chrome devtools request
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(404);
  res.end();
});

app.all(
  '*',
  createRequestHandler({
    getLoadContext: (req) => ({
      serverBuild: getBuild(),
      tenant: req.headers['x-tenant'] as string, //subdomain or tenant
    }),
    mode: MODE,
    build: async () => {
      const { error, build } = await getBuild();
      // gracefully "catch" the error
      if (error) {
        throw error;
      }
      return build;
    },
  })
);

const desiredPort = Number(process.env.PORT || 3000);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
});
const portAvailable = desiredPort === portToUse;
if (!portAvailable && !IS_DEV) {
  console.log(`⚠️ Port ${desiredPort} is not available.`);
  process.exit(1);
}

const server = app.listen(portToUse, () => {
  if (!portAvailable) {
    console.warn(styleText('yellow', `⚠️  Port ${desiredPort} is not available, using ${portToUse} instead.`));
  }
  console.log(`🚀  We have liftoff!`);
  const localUrl = `http://localhost:${portToUse}`;
  let lanUrl: string | null = null;
  const localIp = ipAddress() ?? 'Unknown';
  // Check if the address is a private ip
  // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
  // https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`;
  }

  console.log(
    `
${styleText('bold', 'Local:')}            ${styleText('cyan', localUrl)}
${lanUrl ? `${styleText('bold', 'On Your Network:')}  ${styleText('cyan', lanUrl)}` : ''}
${styleText('bold', 'Press Ctrl+C to stop')}
		`.trim()
  );
});

closeWithGrace(async ({ err }) => {
  await new Promise((resolve, reject) => {
    server.close((e) => (e ? reject(e) : resolve('ok')));
  });
  if (err) {
    console.error(styleText('red', String(err)));
    console.error(styleText('red', String(err.stack)));
  }
});
