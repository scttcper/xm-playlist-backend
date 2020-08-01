import { subDays, differenceInDays } from 'date-fns';
import _ from 'lodash';

import { Channel } from '../../frontend/channels';
import { db } from './db';
import { StationRecent, StationNewest, StationMostHeard, TrackPlay, TrackRecent } from 'frontend/responses';

export async function getNewest(channel: Channel, limit = 50): Promise<StationNewest[]> {
  const daysAgo = subDays(new Date(), 30);
  const newest = await db('scrobble')
    .select([
      'track.id as trackId',
      'track.name as name',
      'track.artists as artists',
      'track.createdAt as createdAt',
      'spotify.spotifyId as spotifyId',
      'spotify.previewUrl as previewUrl',
      'spotify.cover as cover',
      'links.links as links',
      'scrobble.id as id',
      'scrobble.startTime as startTime',
    ])
    .distinctOn('trackId', 'createdAt')
    .where('channel', channel.deeplink)
    .andWhere('track.createdAt', '>', daysAgo)
    .andWhere('scrobble.startTime', '>', daysAgo)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId')
    .orderBy('track.createdAt', 'desc')
    .limit(limit);

  return newest.map(data => {
    const spotify: StationNewest['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationNewest['track'] = {
      id: data.trackId,
      name: data.name,
      artists: data.artists,
      created_at: data.createdAt,
    };
    return {
      id: data.id,
      spotify,
      track,
      start_time: data.startTime,
      links: data.links ?? [],
    };
  });
}

export async function getMostHeard(
  channel: Channel,
  limit = 50,
  days = 30,
  greaterThan = 2,
): Promise<StationMostHeard[]> {
  const daysAgo = subDays(new Date(), days);
  const mostHeard = await db('scrobble')
    .select('scrobble.track_id')
    .count('scrobble.track_id')
    .where('channel', channel.deeplink)
    .andWhere('scrobble.startTime', '>', daysAgo)
    .groupBy('scrobble.track_id')
    .havingRaw(db.raw(`count(scrobble.track_id) > ${greaterThan}`))
    .orderBy('count', 'desc')
    .limit(limit) as Array<{ trackId: string; count: string }>;
  const mostHeardById = _.keyBy(mostHeard, _.property('trackId'));
  const trackIds = Object.keys(mostHeardById);
  const newest = await db('track')
    .select([
      'track.name as name',
      'track.artists as artists',
      'track.createdAt as createdAt',
      'spotify.spotifyId as spotifyId',
      'spotify.previewUrl as previewUrl',
      'spotify.cover as cover',
      'links.links as links',
      'track.id as trackId',
    ])
    .whereIn('track.id', trackIds)
    .leftJoin('spotify', 'track.id', 'spotify.trackId')
    .leftJoin('links', 'track.id', 'links.trackId');

  const result = newest.map(data => {
    const spotify: StationMostHeard['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationMostHeard['track'] = {
      id: data.trackId,
      name: data.name,
      artists: data.artists,
      created_at: data.createdAt,
    };
    return {
      id: data.id,
      spotify,
      track,
      start_time: data.startTime,
      links: data.links ?? [],
      plays: Number(mostHeardById[data.trackId].count),
    };
  });
  return _.orderBy(result, _.property('plays'), 'desc');
}

export async function getRecent(channel: Channel, last?: Date): Promise<StationRecent[]> {
  const query = db('scrobble')
    .select([
      'track.name as name',
      'track.artists as artists',
      'track.createdAt as createdAt',
      'spotify.spotifyId as spotifyId',
      'spotify.previewUrl as previewUrl',
      'spotify.cover as cover',
      'links.links as links',
      'track.id as trackId',
      'scrobble.id as id',
      'scrobble.startTime as startTime',
    ])
    .where('channel', channel.deeplink)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId')
    .orderBy('scrobble.startTime', 'desc')
    .limit(24);

  if (last) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    query.andWhere('startTime', '<', last);
  }

  const raw = await query;

  return raw.map(data => {
    const spotify: StationRecent['spotify'] = {
      spotify_id: data.spotifyId,
      preview_url: data.previewUrl,
      cover: data.cover,
    };
    const track: StationRecent['track'] = {
      id: data.trackId,
      name: data.name,
      artists: data.artists,
      created_at: data.createdAt,
    };
    return { id: data.id, spotify, track, start_time: data.startTime, links: data.links };
  });
}

export async function getPlays(trackId: string, channel: Channel): Promise<TrackPlay[]> {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const raw = await db('scrobble')
    .select(db.raw("date_trunc('day', start_time) as day"))
    .count<{ day: string; count: string }[]>()
    .from('scrobble')
    .where('trackId', trackId)
    .andWhere('channel', channel.deeplink)
    .andWhere('startTime', '>', thirtyDaysAgo)
    .groupBy('day');

  const result: Record<string, TrackPlay> = {};
  _.range(30, -1, -1).forEach(daysAgo => {
    result[daysAgo.toString()] = {
      x: daysAgo > 0 ? `${daysAgo} days ago` : 'today',
      y: 0,
    };
  });

  raw.forEach(n => {
    const daysAgo = differenceInDays(new Date(), new Date(n.day)).toString();
    result[daysAgo].y = parseInt(n.count, 10);
  });

  return Object.values(result).reverse();
}

export async function getTrackRecent(trackId: string, channel: Channel): Promise<string[]> {
  const raw = await db('scrobble')
    .select('startTime')
    .from('scrobble')
    .where('trackId', trackId)
    .andWhere('channel', channel.deeplink)
    .orderBy('scrobble.startTime', 'desc')
    .limit(10);

  return raw.map(n => n.startTime);
}
