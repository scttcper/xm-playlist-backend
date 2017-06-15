import * as request from 'request-promise-native';
import * as _ from 'lodash';

import { Track, Spotify, Artist, TrackInstance } from '../models';
import { findOrCreateTrack } from './tracks';
import { encode } from '../src/util';
import config from '../config';

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

export async function getToken() {
  const options: request.Options = {
    uri: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(config.spotifyClientId + ':' + config.spotifyClientSecret).toString('base64')),
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true,
    gzip: true,
  };
  const res = await request.post(options).catch(e => console.error(e));
  console.log(res)
}

export async function searchTrack(artists: string[], name: string) {
  const a = artists.join('+');
  let t = name.replace(/[ ](mix)/i, '');
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

export async function spotifyFindAndCache(id: number) {
  const doc = await Spotify.findOne({ where: { trackId: id } });
  if (doc) {
    return doc;
  }
  const trackInstance = await Track.findById(id, { include: [{ model: Artist }] });
  const track = trackInstance.toJSON();
  let search;
  try {
    search = await searchTrack(track.artists.map((n) => n.name), track.name);
  } catch (e) {
    return Promise.reject(e);
  }
  console.log(search)
  // search.songId = songId;
  // const db = await mongo;
  // db.collection('spotify').insertOne(search).catch();
  // return search;
}

// spotifyFindAndCache(11);
getToken();
