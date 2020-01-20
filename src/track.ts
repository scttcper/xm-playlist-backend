/* eslint-disable @typescript-eslint/camelcase */
import { db } from './db';
import { TrackResponse } from '../frontend/responses';

export async function getTrack(id: string): Promise<TrackResponse> {
  const data = await db('track')
    .where('id', id)
    .leftJoin('spotify', 'track.id', 'spotify.trackId')
    .leftJoin('links', 'track.id', 'links.trackId')
    .first();

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
