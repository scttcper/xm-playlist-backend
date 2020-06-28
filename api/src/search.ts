import { subSeconds } from 'date-fns';

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
  query: {
    trackName: string;
    artistName: string;
    station: string;
    timeAgo: number;
    currentPage: number;
  };
}

export async function search(
  trackName: string,
  artistName: string,
  station: string,
  timeAgo: number,
  currentPage: number,
): Promise<SearchResults> {
  const daysAgo = subSeconds(new Date(), timeAgo);

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

  const total = await trackQuery.clone().count('*').first<{ count: string }>();
  let offset = (currentPage - 1) * 100;
  if (offset > Number(total.count)) {
    offset = Number(total.count) - (Number(total.count) % 100);
  }
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
    .orderByRaw('scrobble.start_time DESC NULLS LAST')
    .offset(offset);

  const [stationsTotal, uniqueTracksTotal, results] = await Promise.all([
    stationQuery.countDistinct('scrobble.channel').first<{ count: string }>(),
    uniqueTracks.countDistinct('track.id').first<{ count: string }>(),
    trackQuery.limit(100),
  ]);

  const totalItems = Number(total.count);
  return {
    stationsTotal: Number(stationsTotal.count),
    uniqueTracksTotal: Number(uniqueTracksTotal.count),
    totalItems,
    currentPage: (offset / 100) + 1,
    pages: Math.ceil(totalItems / 100),
    results,
    query: {
      trackName,
      artistName,
      station,
      timeAgo,
      currentPage,
    },
  };
}
