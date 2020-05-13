import Boom from '@hapi/boom';

import { db } from './db';
import { TrackResponse } from 'frontend/responses';

export async function getTrack(id: string): Promise<TrackResponse> {
  const data = await db('track')
    .select([
      'track.id as id',
      'track.name as name',
      'track.artists as artists',
      'track.createdAt as createdAt',
      'spotify.spotifyId as spotifyId',
      'spotify.previewUrl as previewUrl',
      'spotify.cover as cover',
      'links.links as links',
    ])
    .where('id', id)
    .leftJoin('spotify', 'track.id', 'spotify.trackId')
    .leftJoin('links', 'track.id', 'links.trackId')
    .first();

  if (!data) {
    throw Boom.notFound('Track not found');
  }

  const spotify: TrackResponse['spotify'] = {
    spotify_id: data.spotifyId,
    preview_url: data.previewUrl,
    cover: data.cover,
  };
  const track: TrackResponse['track'] = {
    id: data.id,
    name: data.name,
    artists: data.artists,
    created_at: data.createdAt,
  };
  return {
    spotify,
    track,
    links: data.links ?? [],
  };
}
