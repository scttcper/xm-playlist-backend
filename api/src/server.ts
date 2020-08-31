import url from 'url';

import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import Boom from '@hapi/boom';
import fastifyExpress from 'fastify-express';

import config from '../config';
import { registerApiRoutes } from './apiRoutes';

Sentry.init({
  dsn: config.dsn,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  tracesSampleRate: 0.6,
});

const port = parseInt(process.env.PORT, 10) || 5000;

(async function () {
  const server = fastify({
    logger: true,
  });

  await server.register(fastifyCors);
  await server.register(fastifyExpress);

  server.use(Sentry.Handlers.requestHandler());
  server.use(Sentry.Handlers.errorHandler());

  function onRequest(req, res, done) {
    const path = req.context?.config?.url ?? url.format(req.raw.url);
    req.context._transaction = Sentry.startTransaction({
      op: path,
      name: `${req.context?.config?.method ?? req.raw.method} ${path}`,
    });
    Sentry.configureScope(scope => {
      scope.setUser({ ip_address: req.headers?.['x-real-ip'] ?? req.ips?.[0] ?? req.ip });
    });
    done();
  }

  function onResponse(req, res, done) {
    req.context._transaction?.finish();
    done();
  }

  server.addHook('onRequest', onRequest);
  server.addHook('onResponse', onResponse);

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
