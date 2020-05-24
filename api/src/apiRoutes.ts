import { Server as HapiServer } from '@hapi/hapi';
import laabr from 'laabr';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';

import { channels, Channel } from '../../frontend/channels';
import { getRecent, getNewest, getMostHeard, getPlays } from './plays';
import { getTrack } from './track';
import { db } from './db';

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
          artistName: Joi.string().optional(),
        }),
      },
    },
    handler: async req => {
      const trackQuery = db('track')
        .select([
          'track.id as id',
          'scrobble.id as scrobbleId',
          'scrobble.startTime as startTime',
          'scrobble.channel as channel',
          'track.name as name',
          'track.artists as artists',
          'track.createdAt as createdAt',
          'spotify.spotifyId as spotifyId',
          'spotify.previewUrl as previewUrl',
          'spotify.cover as cover',
        ])
        .rightJoin('scrobble', 'track.id', 'scrobble.trackId')
        .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
        .orderBy('scrobble.startTime', 'desc')
        .limit(100);

      if (req.query.artistName) {
        console.log(req.query.artistName);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        trackQuery.where(
          db.raw('"track"."artists"::TEXT'),
          'ILIKE',
          `%%${req.query.artistName as string}%%`,
        );
      }

      const tracks = await trackQuery;
      return tracks;
    },
  });
}
