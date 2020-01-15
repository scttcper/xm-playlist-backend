import { db } from './db';
import { getNewest } from './plays';
import { channels } from '../frontend/channels';
import { handleResponse } from './sirius';
import { siriushits } from './mocks/siriushits';

beforeEach(async () => {
  await db.migrate.rollback(undefined, true);
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('getNewest', () => {
  it('should get newest', async () => {
    const channel = channels[0];
    await handleResponse(channel, siriushits);
    const newest = await getNewest(channel);
    expect(newest).toHaveLength(1);
    expect(newest[0].track).toEqual({
      artists: ['Halsey'],
      id: 'GDCA-101851532-001',
      name: null,
    });
  });
});
