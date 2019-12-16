import { Server as HapiServer } from '@hapi/hapi';
import laabr from 'laabr';
import Joi from '@hapi/joi';
import _ from 'lodash';
import Boom from '@hapi/boom';

import { channels } from './channels';
import { getRecent, popular } from './plays';

/**
 * this seems to be required for registering all the nextjs pages right now
 */
export async function registerApiRoutes(server: HapiServer) {
  await server.register({
    plugin: laabr,
    options: {
      // formats: { onPostStart: 'log.tiny' },
    },
  });

  server.route({
    path: '/api/station/{id}',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          id: Joi.string().valid(...channels.map(x => x.id)).required(),
        }),
        query: Joi.object({
          last: Joi.date().timestamp('javascript'),
        }),
      },
    },
    handler: async req => {
      const channel = channels.find(_.matchesProperty('id', req.params.id));
      if (!channel) {
        throw Boom.notFound('Channel not Found');
      }

      const { query } = req;
      console.log(query);
      if (query.last) {
        return getRecent(channel, new Date(query.last as string));
      }

      console.log('clown', await getRecent(channel));
      return getRecent(channel);
    },
  });
}
