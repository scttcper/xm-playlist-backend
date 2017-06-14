import * as _ from 'lodash';
import { Db, MongoClient } from 'mongodb';

import { Track, Artist, ArtistTrack, ArtistTrackInstance, Play } from '../models';
import { encode } from '../src/util';
import { channels } from '../src/channels';

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

async function loop() {
  const db = await MongoClient.connect('mongodb://127.0.0.1/xmplaylist');
  const oldest = await db.collection('stream')
    .findOne({
      failed: false,
    }, {
      sort: { startTime: -1 },
    });
  const mid = await Play.findOne({ order: [['id', 'DESC']] });
  let cur = mid ? mid.get('startTime') : new Date();
  while (true) {
    const promises = [];
    const batch = await db
      .collection('stream')
      .find({ startTime: { $lt: cur } })
      .sort({ startTime: -1 })
      .limit(1000)
      .toArray();
    cur = batch[batch.length - 1].startTime;
    await Promise.all(batch.map((b) => insertPlay(b)));
  }
}

loop().then(() => process.exit()).catch((e) => console.log(e));
