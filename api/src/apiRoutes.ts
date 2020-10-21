import { FastifyInstance } from 'fastify';
import Joi from 'joi';
import Boom from '@hapi/boom';
import { admin as firebaseAdmin } from 'firebase-admin/lib/auth';
import * as Sentry from '@sentry/node';
import { addHours, isAfter, isBefore, subDays } from 'date-fns';

import { channels, Channel } from '../../frontend/channels';
import { getRecent, getNewest, getMostHeard, getPlays, getTrackRecent } from './plays';
import { getTrack } from './track';
import { search } from './search';
import { admin } from './firebaseAdmin';
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

async function isValidToken(token = ''): Promise<firebaseAdmin.auth.DecodedIdToken> {
  const jwt = token.slice(7);
  const user = await admin.auth().verifyIdToken(jwt);
  Sentry.configureScope(scope => {
    scope.setUser({ id: user.uid, email: user.email });
  });
  return user;
}

/**
 * this seems to be required for registering all the nextjs pages right now
 */
export function registerApiRoutes(server: FastifyInstance) {
  server.route<{ Querystring: { last: string }; Params: { id: string } }>({
    method: 'GET',
    url: '/api/station/:id',
    schema: {
      querystring: Joi.object({
        last: Joi.date().timestamp('javascript'),
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async ({ query, params }, reply) => {
      const channel = getChannel(params.id);

      const maxDays = 30;
      if (query.last) {
        if (isBefore(new Date(query.last), subDays(new Date(), maxDays))) {
          throw Boom.badRequest();
        }

        return getRecent(channel, new Date(query.last));
      }

      // 2 min
      reply.header('Cache-Control', 'public, max-age=120, must-revalidate');
      return getRecent(channel);
    },
  });

  server.route<{ Params: { id: string } }>({
    method: 'GET',
    url: '/api/station/:id/newest',
    schema: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async (req, reply) => {
      const channel = getChannel(req.params.id);

      // 10 min
      reply.header('Cache-Control', 'public, max-age=600, must-revalidate');
      return getNewest(channel);
    },
  });

  server.route<{ Params: { id: string }; Querystring: { subDays: string } }>({
    method: 'GET',
    url: '/api/station/:id/most-heard',
    schema: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
      querystring: Joi.object({
        subDays: Joi.number().optional().default(30).valid(7, 14, 30, 60),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async (req, reply) => {
      const channel = getChannel(req.params.id);

      // 10 min
      reply.header('Cache-Control', 'public, max-age=600, must-revalidate');
      return getMostHeard(channel, undefined, Number(req.query.subDays));
    },
  });

  server.route<{ Params: { channelId: string; trackId: string } }>({
    method: 'GET',
    url: '/api/station/:channelId/track/:trackId',
    schema: {
      params: Joi.object({
        channelId: Joi.string().required(),
        trackId: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async (req, reply) => {
      const { transaction } = reply.context as any;
      const channel = getChannel(req.params.channelId);
      const [track, plays, recent] = await Promise.all([
        getTrack(req.params.trackId, transaction),
        getPlays(req.params.trackId, channel, transaction),
        getTrackRecent(req.params.trackId, channel, transaction),
      ]);

      // 10 min
      reply.header('Cache-Control', 'public, max-age=600, must-revalidate');
      return { ...track, plays, recent };
    },
  });

  server.route<{
    Querystring: {
      trackName: string | undefined;
      artistName: string | undefined;
      station: string | undefined;
      timeAgo: number;
      startDate: number;
      endDate: number;
      currentPage: number;
    };
  }>({
    method: 'GET',
    url: '/api/search',
    schema: {
      querystring: Joi.object({
        trackName: Joi.string().min(2).max(60).optional(),
        artistName: Joi.string().min(2).max(60).optional(),
        station: Joi.string()
          .optional()
          .valid(...channels.map(n => n.deeplink)),
        timeAgo: Joi.number()
          .default(60 * 60 * 24)
          .positive()
          .optional(),
        startDate: Joi.date().max('now').raw().optional(),
        endDate: Joi.date().max('now').raw().optional(),
        currentPage: Joi.number().default(1).positive().optional(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async req => {
      try {
        await isValidToken(req.headers.authorization);
      } catch {
        throw Boom.unauthorized();
      }

      let timeAgo: number | undefined = req.query.timeAgo ? Number(req.query.timeAgo) : undefined;
      const currentPage = Number(req.query.currentPage);
      const maxDays = 60;
      if (timeAgo > 60 * 60 * 24 * maxDays) {
        throw Boom.badRequest(`Too many days ago max - ${maxDays} days`);
      }

      const startDate = req.query.startDate
        ? addHours(new Date(`${req.query.startDate} GMT`), 6)
        : undefined;
      const endDate = req.query.endDate
        ? addHours(new Date(`${req.query.endDate} GMT`), 6)
        : undefined;
      if (req.query.startDate && req.query.endDate) {
        if (
          isAfter(subDays(new Date(), maxDays), startDate) &&
          isAfter(subDays(new Date(), maxDays), endDate)
        ) {
          throw Boom.badRequest(`Out of allowed range of ${maxDays} days`);
        }

        timeAgo = undefined;
      }

      const results = await search(
        req.query.trackName,
        req.query.artistName,
        req.query.station,
        timeAgo,
        startDate,
        endDate,
        undefined,
        currentPage,
      );
      return results;
    },
  });

  server.route<{ Params: { userId: string } }>({
    method: 'GET',
    url: '/api/user/:userId',
    schema: {
      params: Joi.object({
        userId: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async req => {
      const { userId } = req.params;
      try {
        const user = await isValidToken(req.headers.authorization);
        if (userId !== user.uid) {
          throw Boom.unauthorized();
        }
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .select<{ id: string; isSubscribed: boolean }>([
          'user.id as id',
          'user.isSubscribed as isSubscribed',
        ])
        .where('user.id', '=', userId)
        .limit(1)
        .first();
      return user;
    },
  });

  server.route<{ Params: { userId: string }; Body: { isSubscribed: boolean } }>({
    method: 'POST',
    url: '/api/user/:userId',
    schema: {
      params: Joi.object({
        userId: Joi.string().required(),
      }),
      body: Joi.object({
        isSubscribed: Joi.boolean().required(),
      }),
    },
    validatorCompiler: ({ schema }: any): any => {
      return (data: any) => schema.validate(data);
    },
    handler: async req => {
      const { userId } = req.params;
      try {
        const user = await isValidToken(req.headers.authorization);
        if (userId !== user.uid) {
          throw Boom.unauthorized();
        }
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .update({
          isSubscribed: req.body.isSubscribed,
          updatedAt: db.fn.now(),
        })
        .where('user.id', '=', userId);
      return user;
    },
  });
}
