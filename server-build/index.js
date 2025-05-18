import { styleText } from "node:util";
import { createRequestHandler } from "@react-router/express";
import { ip as ipAddress } from "address";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import getPort, { portNumbers } from "get-port";
const MODE = process.env.NODE_ENV ?? "development";
const IS_PROD = MODE === "production";
const IS_DEV = MODE === "development";
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== "false";
const viteDevServer = IS_PROD ? void 0 : await import("vite").then(
  (vite) => vite.createServer({
    server: {
      middlewareMode: true
    },
    // We tell Vite we are running a custom app instead of 
    // the SPA default so it doesn't run HTML middleware
    appType: "custom"
  })
);
const app = express();
const getHost = (req) => req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
app.set("trust proxy", true);
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  const proto = req.get("X-Forwarded-Proto");
  const host = getHost(req);
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.get("*", (req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(302, safepath + query);
  } else {
    next();
  }
});
app.use(compression());
app.disable("x-powered-by");
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/node/v1/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  app.use("/node/v1", express.static("build/client", { maxAge: "1h" }));
}
app.get(["/img/*", "/favicons/*"], (_req, res) => {
  return res.status(404).send("Not found");
});
async function getBuild() {
  try {
    const build = viteDevServer ? await viteDevServer.ssrLoadModule("virtual:react-router/server-build") : (
      // @ts-expect-error - the file might not exist yet but it will
      await import("../build/server/index.js")
    );
    return { build, error: null };
  } catch (error) {
    console.error("Error creating build:", error);
    return { error, build: null };
  }
}
if (!ALLOW_INDEXING) {
  app.use((_, res, next) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    next();
  });
}
app.all(
  "*",
  createRequestHandler({
    getLoadContext: (req) => ({
      serverBuild: getBuild(),
      tenant: req.headers["x-tenant"]
      //subdomain or tenant
    }),
    mode: MODE,
    build: async () => {
      const { error, build } = await getBuild();
      if (error) {
        throw error;
      }
      return build;
    }
  })
);
const desiredPort = Number(process.env.PORT || 3e3);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100)
});
const portAvailable = desiredPort === portToUse;
if (!portAvailable && !IS_DEV) {
  console.log(`\u26A0\uFE0F Port ${desiredPort} is not available.`);
  process.exit(1);
}
const server = app.listen(portToUse, () => {
  if (!portAvailable) {
    console.warn(
      styleText(
        "yellow",
        `\u26A0\uFE0F  Port ${desiredPort} is not available, using ${portToUse} instead.`
      )
    );
  }
  console.log(`\u{1F680}  We have liftoff!`);
  const localUrl = `http://localhost:${portToUse}`;
  let lanUrl = null;
  const localIp = ipAddress() ?? "Unknown";
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`;
  }
  console.log(
    `
${styleText("bold", "Local:")}            ${styleText("cyan", localUrl)}
${lanUrl ? `${styleText("bold", "On Your Network:")}  ${styleText("cyan", lanUrl)}` : ""}
${styleText("bold", "Press Ctrl+C to stop")}
		`.trim()
  );
});
closeWithGrace(async ({ err }) => {
  await new Promise((resolve, reject) => {
    server.close((e) => e ? reject(e) : resolve("ok"));
  });
  if (err) {
    console.error(styleText("red", String(err)));
    console.error(styleText("red", String(err.stack)));
  }
});
//# sourceMappingURL=index.js.map
