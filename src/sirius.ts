import * as debug from 'debug';
import * as moment from 'moment';
import * as request from 'request-promise-native';
import * as _ from 'lodash';

// import { findOrCreateTrack } from './tracks';
import { getLast } from './plays';
import { Track, ArtistTrack, Play, ArtistTrackInstance, Artist } from '../models';
import { channels } from './channels';
import { encode } from './util';
// const spotify = require('./spotify');

// http://www.siriusxm.com/metadata/pdt/en-us/json/channels/thebeat/timestamp/02-25-08:10:00
const baseurl = 'http://www.siriusxm.com';
const log = debug('xmplaylist');

export function parseArtists(artists: string): string[] {
  // splits artists into an array
  return artists.match(/(?:\/\\|[^/\\])+/g);
}
export function parseName(name: string) {
  return name.split(' #')[0];
}

export function parseChannelMetadataResponse(obj: any) {
  const meta = obj.channelMetadataResponse.metaData;
  const currentEvent = meta.currentEvent;
  const song = currentEvent.song;
  // some artists have a /\ symbol
  const artists = parseArtists(currentEvent.artists.name);
  const name = parseName(song.name);
  return {
    channelId: meta.channelId,
    channelName: meta.channelName,
    channelNumber: meta.channelNumber,
    name,
    artists,
    artistsId: currentEvent.artists.id,
    startTime: new Date(currentEvent.startTime),
    songId: song.id.replace(/#/g, '!'),
  };
}

export async function checkEndpoint(channel) {
  const dateString = moment.utc().format('MM-DD-HH:mm:00');
  const url = `${baseurl}/metadata/pdt/en-us/json/channels/${channel.id}/timestamp/${dateString}`;
  log(url);
  const req = request.get(url, { json: true, gzip: true, simple: true });
  const last = await getLast(channel);
  let res;
  try {
    res = await Promise.all([req, last]);
  } catch (e) {
    return false;
  }
  if (!res.channelMetadataResponse || !res.channelMetadataResponse.status) {
    return false;
  }
  const newSong = parseChannelMetadataResponse(res);
  if (['^I', ''].includes(newSong.songId) || newSong.name[0] === '#') {
    return false;
  }
  if (last && last.get('songId') === newSong.songId) {
    return false;
  }
  // TODO: announce
  log(newSong);
  // try {
  //   if (process.env.NODE_ENV !== 'test') {
  //     spotify.findAndCache(newSong.songId);
  //   }
  // } catch (e) {
  //   log(`${newSong.songId} not found on spotify`);
  // }

  await insertPlay(newSong);
  return Promise.resolve(true);
}

function findOrCreateArtists(artists: string[]) {
  const promises: Array<Promise<ArtistTrackInstance>> = artists.map((n): any  => {
    return Artist
      .findOrCreate({ where: { name: n }})
      .spread((artist: ArtistTrackInstance, created) => {
        return artist;
      });
  });
  return Promise.all(promises);
}

async function insertPlay(data: any) {
  const artists = await findOrCreateArtists(data.artists);
  const [track, created] = await Track
    .findOrCreate({
      where: {
        songId: encode(data.songId),
      },
    });
  if (!created) {
    track.increment('plays');
  } else {
    await track.update({ name: data.name });
    const at = artists.map((artist) => {
      return {
        artistId: artist.get('id'),
        trackId: track.get('id'),
      };
    });
    await ArtistTrack.bulkCreate(at, { returning: false });
  }
  const chan = _.find(channels, _.matchesProperty('id', data.channelId));
  await Play.create(
    { channel: chan.number, trackId: track.get('id'), startTime: new Date(data.startTime) },
    { returning: false },
  );
}
