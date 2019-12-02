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
          id: Joi.string(),
        }),
        query: Joi.object({
          last: Joi.number().optional(),
        }),
      },
    },
    handler: async req => {
      const channel = channels.find(_.matchesProperty('id', req.params.id));
      if (!channel) {
        throw Boom.notFound('Channel not Found');
      }

      const { query } = req;
      if (query.last) {
        const last = new Date(parseInt(query.last as string, 10));
        return getRecent(channel, last);
      }

      console.log('clown', await getRecent(channel));
      return getRecent(channel);
    },
  });
}
