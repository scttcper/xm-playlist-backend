/* eslint-disable @typescript-eslint/camelcase */
import { subDays } from 'date-fns';
import * as _ from 'lodash';
import { col, fn, Op, literal } from 'sequelize';

import { Artist, Play, Spotify, Track } from '../models';
import { Channel } from '../frontend/channels';
import { db } from './db';
import { StationRecent, StationNewest } from '../frontend/responses';

export async function getLast(channel: Channel, startTime: any) {
  return Play.findOne({
    where: {
      channel: channel.number,
      startTime,
    },
    include: [{ model: Track }],
  }).then(n => (n ? n.toJSON() : undefined));
}

export async function getNewest(channel: Channel): Promise<StationNewest[]> {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newest = await db('scrobble')
    .select()
    .where('channel', channel.deeplink)
    .andWhere('track.createdAt', '>', thirtyDaysAgo)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId')
    .orderBy('track.createdAt', 'desc');

  const groupedById = _.groupBy(newest, _.property('id'));

  return Object.values(groupedById).map(dataArr => {
    const data = dataArr[0];
    const spotify: StationNewest['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationNewest['track'] = { id: data.id, name: data.name, artists: data.artists };
    return {
      spotify,
      track,
      start_time: data.startTime,
      links: data.links,
      plays: groupedById[data.id].length,
    };
  });
}

export async function getMostHeard(channel: Channel): Promise<StationNewest[]> {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newest = await db('scrobble')
    .select()
    .where('channel', channel.deeplink)
    .andWhere('scrobble.startTime', '>', thirtyDaysAgo)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId');

  const groupedById = _.groupBy(newest, _.property('id'));

  const result = Object.values(groupedById).map(dataArr => {
    const data = dataArr[0];
    const spotify: StationNewest['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationNewest['track'] = { id: data.id, name: data.name, artists: data.artists };
    return {
      spotify,
      track,
      start_time: data.startTime,
      links: data.links,
      plays: groupedById[data.id].length,
    };
  });
  return _.orderBy(result, _.property('plays'), 'desc');
}

export async function getRecent(channel: Channel, last?: Date): Promise<StationRecent[]> {
  const query = db('scrobble')
    .select()
    .where('channel', channel.deeplink)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId')
    .orderBy('scrobble.startTime', 'desc')
    .limit(24);

  if (last) {
    query.andWhere('startTime', '<', last);
  }

  const raw = await query;

  return raw.map(data => {
    const spotify: StationRecent['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationRecent['track'] = { id: data.id, name: data.name, artists: data.artists };
    return { spotify, track, start_time: data.startTime, links: data.links };
  });
}

export async function popular(channel: Channel, limit = 50) {
  const thirtyDays = subDays(new Date(), 30);
  let lastThirty: any = await Play.findAll({
    where: {
      channel: channel.number,
      startTime: { [Op.gt]: thirtyDays },
    },
    attributes: [literal('DISTINCT "trackId"') as any, 'trackId', [fn('COUNT', col('trackId')), 'count']],
    group: ['trackId'],
  }).then(t => t.map(n => n.toJSON()));
  lastThirty = lastThirty
    .filter((n: any) => n.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  const ids = lastThirty.map(n => n.trackId);
  const keyed: any = _.keyBy(lastThirty, _.identity('trackId'));
  const tracks = await Track.findAll({
    where: {
      id: { [Op.in]: ids },
    },
    include: [Artist, Spotify],
  }).then(t =>
    t.map(n => {
      const res: any = n.toJSON();
      res.count = keyed[res.id].count;
      return res;
    }),
  );
  return tracks.sort((a, b) => b.count - a.count);
}
