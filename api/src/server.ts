import { Server } from '@hapi/hapi';
import * as Sentry from '@sentry/node';

import config from '../config';
import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 5000;
Sentry.init({ dsn: config.dsn });

(async () => {
  const server = new Server({
    debug: { request: ['implementation'] },
    port,
  });

  // register api routes
  await registerApiRoutes(server);

  await server.start();
  console.log(`> Ready on http://localhost:${port}`);
})();
