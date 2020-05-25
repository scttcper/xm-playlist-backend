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
  totalItems: number;
  currentPage: number;
  pages: number;
  results: SearchResult[];
}

export async function search(artistName: string, station: string): Promise<SearchResults> {
  const countQuery = db('track').rightJoin('scrobble', 'track.id', 'scrobble.trackId');
  const trackQuery = db('track')
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
    .rightJoin('scrobble', 'track.id', 'scrobble.trackId')
    .leftJoin('spotify', 'scrobble.trackId', 'spotify.trackId')
    .orderBy('scrobble.startTime', 'desc');

  trackQuery.where(db.raw('"track"."artists"::TEXT'), 'ILIKE', `%%${artistName}%%`);
  countQuery.where(db.raw('"track"."artists"::TEXT'), 'ILIKE', `%%${artistName}%%`);

  if (station) {
    trackQuery.andWhere('scrobble.channel', '=', station);
    countQuery.andWhere('scrobble.channel', '=', station);
  }

  const [total, results] = await Promise.all([
    countQuery.count('*').first<{ count: number }>(),
    trackQuery.limit(100),
  ]);

  return {
    totalItems: total.count,
    // TODO: allow pagination
    currentPage: 1,
    pages: Math.ceil(total.count / 100),
    results,
  };
}
