/* eslint-disable @typescript-eslint/camelcase */
import Boom from '@hapi/boom';

import { db } from './db';
import { TrackResponse } from '../frontend/responses';

export async function getTrack(id: string): Promise<TrackResponse> {
  const data = await db('track')
    .select(['*', 'track.name as name', 'track.createdAt as createdAt'])
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
    created_at: data.created_at,
  };
  return {
    spotify,
    track,
    links: data.links ?? [],
  };
}
