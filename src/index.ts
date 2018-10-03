// tslint:disable:no-require-imports

import { Server, ServerOptions } from 'hapi';

import config from '../config';
import { serverRoutes } from './routes';

const options: ServerOptions = {
  host: 'localhost',
  port: config.port,
  cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: '127.0.0.1',
      partition: 'honbot',
    },
  ],
};

const ravenPlugin: any = {
  name: 'hapi-raven',
  plugin: require('hapi-raven'),
  options: {
    dsn: config.dsn,
  },
};

const goodPlugin: any = {
  plugin: require('good'),
  options: {
    ops: {
      interval: 1000,
    },
    reporters: {
      // TODO: silence console reporter for tests
      myConsoleReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }],
        },
        {
          module: 'good-console',
        },
        'stdout',
      ],
    },
  },
};

export const server = new Server(options);

server.route(serverRoutes);

if (!module.parent) {
  const register = server.register([ravenPlugin, goodPlugin]);
  register
    .then(async () => server.start())
    .then(() => {
      console.log('Server running at:', server.info.uri);
      return server;
    })
    .catch(err => console.log(err));
}
