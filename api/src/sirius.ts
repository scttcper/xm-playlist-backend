import debug from 'debug';
import got from 'got';
import { URLSearchParams } from 'url';
import { db } from './db';

import { matchesGarbage } from './ignoreNames';
import { Channel } from '../../frontend/channels';
import { SiriusDeeplink } from './siriusDeeplink';
import { TrackModel, ScrobbleModel } from './models';

const log = debug('xmplaylist');

export function parseName(name: string) {
  return name.split(' #')[0];
}

export function parseArtists(artists: string): string[] {
  // Splits artists into an array
  return artists.match(/(?:\/\\|[^/\\])+/g);
}

export function parseDeeplinkResponse(channel: Channel, data: SiriusDeeplink) {
  try {
    const markerLists =
      data?.ModuleListResponse?.moduleList?.modules?.[0].moduleResponse?.moduleDetails
        ?.liveChannelResponse.liveChannelResponses?.[0].markerLists ?? [];
    const cut = markerLists.find(markerList => markerList.layer === 'cut');
    const allowedContentType = channel.allowLinkContent ? ['Song', 'Link'] : ['Song'];
    const markers =
      cut?.markers?.filter(
        marker =>
          allowedContentType.includes(marker.cut.cutContentType) &&
          marker.cut.title &&
          marker.cut.title.trim().length > 0 &&
          marker.cut.galaxyAssetId.trim().length > 1,
      ) ?? [];

    // more filtering
    const filteredMarkers = markers.filter(marker => {
      if (marker.cut.cutContentType === 'Song') {
        return true;
      }

      return (
        (!marker.duration || marker.duration > 35) &&
        // block @sxmwillie
        !marker.cut?.artists?.[0]?.name?.startsWith('@') &&
        !marker.cut?.artists?.[0]?.name?.startsWith('#') &&
        !marker.cut.title.startsWith('@')
      );
    });

    return filteredMarkers.map(marker => ({
      song: marker.cut,
      startTime: new Date(marker.timestamp.absolute),
      contentType: (marker.cut.cutContentType ?? '').toLowerCase() as 'song' | 'link',
    }));
  } catch (e) {
    // log('parsing response error', e);
    throw e;
  }
}

export async function handleResponse(channel: Channel, res: SiriusDeeplink) {
  const results = parseDeeplinkResponse(channel, res);

  const inserted: Array<{ track: TrackModel; scrobble: ScrobbleModel }> = [];
  for (const { song, startTime, contentType } of results) {
    const artists = parseArtists(song.artists[0].name);
    const name = parseName(song.title);
    const track: TrackModel = {
      id: song.galaxyAssetId,
      name,
      // stringify because knex errors otherwise
      artists: JSON.stringify(artists) as any,
      album: song.album?.title || null,
      itunesId: song.externalIds?.find(x => x.id === 'iTunes')?.value || null,
    };
    const scrobble: ScrobbleModel = {
      trackId: track.id,
      channel: channel.deeplink,
      startTime,
      contentType,
    };

    const alreadyScrobbled = await db('scrobble')
      .select<{ id: string } | undefined>('id')
      .where({
        trackId: track.id,
        channel: channel.deeplink,
        startTime,
      })
      .first();
    if (alreadyScrobbled) {
      continue;
    }

    log({
      id: track.id,
      name,
      artists,
      startTime,
      contentType,
      deeplink: channel.deeplink,
      album: track.album,
      itunesId: track.itunesId,
    });

    const existingTrack = await db('track')
      .select<{ id: string } | undefined>('id')
      .where({ id: track.id })
      .first();

    if (!existingTrack) {
      await db('track').insert(track);
    } else {
      const { id: _, ...update } = { ...track, updatedAt: db.fn.now() };
      await db('track').where('id', '=', track.id).update(update);
    }

    await db('scrobble').insert(scrobble);
    inserted.push({ track, scrobble });
  }

  return inserted;
}

export async function checkEndpoint(channel: Channel) {
  let res: SiriusDeeplink;
  try {
    const searchParams = new URLSearchParams({
      deepLinkId: channel.deeplink,
      'deepLink-type': 'live',
    });
    res = await got
      .get('http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink', {
        timeout: 10_000, // 10 sec
        searchParams,
      })
      .json();
  } catch (e) {
    log(e);
    throw e;
  }

  return handleResponse(channel, res);
}
