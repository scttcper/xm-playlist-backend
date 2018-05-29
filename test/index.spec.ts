import { expect } from 'chai';
import * as nock from 'nock';
import * as supertest from 'supertest';
import channelMetadataResponse from './mock/channelMetadataResponse';

import { setup } from '../models/dbinit';
import { Channel } from '../src/channels';
import { server } from '../src/index';
import { insertPlay } from '../src/sirius';

const play = {
  channelId: '90salternative',
  channelName: 'Lithium',
  channelNumber: 34,
  name: 'Man In The Box',
  artists: ['Alice In Chains'],
  artistsId: 'Jd',
  startTime: new Date('2017-06-29T05:58:17.000Z'),
  songId: 'JE84MGF3',
};

const channel: Channel = {
  id: '90salternative',
  number: 34,
  name: 'Lithium',
  playlist: '',
  genre: 'Rock',
  desc: "'90s Alternative/Grunge",
};

describe('index', function() {
  beforeEach(function() {
    this.timeout(10000);
    return setup(true);
  });
  it('should parse metadata response', async function() {
    const t = await insertPlay(play, channel);
    const res = await supertest(server.listener)
      .get('/channel/90salternative')
      .expect(200);
    expect(res.body.length).to.eq(1);
  });
});
