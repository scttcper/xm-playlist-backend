import { argv } from 'yargs';
import got from 'got';

import { db } from '../src/db';
import { getTrack } from '../src/track';
import { Spotify } from '../src/models';
import { getToken, parseSpotify } from '../src/spotify';
import { findAndCacheLinks } from '../src/linkfinder';

/**
 * NODE_ENV=localprod ts-node api/commands/lockTrack.ts --track NDCA-000146182-001 --spotify 3U2EoofSSuc4ujb7smTqca --update
 */

const trackId = argv.track as string;
let spotifyId = argv.spotify as string;
if (spotifyId.includes('open.spotify.com')) {
  spotifyId = spotifyId.split('/track/')[1];
}

console.log({ spotifyId });

const update = argv.update || false;

async function lockTrack(): Promise<void> {
  const track = await getTrack(trackId);
  if (!track) {
    throw new Error('Track not found');
  }

  const url = `https://api.spotify.com/v1/tracks/${spotifyId}`;
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await got.get(url, { headers }).json<any>();
  const s = parseSpotify(res);
  console.log(s);

  if (update) {
    await db<Spotify>('spotify')
      .update({
        cover: s.cover,
        spotifyId: s.spotifyId,
        name: s.spotifyName,
        previewUrl: s.previewUrl,
        updatedAt: db.fn.now() as any,
        lock: true,
      })
      .where('trackId', trackId);
  } else {
    await db<Spotify>('spotify').insert({
      trackId,
      cover: s.cover,
      spotifyId: s.spotifyId,
      name: s.spotifyName,
      previewUrl: s.previewUrl,
      lock: true,
    });
  }

  const spotify = await db<Spotify>('spotify').select().where('trackId', trackId).first();

  // remove incorrect links
  await db('links').delete().where({ trackId: spotify.trackId }).limit(1);

  try {
    await findAndCacheLinks(spotify);
  } catch (err) {
    throw new Error('Find and cache links error');
  }
}

lockTrack()
  .then(async () => {
    console.log('success');
    await db.destroy();
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
