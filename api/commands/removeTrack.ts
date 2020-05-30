import { argv } from 'yargs';

import { db } from '../src/db';

const trackName = argv.track as string;
const artistName = argv.artist as string;

console.log({ trackName, artistName });

async function removeTrack(): Promise<void> {
  const tracksQuery = db('track').select<Array<{ id: string }>>(['track.id as id']);

  if (trackName) {
    tracksQuery.where('track.name', 'ilike', trackName);
  }

  if (artistName) {
    tracksQuery.where(db.raw('"track"."artists"::TEXT'), 'ilike', `%${artistName}%`);
  }

  const tracks = await tracksQuery;
  console.log(tracks);

  if (!tracks) {
    throw new Error('Track not found');
  }

  console.log(
    'scrobbles',
    await db('scrobble')
      .count()
      .whereIn(
        'scrobble.trackId',
        tracks.map(t => t.id),
      ),
  );

  await Promise.all([
    db('scrobble')
      .delete()
      .whereIn(
        'scrobble.trackId',
        tracks.map(t => t.id),
      ),
    db('spotify')
      .delete()
      .whereIn(
        'trackId',
        tracks.map(t => t.id),
      ),
    db('links')
      .delete()
      .whereIn(
        'trackId',
        tracks.map(t => t.id),
      ),
  ]);

  await db('track')
    .delete()
    .whereIn(
      'id',
      tracks.map(t => t.id),
    );
}

removeTrack()
  .then(async () => {
    console.log('success');
    await db.destroy();
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
