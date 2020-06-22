import {findAndCacheLinks} from './linkfinder';

describe('linkfinder', () => {
  it('should get links', async () => {
    const links = await findAndCacheLinks({
      trackId: '123',
      spotifyId: '1egVLpTrGvaWtUcR2xDoaN',
      name: 'the xx',
      cover: null,
      previewUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(links).toBeTruthy();
  })
})
