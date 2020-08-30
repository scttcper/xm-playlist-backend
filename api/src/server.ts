import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import Boom from '@hapi/boom';
import fastifyExpress from 'fastify-express';

import config from '../config';
import { registerApiRoutes } from './apiRoutes';

const port = parseInt(process.env.PORT, 10) || 5000;

(async function () {
  const server = fastify({
    logger: true,
  });

  await server.register(fastifyCors);
  await server.register(fastifyExpress);

  Sentry.init({
    dsn: config.dsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app: server })
    ],
    tracesSampleRate: 1.0,
  });

  server.use(Sentry.Handlers.requestHandler());
  server.use(Sentry.Handlers.errorHandler());

  server.setErrorHandler((error, request, reply) => {
    if (Boom.isBoom(error)) {
      return reply
        .code(error.output.statusCode)
        .type('application/json')
        .headers(error.output.headers)
        .send(error.output.payload);
    }

    Sentry.captureException(error);
    reply.send(error);
  });

  // register api routes
  registerApiRoutes(server);

  server.listen(port, (err, address) => {
    if (err) throw err;
    server.log.info(`server listening on ${address}`);
  });
})();
