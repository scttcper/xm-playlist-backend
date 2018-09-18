import delay from 'delay';

import { Artist, ArtistTrack, Play, Spotify, Track } from './index';

export function setup(force = false): any {
  const opt = { force };
  return Track.sync(opt)
    .then(() => Artist.sync(opt))
    .then(() => ArtistTrack.sync(opt))
    .then(() => Play.sync(opt))
    .then(() => Spotify.sync(opt))
    .then(() => delay(2000));
}

if (!module.parent) {
  setup().then(() => process.exit());
}
