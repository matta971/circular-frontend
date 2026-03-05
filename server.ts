import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { ɵsetAngularAppEngineManifest } from '@angular/ssr';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Load engine manifest and set up Angular SSR
const initPromise = import(
  /* webpackIgnore: true */
  new URL('./angular-app-engine-manifest.mjs', import.meta.url).href
).then((m) => {
  const manifest = m.default;
  // Add allowedHosts if missing (required by AngularNodeAppEngine)
  if (!manifest.allowedHosts) {
    manifest.allowedHosts = new Set([
      'localhost',
      'frontend',
      'circular-electronics.com',
      'www.circular-electronics.com',
      'api.circular-electronics.com',
      '95.217.183.194',
    ]);
  }
  ɵsetAngularAppEngineManifest(manifest);
  return new AngularNodeAppEngine();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).send('healthy\n');
});

app.use('/**', (req, res, next) => {
  initPromise
    .then((angularApp) => angularApp.handle(req))
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Angular SSR server listening on http://localhost:${port}`);
  });
}

export default createNodeRequestHandler(app);
