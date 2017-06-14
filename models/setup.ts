import * as sequelize from 'sequelize';
import * as _ from 'lodash';

import { Track, Artist, ArtistTrack, ArtistTrackInstance, Play } from './index';
import { encode } from '../src/util';
import channels from '../src/channels';

const data = {
  channelId: 'thebeat',
  name: 'Alone (Squalzz Remix)',
  artists: [
    'Marshmello',
  ],
  artistsId: 'Elx',
  startTime: '2016-10-26T05:00:13Z',
  songId: '$O1Fdf',
  cover: 'http://www.siriusxm.com/albumart/Live/0500/marshmello_57DB115C_m.jpg',
};

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

async function testData(data) {
  const artists = await findOrCreateArtists(data.artists);
  const [track, created] = await Track
    .findOrCreate({
      where: {
        songId: encode(data.songId),
        name: data.name,
      },
    });
  if (!created) {
    track.increment('plays');
  } else {
    const at = artists.map((artist) => {
      return {
        artistId: artist.get('id'),
        trackId: track.get('id'),
      };
    });
    await ArtistTrack.bulkCreate(at, { returning: false });
  }
  const chan = _.find(channels, _.matchesProperty('id', data.channelId));
  await Play.create({ channel: chan.number, trackId: track.get('id'), startTime: new Date(data.startTime) });
}

testData()
  .then(() => { process.exit(); });
