import * as _ from 'lodash';
import * as request from 'request-promise-native';

import config from '../config';
import { Spotify, TrackAttributes } from '../models';
import { channels } from './channels';
import { popular } from './plays';
import { client, getCache } from './redis';
import * as Util from './util';
import { search } from './youtube';

const blacklist = [
  'karaoke',
  'tribute',
  'demonstration',
  'performance',
  'instrumental',
  'famous',
  'originally',
  'arrangement',
  'cover',
  'style',
  'acoustic',
];

export interface SpotifyParsed {
  cover: string;
  spotifyId: string;
  spotifyName: string;
  durationMs: number;
  url: string;
}
export function parseSpotify(obj: any): SpotifyParsed {
  const cover = _.first<any>(obj.album.images) || {};
  return {
    cover: cover.url,
    spotifyId: obj.id,
    spotifyName: obj.name,
    durationMs: obj.duration_ms,
    url: obj.external_urls.spotify,
  };
}

export function optionalBlacklist(track: string, artists: string) {
  const all = track.toLowerCase() + artists.toLowerCase();
  return blacklist.map((b) => {
    if (!all.includes(b)) {
      return ` NOT ${b}`;
    }
    return '';
  }).join('');
}

export async function getToken(): Promise<string> {
  const cache = await getCache('spotifytoken:cache');
  if (cache) {
    return cache;
  }
  const auth = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64');
  const options: request.Options = {
    uri: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${auth}` },
    form: { grant_type: 'client_credentials' },
    json: true,
    gzip: true,
  };
  const res = await request.post(options);
  client.setex('spotifytoken:cache', res.expires_in - 100, res.access_token);
  return res.access_token;
}

export async function searchTrack(artists: string[], name: string): Promise<SpotifyParsed> {
  const cleanArtists = Util.cleanupExtra(Util.cleanCutoff(artists.join(' ')));
  const cleanTrack = Util.cleanupExtra(
    Util.cleanRemix(
      Util.cleanFt(
        Util.cleanClean(
          Util.cleanCutoff(
            Util.cleanYear(name),
          ),
        ),
      ),
    ),
  );
  // Console.log('CLEAN: ', cleanTrack, cleanArtists);
  const token = await getToken();
  const options: request.Options = {
    uri: `https://api.spotify.com/v1/search`,
    qs: {
      q: `${cleanTrack} ${cleanArtists} ${optionalBlacklist(cleanTrack, cleanArtists)}`,
      type: 'track',
      limit: 1,
    },
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    gzip: true,
  };
  // Console.log('ORIGINAL:', options.qs.q);
  const res = await request.get(options);
  if (res.tracks.items.length > 0) {
    return parseSpotify(_.first(res.tracks.items));
  }
  const youtube = await search(`${cleanTrack} ${cleanArtists}`);
  if (!youtube) {
    // Console.log('youtube failed');
    return Promise.reject('Youtube failed');
  }
  options.qs.q = Util.cleanupExtra(
    Util.cleanRemix(
      Util.cleanFt(
        Util.cleanMusicVideo(youtube),
      ),
    ),
  ) + optionalBlacklist(youtube, youtube);
  // Console.log('GOOGLE:', options.qs.q);
  const res2 = await request.get(options);
  if (res2.tracks.items.length > 0) {
    return parseSpotify(_.first(res2.tracks.items));
  }
  return Promise.reject('Everything Failed');
}

export async function matchSpotify(track: TrackAttributes, update = false): Promise<any> {
  let s;
  try {
    s = await searchTrack(track.artists.map((n) => n.name), track.name);
  } catch (e) {
    return Promise.reject(e);
  }
  if (!s || !s.spotifyName) {
    return Promise.reject('Failed');
  }
  if (update) {
    return Spotify.findOne({ where: { trackId: track.id } }).then((doc) => doc.update({
      trackId: track.id,
      cover: s.cover,
      durationMs: s.durationMs,
      spotifyId: s.spotifyId,
      spotifyName: s.spotifyName,
      url: s.url,
    }));
  }
  return Spotify.create({
    trackId: track.id,
    cover: s.cover,
    durationMs: s.durationMs,
    spotifyId: s.spotifyId,
    spotifyName: s.spotifyName,
    url: s.url,
  });
}

export async function spotifyFindAndCache(track: TrackAttributes): Promise<any> {
  const doc = await Spotify.findOne({ where: { trackId: track.id } });
  if (doc) {
    return doc;
  }
  return matchSpotify(track);
}

export async function getUserToken(code: string): Promise<string> {
  const cache = await getCache('spotifyusertoken:cache');
  if (cache) {
    return cache;
  }
  const auth = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64');
  const options: request.Options = {
    uri: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${auth}` },
    form: {
      redirect_uri: `https://example.com/`,
      grant_type: 'authorization_code',
      code,
      state: 'xmplaylist',
    },
    json: true,
    gzip: true,
  };
  const res = await request.post(options);
  client.setex('spotifyusertoken:cache', res.expires_in - 100, res.access_token);
  return res.access_token;
}

export async function addToPlaylist(code: string, playlistId: string, trackIds: string[]) {
  const token = await getUserToken(code);
  const options: request.Options = {
    uri: `https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`,
    body: {
      uris: [],
    },
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    gzip: true,
  };
  const chunks = _.chunk(trackIds, 100);
  for (const chunk of chunks) {
    options.body.uris = chunk;
    await request.post(options);
  }
}

export async function removeFromPlaylist(code: string, playlistId: string, trackIds: string[]) {
  const token = await getUserToken(code);
  const options: request.Options = {
    uri: `https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`,
    body: {
      tracks: [],
    },
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    gzip: true,
  };
  const chunks = _.chunk(trackIds, 100);
  for (const chunk of chunks) {
    options.body.tracks = chunk.map((n) => {
      return { uri: n };
    });
    await request.delete(options);
  }
}

export async function playlistTracks(code: string, playlistId: string) {
  const token = await getUserToken(code);
  const options: request.Options = {
    uri: `https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`,
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    gzip: true,
  };
  let res = await request.get(options);
  const items: string[] = [];
  res.items.forEach((n) => items.push(n.track.uri));
  while (res.next) {
    options.uri = res.next;
    res = await request.get(options);
    res.items.forEach((n) => items.push(n.track.uri));
  }
  return items;
}

export async function updatePlaylists(code: string) {
  for (const chan of channels) {
    let trackIds = await popular(chan, 1000)
      .then((t) => t.map((n) => {
        if (!n.spotify) {
          return;
        }
        return `spotify:track:${n.spotify.spotifyId}`;
      }));
    trackIds = _.uniq(_.compact(trackIds));
    const current = await playlistTracks(code, chan.playlist)
      .catch((e) => {
        console.error('GET TRACKS?', e);
        return [];
      });
    const toRemove = _.difference(current, trackIds);
    await removeFromPlaylist(code, chan.playlist, toRemove).catch((e) => console.error('REMOVE', e));
    const toAdd = _.pullAll(trackIds, current);
    await addToPlaylist(code, chan.playlist, toAdd).catch((e) => console.error('ADD ERROR', e));
  }
}
