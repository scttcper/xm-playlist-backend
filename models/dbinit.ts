import { Track, Artist, ArtistTrack, Play, Spotify } from './index';

export function setup(force = false): any {
  const opt = { force };
  return Track.sync(opt)
    .then(() => Artist.sync(opt))
    .then(() => ArtistTrack.sync(opt))
    .then(() => Play.sync(opt))
    .then(() => Spotify.sync(opt));
}

if (!module.parent) {
  setup(true);
}
