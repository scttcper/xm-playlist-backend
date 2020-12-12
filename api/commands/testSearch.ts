import { argv } from 'yargs';
import got from 'got';

import { db } from '../src/db';
import { getTrack } from '../src/track';
import { Spotify } from '../src/models';
import { getToken, parseSpotify, matchSpotify } from '../src/spotify';
import { findAndCacheLinks } from '../src/linkfinder';

const trackId = argv.track as string;

async function trackSearch(): Promise<void> {
  const track = await getTrack(trackId);
  if (!track) {
    throw new Error('Track not found');
  }

  const result = matchSpotify(track);
}

trackSearch()
  .then(async () => {
    console.log('success');
    await db.destroy();
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
