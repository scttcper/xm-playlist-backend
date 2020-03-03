import { Server as HapiServer } from '@hapi/hapi';
import laabr from 'laabr';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';

import { channels, Channel } from '../frontend/channels';
import { getRecent, getNewest, getMostHeard, getPlays } from './plays';
import { getTrack } from './track';

function getChannel(id: string): Channel {
  const lowercaseId = id.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );
  if (!channel) {
    throw Boom.notFound('Channel not Found');
  }

  return channel;
}

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
          id: Joi.string().required(),
        }),
        query: Joi.object({
          last: Joi.date().timestamp('javascript'),
        }),
      },
    },
    handler: async req => {
      const channel = getChannel(req.params.id);

      const { query } = req;
      if (query.last) {
        return getRecent(channel, new Date(query.last as string));
      }

      return getRecent(channel);
    },
  });

  server.route({
    path: '/api/station/{id}/newest',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const channel = getChannel(req.params.id);
      return getNewest(channel);
    },
  });

  server.route({
    path: '/api/station/{id}/most-heard',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const channel = getChannel(req.params.id);
      return getMostHeard(channel);
    },
  });

  server.route({
    path: '/api/station/{channelId}/track/{trackId}',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          channelId: Joi.string().required(),
          trackId: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const channel = getChannel(req.params.channelId);
      const track = await getTrack(req.params.trackId);
      const plays = await getPlays(req.params.trackId, channel);
      return { ...track, plays };
    },
  });
}
