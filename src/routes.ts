import * as Boom from 'boom';
import { subDays } from 'date-fns';
import { ServerRoute } from 'hapi';
import { assert } from 'hoek';
import * as Joi from 'joi';
import * as _ from 'lodash';
import { col, fn, Op } from 'sequelize';

import { Artist, Play, Spotify, Track } from '../models';
import { channels } from './channels';
import { getRecent, popular } from './plays';
import { playsByDay } from './tracks';


const channelRoute: ServerRoute = {
  path: '/channel/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.string(),
      },
      query: {
        last: Joi.number().optional(),
      },
    },
  },
  handler: (req) => {
    const channel = channels.find(_.matchesProperty('id', req.params.id));
    assert(!_.isUndefined(channel), Boom.notFound('Channel not Found'));
    const query = req.query as any;
    if (query.last) {
      const last = new Date(parseInt(query.last as string, 10));
      return getRecent(channel, last);
    }
    return getRecent(channel);
  },
};

const newestRoute: ServerRoute = {
  path: '/newest/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.string(),
      },
    },
  },
  handler: async (req) => {
    const channel = channels.find(_.matchesProperty('id', req.params.id));
    assert(!_.isUndefined(channel), Boom.notFound('Channel not Found'));
    const thirtyDays = subDays(new Date(), 30);
    const ids: number[] = await Play.findAll({
      where: {
        channel: channel.number,
        startTime: { [Op.gt]: thirtyDays },
      },
      attributes: [fn('DISTINCT', col('trackId')), 'trackId'],
    }).then((t) => t.map((n) => n.get('trackId')));
    return Track.findAll({
      where: {
        id: { [Op.in]: ids },
      },
      order: [['createdAt', 'desc']],
      limit: 50,
      include: [Artist, Spotify],
    }).then((t) => t.map((n) => n.toJSON()));
  },
};

const popularRoute: ServerRoute = {
  path: '/popular/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.string(),
      },
    },
  },
  handler: (req) => {
    const channel = channels.find(_.matchesProperty('id', req.params.id));
    assert(!_.isUndefined(channel), Boom.notFound('Channel not Found'));
    return popular(channel);
  },
};

const trackRoute: ServerRoute = {
  path: '/track/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.number().positive(),
      },
    },
  },
  handler: async (req) => {
    const id = Number(req.params.id);
    const res: any = await Track.findById(id, {
      include: [Artist, Spotify],
    }).then((t) => t.toJSON());
    res.playsByDay = await playsByDay(id);
    return res;
  },
};

const trackActivityRoute: ServerRoute = {
  path: '/trackActivity/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.number().positive(),
      },
    },
  },
  handler: (req) => {
    const id = Number(req.params.id);
    return playsByDay(id);
  },
};

const artistRoute: ServerRoute = {
  path: '/artist/{id}',
  method: 'GET',
  options: {
    cors: { origin: 'ignore' },
    validate: {
      params: {
        id: Joi.number().positive(),
      },
      query: {
        channel: Joi.string().optional(),
      },
    },
  },
  handler: async (req) => {
    const artistId = req.params.id;
    const channel = channels.find(_.matchesProperty('id', req.params.id));
    assert(!_.isUndefined(artistId), Boom.notFound('Artist ID required'));
    let trackIds = await Track
      .findAll({
        attributes: ['id'],
        include: [{
          model: Artist,
          where: { id: artistId },
          attributes: [],
        }],
      })
      .then((t) => t.map((n) => n.get('id')))
      .catch(() => []);
    if (channel) {
      trackIds = await Play
        .findAll({
          where: {
            trackId: { [Op.in]: trackIds },
            channel: channel.number,
          },
        })
        .then((t) => t.map((n) => n.get('trackId')))
        .catch(() => []);
    }
    const res: any = {};
    res.artist = await Artist.findById(artistId);
    res.tracks = await Track.findAll({
      where: { id: { [Op.in]: trackIds } },
      include: [Artist, Spotify],
    }).catch(() => []);
    return res;
  },
};

export const serverRoutes = [
  channelRoute,
  newestRoute,
  popularRoute,
  trackRoute,
  trackActivityRoute,
  artistRoute,
];
