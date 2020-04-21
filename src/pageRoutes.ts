import Server from 'next/dist/next-server/server/next-server';
import { Server as HapiServer, RouteOptions } from '@hapi/hapi';

import { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } from './next-wrapper';

const cacheOptions: RouteOptions = {
  cache: {
    privacy: 'public',
    // 3 min
    expiresIn: 1000 * 60 * 3,
    statuses: [200],
    otherwise: 'no-cache',
  },
};

/**
 * this seems to be required for registering all the nextjs pages right now
 */
export function registerPages(server: HapiServer, app: Server) {
  server.route({
    method: 'GET',
    options: {
      cache: {
        privacy: 'public',
        // 30 min
        expiresIn: 1000 * 60 * 30,
        statuses: [200],
        otherwise: 'no-cache',
      },
    },
    path: '/',
    handler: pathWrapper(app, '/'),
  });

  server.route({
    method: 'GET',
    options: cacheOptions,
    path: '/station/{id}/track/{trackid}',
    handler: pathWrapper(app, '/station/[id]/track/[trackid]'),
  });

  server.route({
    method: 'GET',
    options: cacheOptions,
    path: '/station/{id}/most-heard',
    handler: pathWrapper(app, '/station/[id]/most-heard'),
  });

  server.route({
    method: 'GET',
    options: cacheOptions,
    path: '/station/{id}/newest',
    handler: pathWrapper(app, '/station/[id]/newest'),
  });

  server.route({
    method: 'GET',
    options: cacheOptions,
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
    method: 'GET',
    path: '/robots.txt',
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: '*',
    path: '/{p*}' /* catch all route */,
    handler: defaultHandlerWrapper(app),
  });
}
