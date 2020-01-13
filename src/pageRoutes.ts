import Server from 'next/dist/next-server/server/next-server';
import { Server as HapiServer } from '@hapi/hapi';

import { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } from './next-wrapper';

/**
 * this seems to be required for registering all the nextjs pages right now
 */
export function registerPages(server: HapiServer, app: Server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: pathWrapper(app, '/'),
  });

  server.route({
    method: 'GET',
    path: '/station/{id}/track/{trackid}',
    handler: pathWrapper(app, '/station/[id]/track/[trackid]'),
  });

  server.route({
    method: 'GET',
    path: '/station/{id}',
    handler: pathWrapper(app, '/station/[id]'),
  });
}

export function registerNextjs(server: HapiServer, app: Server) {
  server.route({
    method: 'GET',
    path: '/_next/{p*}' /* next specific routes */,
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: 'GET',
    path: '/static/{p*}' /* use next to handle static files */,
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: 'GET',
    path: '/ads.txt',
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: '*',
    path: '/{p*}' /* catch all route */,
    handler: defaultHandlerWrapper(app),
  });
}
