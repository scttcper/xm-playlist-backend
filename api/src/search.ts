import { subDays } from 'date-fns';

import { db } from './db';

export interface SearchResult {
  id: string;
  scrobbleId: string;
  startTime: string;
  channel: string;
  name: string;
  artists: string;
  createdAt: string;
  spotifyId: string;
  previewUrl: string;
  cover: string;
}

export interface SearchResults {
  stationsTotal: number;
  uniqueTracksTotal: number;
  totalItems: number;
  currentPage: number;
  pages: number;
  results: SearchResult[];
}

export async function search(
  trackName: string,
  artistName: string,
  station: string,
): Promise<SearchResults> {
  // TODO: allow search by date range
  const daysAgo = subDays(new Date(), 1);

  const trackQuery = db('track')
    .innerJoin('scrobble', 'track.id', 'scrobble.trackId')
    .where('scrobble.startTime', '>', daysAgo);

  if (trackName) {
    trackQuery.andWhere('track.name', 'ILIKE', `%%${trackName}%%`);
  }

  if (artistName) {
    trackQuery.andWhere(db.raw('"track"."artists"::TEXT'), 'ILIKE', `%%${artistName}%%`);
  }

  if (station) {
    trackQuery.andWhere('scrobble.channel', '=', station);
  }

  const countQuery = trackQuery.clone();
  const stationQuery = trackQuery.clone();
  const uniqueTracks = trackQuery.clone();
  trackQuery
    .select<SearchResult[]>([
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
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .orderByRaw('scrobble.start_time DESC NULLS LAST');

  const [total, stationsTotal, uniqueTracksTotal, results] = await Promise.all([
    countQuery.count('*').first<{ count: string }>(),
    stationQuery.countDistinct('scrobble.channel').first<{ count: string }>(),
    uniqueTracks.countDistinct('track.id').first<{ count: string }>(),
    trackQuery.limit(100),
  ]);

  console.log({ stationsTotal });

  const totalItems = Number(total.count);
  return {
    stationsTotal: Number(stationsTotal.count),
    uniqueTracksTotal: Number(uniqueTracksTotal.count),
    totalItems,
    // TODO: allow pagination
    currentPage: 1,
    pages: Math.ceil(totalItems / 100),
    results,
  };
}
