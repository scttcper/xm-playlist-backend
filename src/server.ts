import next from 'next';
import { Server } from '@hapi/hapi';

import { registerPages, registerNextjs } from './pageRoutes';
import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './frontend' });

app.prepare().then(async () => {
  const server = new Server({
    debug: { request: ['implementation'] },
    port,
  });

  // register the nextjs pages
  registerPages(server, app);

  // register api routes
  await registerApiRoutes(server);

  // handle next static assets
  registerNextjs(server, app);

  await server.start();
  console.log(`> Ready on http://localhost:${port}`);
});
