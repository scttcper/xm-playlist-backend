import { subSeconds, formatISO9075, addHours } from 'date-fns';

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
    startDate: string;
    endDate: string;
    currentPage: number;
  };
}

/**
 *
 * @param trackName
 * @param artistName
 * @param station
 * @param timeAgo in seconds
 * @param startDate
 * @param endDate
 * @param trackId
 * @param currentPage
 * @param limit
 */
// eslint-disable-next-line max-params
export async function search(
  trackName?: string,
  artistName?: string,
  station?: string,
  timeAgo?: number,
  startDate?: Date,
  endDate?: Date,
  trackId?: string,
  currentPage = 1,
  limit = 100,
): Promise<SearchResults> {
  const daysAgo = subSeconds(new Date(), timeAgo ?? 0);

  const trackQuery = db('track').innerJoin('scrobble', 'track.id', 'scrobble.trackId');

  if (startDate && endDate) {
    trackQuery.where('scrobble.start_time', '>', startDate);
    trackQuery.andWhere('scrobble.start_time', '<=', endDate);
  } else if (timeAgo) {
    trackQuery.where('scrobble.start_time', '>', daysAgo);
  }

  if (trackName) {
    trackQuery.andWhere('track.name', 'ILIKE', `%%${trackName}%%`);
  }

  if (artistName) {
    trackQuery.andWhere(db.raw('"track"."artists"::TEXT'), 'ILIKE', `%%${artistName}%%`);
  }

  if (station) {
    trackQuery.andWhere('scrobble.channel', '=', station);
  }

  if (trackId) {
    trackQuery.andWhere('track.id', '=', trackId);
  }

  const total = await trackQuery.clone().count('*').first<{ count: string }>();
  let offset = (currentPage - 1) * 100;
  if (offset > Number(total.count)) {
    offset = Number(total.count) - (Number(total.count) % 100);
  }

  // Don't count stations if filtered by station
  const stationsTotalPromise = station
    ? Promise.resolve({ count: '1' })
    : trackQuery.clone().countDistinct('scrobble.channel').first<{ count: string }>();

  const uniqueTracksPromise = trackQuery
    .clone()
    .countDistinct('track.id')
    .first<{ count: string }>();

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
    .whereNotNull('start_time')
    .orderByRaw(`scrobble.start_time ${startDate && endDate ? 'ASC' : 'DESC'}`)
    .offset(offset)
    .limit(limit);

  const [stationsTotal, uniqueTracksTotal, results] = await Promise.all([
    stationsTotalPromise,
    uniqueTracksPromise,
    trackQuery,
  ]);

  const totalItems = Number(total.count);
  return {
    stationsTotal: Number(stationsTotal.count),
    uniqueTracksTotal: Number(uniqueTracksTotal.count),
    totalItems,
    currentPage: offset / 100 + 1,
    pages: Math.ceil(totalItems / 100),
    results,
    query: {
      trackName,
      artistName,
      station,
      timeAgo,
      startDate: startDate ? addHours(startDate, 6).toISOString().split('T')[0] : undefined,
      endDate: endDate ? addHours(endDate, 6).toISOString().split('T')[0] : undefined,
      currentPage,
    },
  };
}
