import { differenceInDays } from 'date-fns';
import debug from 'debug';
import request from 'request-promise-native';

import { Artist, ArtistTrack, Play, Spotify, Track } from '../models';
import { Channel } from './channels';
import { getLast } from './plays';
import { matchSpotify, spotifyFindAndCache } from './spotify';
import { findOrCreateArtists } from './tracks';

const log = debug('xmplaylist');

export function parseArtists(artists: string) {
  // Splits artists into an array
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
  // const dateString = dateFmt(utc, 'MM-dd-HH:mm:00');
  const url = 'http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink';
  // log(url);
  let res;
  try {
    const qs = {
      deepLinkId: channel.name.replace(/\W+/g, ''),
      'deepLink-type': 'live',
    };
    res = await request.get(url, { qs, json: true, gzip: true, simple: true });
  } catch {
    return false;
  }

  let song;
  let cut;
  let startTime;
  try {
    // eslint-disable-next-line
    const markerLists = res.ModuleListResponse.moduleList.modules[0].moduleResponse.moduleDetails.liveChannelResponse.liveChannelResponses[0].markerLists;
    cut = markerLists.find(n => n.layer === 'cut');
    // console.log(cut.markers[0]);
    song = cut.markers[0].cut;
    startTime = cut.markers[0].timestamp.absolute;
    // console.log(song);
  } catch {
    return;
  }

  if (song.cutContentType !== 'Song') {
    log('SKIPPING BECAUSE ITS NOT A SONG');
    return;
  }

  const artists = parseArtists(song.artists[0].name);
  const name = parseName(song.title);
  const newSong = {
    channelId: channel.id,
    channelName: channel.name,
    channelNumber: channel.number,
    name,
    artists,
    // artistsId: song.artists.id,
    startTime: new Date(startTime),
    songId: song.galaxyAssetId,
  };

  const alreadyPlayed = await getLast(channel, newSong.startTime);
  if (alreadyPlayed) {
    log('SKIPPING BECAUSE ITS ALREADY RECORDED');
    return false;
  }

  const track = await insertPlay(newSong, channel);
  log(newSong);

  if (process.env.NODE_ENV !== 'test') {
    spotifyFindAndCache(track)
      .then(async doc => {
        log('DAYS', differenceInDays(new Date(), doc.get('createdAt')));
        if (differenceInDays(new Date(), doc.get('createdAt')) > 15) {
          await Spotify.findOne({ where: { trackId: track.id } }).then(d => d.destroy());
          return matchSpotify(track, false);
        }

        return doc;
      })
      .catch(err => log('spotifyFindAndCacheError', err));
  }

  return true;
}

export async function insertPlay(
  data: any,
  channel: Channel,
): Promise<Track> {
  const artists = await findOrCreateArtists(data.artists);
  let track = await Track.findOne({ where: { songId: data.songId } });
  if (track) {
    track.increment('plays');
  } else {
    // eslint-disable-next-line require-atomic-updates
    track = await Track.create({
      songId: data.songId,
      name: data.name,
    });
    const at = artists.map(artist => {
      return {
        artistId: artist.get('id'),
        trackId: track.get('id'),
      };
    });
    await ArtistTrack.bulkCreate(at, { returning: false });
  }

  await Play.create(
    {
      channel: channel.number,
      trackId: track.get('id'),
      startTime: new Date(data.startTime),
    },
    { returning: false },
  );
  const final = await Track.findByPk(track.get('id'), { include: [Artist, Spotify] });
  return final.toJSON();
}
