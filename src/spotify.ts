/* eslint-disable no-await-in-loop */
import _ from 'lodash';
import got from 'got';
import { URLSearchParams } from 'url';

import config from '../config';
import { client, getCache } from './redis';
import * as Util from './util';
import { search } from './youtube';
import { TrackModel, Spotify } from '../frontend/models';
import { db } from './db';
import { channels } from '../frontend/channels';
import { getMostHeard } from './plays';

export class SpotifyFailed extends Error {
  message = 'Spotify failed';
}

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
  previewUrl: string | null;
}

export function parseSpotify(obj: any): SpotifyParsed {
  const cover = obj?.album?.images?.[0] ?? {};
  return {
    cover: cover.url,
    spotifyId: obj.id,
    spotifyName: obj.name,
    durationMs: obj.duration_ms,
    url: obj.external_urls.spotify,
    previewUrl: obj.preview_url,
  };
}

export function optionalBlacklist(track: string, artists: string) {
  const all = track.toLowerCase() + artists.toLowerCase();
  return blacklist
    .map(b => {
      if (!all.includes(b)) {
        return ` NOT ${b}`;
      }

      return '';
    })
    .join('');
}

export async function getToken(): Promise<string> {
  const cache = await getCache('spotifytoken:cache');
  if (cache) {
    return cache;
  }

  const auth = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64');
  const res = await got
    .post('https://accounts.spotify.com/api/token', {
      headers: { Authorization: `Basic ${auth}` },
      form: { grant_type: 'client_credentials' },
    })
    .json<any>();
  client.setex('spotifytoken:cache', res.expires_in - 100, res.access_token);
  return res.access_token;
}

export async function searchTrack(artists: string[], name: string): Promise<SpotifyParsed> {
  const cleanArtists = Util.cleanupExtra(Util.cleanCutoff(artists.join(' ')));
  const cleanTrack = Util.cleanupExtra(
    Util.cleanRemix(Util.cleanFt(Util.cleanClean(Util.cleanCutoff(Util.cleanYear(name))))),
  );
  // Console.log('CLEAN: ', cleanTrack, cleanArtists);
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };
  // Console.log('ORIGINAL:', options.qs.q);
  const searchParams = new URLSearchParams({
    q: `${cleanTrack} ${cleanArtists} ${optionalBlacklist(cleanTrack, cleanArtists)}`,
    type: 'track',
    limit: '1',
  });
  const url = 'https://api.spotify.com/v1/search';
  const res = await got
    .get(url, {
      searchParams,
      headers,
    })
    .json<any>();
  const items: any[] = res.tracks.items?.filter(n => n) ?? [];
  if (items.length > 0) {
    return parseSpotify(_.first(items));
  }

  const youtube = await search(`${cleanTrack} ${cleanArtists}`);
  if (!youtube) {
    throw new SpotifyFailed('Youtube failed');
  }

  searchParams.set(
    'q',
    Util.cleanupExtra(Util.cleanRemix(Util.cleanFt(Util.cleanMusicVideo(youtube)))) +
      optionalBlacklist(youtube, youtube),
  );
  // Console.log('GOOGLE:', options.qs.q);
  const res2 = (await got.get(url, { searchParams, headers }).json()) as any;
  const items2: any[] = res2.tracks.items?.filter(n => n) ?? [];
  if (items2.length > 0) {
    return parseSpotify(_.first(items2));
  }

  throw new SpotifyFailed();
}

export async function matchSpotify(track: TrackModel, update = false): Promise<void> {
  console.log({ artists: track.artists });
  const s = await searchTrack(JSON.parse(track.artists), track.name);

  if (!s || !s.spotifyName) {
    throw new SpotifyFailed();
  }

  if (update) {
    await db<Spotify>('spotify')
      .update({
        cover: s.cover,
        spotifyId: s.spotifyId,
        name: s.spotifyName,
        previewUrl: s.previewUrl,
        updatedAt: db.fn.now() as any,
      })
      .where('trackId', track.id);
  }

  await db<Spotify>('spotify').insert({
    trackId: track.id,
    cover: s.cover,
    spotifyId: s.spotifyId,
    name: s.spotifyName,
    previewUrl: s.previewUrl,
  });
}

export async function spotifyFindAndCache(track: TrackModel): Promise<Spotify | undefined> {
  const doc = await db<Spotify>('spotify')
    .select()
    .where('trackId', track.id)
    .first();
  // TODO: check spotify age
  if (doc) {
    return doc;
  }

  await matchSpotify(track);

  return db<Spotify>('spotify')
    .select()
    .where('trackId', track.id)
    .first();
}

export async function getUserToken(code: string): Promise<string> {
  const cache = await getCache('spotifyusertoken:cache');
  if (cache) {
    return cache;
  }

  const auth = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64');
  const res = await got
    .post('https://accounts.spotify.com/api/token', {
      headers: { Authorization: `Basic ${auth}` },
      form: {
        redirect_uri: 'https://example.com/',
        grant_type: 'authorization_code',
        code,
        state: 'xmplaylist',
      },
    })
    .json<any>();
  client.setex('spotifyusertoken:cache', res.expires_in - 100, res.access_token);
  return res.access_token;
}

export async function addToPlaylist(code: string, playlistId: string, trackIds: string[]) {
  const token = await getUserToken(code);
  const url = `https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`;
  const chunks = _.chunk(trackIds, 100);
  for (const chunk of chunks) {
    await got.post(url, {
      headers: { Authorization: `Bearer ${token}` },
      json: {
        uris: chunk,
      },
    });
  }
}

export async function removeFromPlaylist(code: string, playlistId: string, trackIds: string[]) {
  const token = await getUserToken(code);
  const url = `https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`;
  const chunks = _.chunk(trackIds, 100);
  for (const chunk of chunks) {
    await got.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
      json: {
        tracks: chunk.map(n => {
          return { uri: n };
        }),
      },
    });
  }
}

export async function playlistTracks(code: string, playlistId: string) {
  const token = await getUserToken(code);
  const headers = { Authorization: `Bearer ${token}` };
  let res = await got
    .get(`https://api.spotify.com/v1/users/xmplaylist/playlists/${playlistId}/tracks`, {
      headers,
    })
    .json<any>();
  const items: string[] = [];
  res.items.forEach(n => items.push(n.track.uri));
  while (res.next) {
    res = await got.get(res.next, { headers }).json<any>();
    res.items.forEach(n => items.push(n.track.uri));
  }

  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  return items.sort();
}

export async function updatePlaylists(code: string) {
  for (const channel of channels) {
    const mostHeard = await getMostHeard(channel, 10_000);
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const trackIds = mostHeard
      .filter(track => track.spotify.spotify_id)
      .map(track => `spotify:track:${track.spotify.spotify_id}`)
      .sort();

    const uniqueTrackIds = _.uniq(trackIds);
    const current = await playlistTracks(code, channel.playlist).catch(e => {
      console.error('GET TRACKS?', e);
      return [];
    });
    const toRemove = _.difference(current, uniqueTrackIds);
    await removeFromPlaylist(code, channel.playlist, toRemove).catch(e => console.error('REMOVE', e));
    const toAdd = _.pullAll(uniqueTrackIds, current);

    await addToPlaylist(code, channel.playlist, toAdd).catch(e => console.error('ADD ERROR', e));
    console.log(`Removed: ${toRemove.length} from ${channel.name}`);
    console.log(`Added: ${toAdd.length} to ${channel.name}`);
  }
}
