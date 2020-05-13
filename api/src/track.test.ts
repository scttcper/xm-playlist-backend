import { db } from './db';
import { getTrack } from './track';
import { channels } from '../../frontend/channels';
import { handleResponse } from './sirius';
import { siriushits, siriushitsTrackId } from './mocks/siriushits';

beforeEach(async () => {
  await db.migrate.rollback(undefined, true);
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('getTrack', () => {
  it('should get track', async () => {
    const channel = channels[0];
    await handleResponse(channel, siriushits);
    const track = await getTrack(siriushitsTrackId);
    delete track.track.created_at;
    expect(track).toEqual({
      links: [],
      spotify: {
        cover: null,
        preview_url: null,
        spotify_id: null,
      },
      track: {
        artists: ['Halsey'],
        id: 'GDCA-101851532-001',
        name: 'Without Me',
      },
    });
  });
});
