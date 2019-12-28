import { differenceInDays } from 'date-fns';
import debug from 'debug';
import got from 'got';

import { Artist, ArtistTrack, Play, Spotify, Track } from '../models';
import { Channel } from './channels';
import { getLast } from './plays';
// import { matchSpotify, spotifyFindAndCache } from './spotify';
// import { findOrCreateArtists } from './tracks';

const log = debug('xmplaylist');

export function parseArtists(artists: string): RegExpMatchArray {
  // Splits artists into an array
  return artists.match(/(?:\/\\|[^/\\])+/g) as RegExpMatchArray;
}

export function parseName(name: string) {
  return name.split(' #')[0];
}

export function parseChannelMetadataResponse(meta: any, currentEvent: any) {
  const artists = parseArtists(String(currentEvent.artists.name));
  const name = parseName(String(currentEvent.song.name));
  const songId = String(currentEvent.song.id);
  return {
    channelId: meta.channelId,
    channelName: meta.channelName,
    channelNumber: meta.channelNumber,
    name,
    artists,
    artistsId: currentEvent.artists.id,
    startTime: new Date(currentEvent.startTime),
    songId: songId.replace(/#/g, '!'),
  };
}

export async function checkEndpoint(channel: Channel) {
  let res;
  try {
    const searchParams = new URLSearchParams({
      deepLinkId: channel.deeplink,
      'deepLink-type': 'live',
    });
    res = await got.get('http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink', { searchParams }).json();
  } catch (e) {
    log.log(e);
    return false;
  }

  let song;
  let cut;
  let startTime;
  try {
    // eslint-disable-next-line
    const markerLists =
      res.ModuleListResponse.moduleList.modules[0].moduleResponse.moduleDetails.liveChannelResponse
        .liveChannelResponses[0].markerLists;
    cut = markerLists.find(n => n.layer === 'cut');
    // console.log(cut.markers[0]);
    song = cut.markers[0].cut;
    startTime = cut.markers[0].timestamp.absolute;
    // console.log(song);
  } catch {
    return;
  }
}
