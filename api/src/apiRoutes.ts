import { Server as HapiServer } from '@hapi/hapi';
import laabr from 'laabr';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { admin as firebaseAdmin } from 'firebase-admin/lib/auth';
import Stripe from 'stripe';

import { channels, Channel } from '../../frontend/channels';
import config from '../config';
import { getRecent, getNewest, getMostHeard, getPlays } from './plays';
import { getTrack } from './track';
import { search } from './search';
import { admin } from './firebaseAdmin';
import { db } from './db';

const stripe = new Stripe(
  config.stripeSecret,
  { apiVersion: '2020-03-02' },
);
const redirectUrl =
  process.env.NODE_ENV === 'production' ? 'https://xmplaylist.com' : 'http://dev.com';

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
        query: Joi.object({
          subDays: Joi.number().optional().default(30).valid(7, 14, 30),
        }),
      },
    },
    handler: async req => {
      const channel = getChannel(req.params.id);
      return getMostHeard(channel, undefined, Number(req.query.subDays));
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
      const [track, plays] = await Promise.all([
        getTrack(req.params.trackId),
        getPlays(req.params.trackId, channel),
      ]);
      return { ...track, plays };
    },
  });

  server.route({
    path: '/api/search',
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
          timeAgo: Joi.number().positive().optional(),
          currentPage: Joi.number().default(1).positive().optional(),
        }),
      },
    },
    handler: async req => {
      let identity: firebaseAdmin.auth.DecodedIdToken;
      try {
        identity = await isValidToken(req.headers.authorization);
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .select<{ id: string; isPro: boolean }>([
          'user.id as id',
          'user.isPro as isPro',
        ])
        .where('user.id', '=', identity.uid)
        .limit(1)
        .first();

      const queryTimeAgo = Number(req.query.timeAgo as string);
      let timeAgo = queryTimeAgo;
      let currentPage = Number(req.query.currentPage as string);
      if (user.isPro) {
        if (queryTimeAgo > 60 * 60 * 24 * 90) {
          throw Boom.badRequest();
        }
      } else {
        if (queryTimeAgo > 60 * 60 * 24 || currentPage !== 1) {
          throw Boom.badRequest();
        }
      }

      return search(
        req.query.trackName as string,
        req.query.artistName as string,
        req.query.station as string | undefined,
        timeAgo,
        currentPage,
      );
    },
  });

  server.route({
    path: '/api/user/{userId}',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          userId: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const { userId } = req.params;
      try {
        const user = await isValidToken(req.headers.authorization);
        console.log(userId, user.uid);
        if (userId !== user.uid) {
          throw Boom.unauthorized();
        }
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .select<{ id: string; isSubscribed: boolean; isPro: boolean }>([
          'user.id as id',
          'user.isSubscribed as isSubscribed',
          'user.isPro as isPro',
        ])
        .where('user.id', '=', userId)
        .limit(1)
        .first();
      return user;
    },
  });

  server.route({
    path: '/api/user/{userId}',
    method: 'POST',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          userId: Joi.string().required(),
        }),
        payload: Joi.object({
          isSubscribed: Joi.boolean().required(),
        }),
      },
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
          isSubscribed: (req.payload as any).isSubscribed,
          updatedAt: db.fn.now(),
        })
        .where('user.id', '=', userId);
      return user;
    },
  });

  server.route({
    path: '/api/getpro/{userId}',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          userId: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const { userId } = req.params;
      try {
        const user = await isValidToken(req.headers.authorization);
        console.log(userId, user.uid);
        if (userId !== user.uid) {
          throw Boom.unauthorized();
        }
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .select<{ id: string; isPro: boolean; email: string; stripeCustomerId: string; }>([
          'user.id as id',
          'user.email as email',
          'user.isPro as isPro',
          'user.stripeCustomerId as stripeCustomerId',
        ])
        .where('user.id', '=', userId)
        .limit(1)
        .first();

      if (!user) {
        throw Boom.unauthorized();
      }

      let customer: Stripe.Customer;
      if (!user.stripeCustomerId) {
        customer = await stripe.customers.create({
          email: user.email || '',
          description: 'Created for /getpro',
          metadata: {
            id: user.id,
          },
        });
        await db('user')
          .update({
            stripeCustomerId: customer.id,
            updatedAt: db.fn.now(),
          })
          .where('user.id', '=', userId);
      }

      const session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId || customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            // Pro product live
            price: 'price_1GysXCLqOb5vGLHDGKpr2Gbd',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${redirectUrl}/profile?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${redirectUrl}/pricing`,
      });
      return { session };
    },
  });

  server.route({
    path: '/api/manage/{userId}',
    method: 'GET',
    options: {
      cors: { origin: 'ignore' },
      validate: {
        params: Joi.object({
          userId: Joi.string().required(),
        }),
      },
    },
    handler: async req => {
      const { userId } = req.params;
      try {
        const user = await isValidToken(req.headers.authorization);
        console.log(userId, user.uid);
        if (userId !== user.uid) {
          throw Boom.unauthorized();
        }
      } catch {
        throw Boom.unauthorized();
      }

      const user = await db('user')
        .select<{ id: string; email: string; stripeCustomerId: string; }>([
          'user.id as id',
          'user.email as email',
          'user.stripeCustomerId as stripeCustomerId',
        ])
        .where('user.id', '=', userId)
        .limit(1)
        .first();

      if (!user) {
        throw Boom.unauthorized();
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${redirectUrl}/profile`,
      });
      return { session };
    },
  });
}
