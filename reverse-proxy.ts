import http, { type IncomingMessage, type ServerResponse } from 'node:http';

import chalk from 'chalk';
import httpProxy from 'http-proxy';

const setupPlayProxy = (proxyPort: number, tenant: string) => {
  const targetPort = 3000;
  const proxy = httpProxy.createProxyServer();

  proxy.on('proxyReq', (proxyReq) => {
    proxyReq.setHeader('x-tenant', tenant);
  });

  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url) {
      const originalPath = req.url;
      if (!originalPath.startsWith('/node/v1') && !originalPath.includes('/.well-known')) {
        req.url = `${tenant}/${originalPath}`;
        console.log(`Rewrite ${originalPath} -> ${req.url}`);
      }
    }

    proxy.web(req, res, { target: `http://localhost:${targetPort}`, changeOrigin: true }, (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong.');
    });
  });

  server.listen(proxyPort, () => {
    console.log(`${chalk.bold(tenant.toUpperCase())}:    ${chalk.cyan(`http://localhost:${proxyPort}/home`)}`);
  });
};

setupPlayProxy(8080, '911rs');
setupPlayProxy(8081, 'uht-herisau');
