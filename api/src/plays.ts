import { subDays, differenceInDays } from 'date-fns';
import _ from 'lodash';

import { Channel } from '../../frontend/channels';
import { db } from './db';
import { StationRecent, StationNewest, TrackPlay } from 'frontend/responses';
import { ScrobbleModel } from './models';

export async function getNewest(channel: Channel, limit = 50): Promise<StationNewest[]> {
  const daysAgo = subDays(new Date(), 20);
  const newest = await db('scrobble')
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
    .andWhere('track.createdAt', '>', daysAgo)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId')
    .orderBy('track.createdAt', 'desc');

  const groupedById = _.groupBy(newest, _.property('trackId'));

  return Object.values(groupedById).map(dataArr => {
    const data = dataArr[0];
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
      plays: groupedById[data.trackId].length,
    };
  }).slice(0, limit);
}

export async function getMostHeard(channel: Channel, limit = 50): Promise<StationNewest[]> {
  const daysAgo = subDays(new Date(), 20);
  const newest = await db('scrobble')
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
    .andWhere('scrobble.startTime', '>', daysAgo)
    .leftJoin('track', 'scrobble.trackId', 'track.id')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .leftJoin('links', 'scrobble.trackId', 'links.trackId');

  const groupedById = _.groupBy(newest, _.property('trackId'));

  const result = Object.values(groupedById).map(dataArr => {
    const data = dataArr[0];
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
      plays: groupedById[data.trackId].length,
    };
  });
  return _.orderBy(result, _.property('plays'), 'desc').slice(0, limit);
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
  const raw = await db<ScrobbleModel>('scrobble')
    .select()
    .from('scrobble')
    .where('trackId', trackId)
    .andWhere('channel', channel.deeplink)
    .andWhere('startTime', '>', thirtyDaysAgo);

  const result: Record<string, TrackPlay> = {};
  _.range(0, 30).forEach(x => {
    result[x.toString()] = {
      x: differenceInDays(new Date(), subDays(new Date(), x)).toString() + ' days ago',
      y: 0,
    };
  });
  for (const data of raw) {
    const daysAgo = differenceInDays(new Date(), data.startTime).toString();
    result[daysAgo].y += 1;
  }

  return Object.values(result).reverse();
}
