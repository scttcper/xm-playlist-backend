import { Server } from '@hapi/hapi';

import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 5000;

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
