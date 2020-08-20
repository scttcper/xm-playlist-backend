import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import * as Sentry from '@sentry/node';

import config from '../config';
import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 5000;
Sentry.init({ dsn: config.dsn });

(async () => {
  const server = fastify({
    logger: true
  })

  // register api routes
  await registerApiRoutes(server);

  server.register(fastifyCors, {
    // put your options here
  })

  server.listen(port, (err, address) => {
    if (err) throw err
    server.log.info(`server listening on ${address}`)
  })
})();
