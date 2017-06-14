import { Track, Artist, ArtistTrack, Play, Spotify } from './index';

export function setup(force = true): any {
  return Track.sync({ force })
    .then(() => Artist.sync({ force }))
    .then(() => ArtistTrack.sync({ force }))
    .then(() => Play.sync({ force }))
    .then(() => Spotify.sync({ force }));
}

if (!module.parent) {
  setup();
}
