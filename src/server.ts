import next from 'next';
import { Server } from '@hapi/hapi';
import Good from '@hapi/good';
import Boom from '@hapi/boom';

import { registerPages, registerNextjs } from './pageRoutes';
import { registerApiRoutes } from './apiRoutes';


// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const port = parseInt(process.env.PORT as string, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app.prepare().then(async () => {
  const server = new Server({
    debug: { request: ['implementation'] },
    port,
  });

  // logging
  await server.register({
    plugin: Good,
    options: {
      reporters: {
        myConsoleReporter: [
          {
            module: '@hapi/good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*', ops: '*' }],
          },
          'stdout',
        ],
      },
    },
  });

  // TODO: add favicon
  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: () => {
      throw Boom.notFound();
    },
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
