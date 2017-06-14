import * as request from 'request-promise-native';
import * as _ from 'lodash';

import { Track, Spotify } from '../models';
import { findOrCreateTrack } from './tracks';
import { encode } from '../src/util';

export function parseSpotify(obj: any) {
  const cover = _.first<any>(obj.album.images) || {};
  return {
    cover: cover.url,
    spotifyId: obj.id,
    name: obj.name,
    duration_ms: obj.duration_ms,
    url: obj.external_urls.spotify,
  };
}

export async function searchTrack(stream) {
  const a = stream.artists.join('+');
  let t = stream.name.replace(/[ ](mix)/i, '');
  const url = `https://api.spotify.com/v1/search?q=artist:${a}+track:${t}+&limit=1&type=track`;
  const res = await request.get(url, { json: true, simple: true, gzip: true });
  if (res.tracks.items.length > 0) {
    return parseSpotify(_.first(res.tracks.items));
  }
  t = t.split('-')[0];
  const url2 = `https://api.spotify.com/v1/search?q=track:${t}+&limit=1&type=track`;
  const res2 = await request.get(url2, { json: true, simple: true, gzip: true });
  if (res2.tracks.items.length > 0) {
    return parseSpotify(_.first(res2.tracks.items));
  }
  return Promise.reject('failed');
}

export async function get(songId) {
  const db = await mongo;
  return db.collection('spotify')
    .findOne({ songId })
    .catch(() => {
      return Promise.resolve(false);
    });
}

export async function findAndCache(songId) {
  const doc = await get(songId);
  if (doc) {
    return doc;
  }
  const track = await Track.findOne({ where: { songId: encode(songId) } });
  let search;
  try {
    search = await searchTrack(track);
  } catch (e) {
    return Promise.reject(e);
  }
  search.songId = songId;
  const db = await mongo;
  db.collection('spotify').insertOne(search).catch();
  return search;
}
