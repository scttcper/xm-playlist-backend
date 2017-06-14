import { Track, Artist, ArtistTrack, ArtistTrackInstance } from '../models';

import { encode } from '../src/util';

export function findOrCreateArtists(artists: string[]) {
  const promises: Array<Promise<ArtistTrackInstance>> = artists.map((n): any  => {
    return Artist
      .findOrCreate({ where: { name: n }})
      .spread((artist: ArtistTrackInstance, created) => {
        return artist;
      });
  });
  return Promise.all(promises);
}

export async function findOrCreateTrack(data) {
  const artists = await findOrCreateArtists(data.artists);
  const [track, created] = await Track
    .findOrCreate({
      where: {
        songId: encode(data.songId),
      },
    });
  if (!created) {
    track.increment('plays');
  } else {
    await track.update({ name: data.name });
    const at = artists.map((artist) => {
      return {
        artistId: artist.get('id'),
        trackId: track.get('id'),
      };
    });
    await ArtistTrack.bulkCreate(at, { returning: false });
  }
}

// TODO
// export async function artists() {
//   const db = await mongo;
//   return db.collection('tracks')
//     .distinct('artists');
// }
