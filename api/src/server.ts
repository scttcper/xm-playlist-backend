import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import * as Sentry from '@sentry/node';
import Boom from '@hapi/boom';

import config from '../config';
import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 5000;
Sentry.init({ dsn: config.dsn });

const server = fastify({
  logger: true,
});
server.register(fastifyCors);

server.setErrorHandler((error, request, reply) => {
  if (Boom.isBoom(error)) {
    return reply
      .code(error.output.statusCode)
      .type('application/json')
      .headers(error.output.headers)
      .send(error.output.payload);
  }

  Sentry.captureException(error);
});

// register api routes
registerApiRoutes(server);

server.listen(port, (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address}`);
});
