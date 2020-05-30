import { Server as HapiServer } from '@hapi/hapi';
import laabr from 'laabr';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';

import { channels, Channel } from '../../frontend/channels';
import { getRecent, getNewest, getMostHeard, getPlays } from './plays';
import { getTrack } from './track';
import { search } from './search';
import { admin } from './firebaseAdmin';

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

async function isValidToken(token = '') {
  const jwt = token.slice(7);
  const user = await admin.auth().verifyIdToken(jwt);
  return user;
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
      cache: {
        privacy: 'public',
        // 3 min
        expiresIn: 180000,
        statuses: [200],
        otherwise: 'no-cache',
      },
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
      cache: {
        privacy: 'public',
        // 10 min
        expiresIn: 600000,
        statuses: [200],
        otherwise: 'no-cache',
      },
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
      cache: {
        privacy: 'public',
        // 10 min
        expiresIn: 600000,
        statuses: [200],
        otherwise: 'no-cache',
      },
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
      cache: {
        privacy: 'public',
        // 10 min
        expiresIn: 180000,
        statuses: [200],
        otherwise: 'no-cache',
      },
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

  server.route({
    path: '/search',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        query: Joi.object({
          trackName: Joi.string().min(2).max(30).optional(),
          artistName: Joi.string().min(2).max(30).optional(),
          station: Joi.string()
            .optional()
            .valid(...channels.map(n => n.deeplink)),
        }),
      },
    },
    handler: async req => {
      try {
        const user = await isValidToken(req.headers.authorization);
        // TODO: do something with user
      } catch {
        throw Boom.unauthorized();
      }

      return search(
        req.query.trackName as string,
        req.query.artistName as string,
        req.query.station as string | undefined,
      );
    },
  });
}
