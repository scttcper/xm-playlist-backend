import { expect } from 'chai';

import { setup } from '../models/dbinit';
import { searchTrack } from '../src/spotify';

describe('spotify', function() {
  beforeEach(function() {
    this.timeout(10000);
  });
  it('should find Say My Name', async function() {
    const name = 'Say My Name (Remix)';
    const artists = ['ODESZA', 'Cedric Gervais', 'Zyra'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('1gNj8JoisgQZQmrcpfx9E5');
  });
  it('should find Cold Water', async function() {
    const name = 'Cold Water-Lost Frequencies Remix';
    const artists = ['Justin Bieber', 'Major Lazer', 'MO'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('4HMfSzk0UsiRhulF0eb1M9');
  });
  it('should find False Alarm-Hook N Sling Mix', async function() {
    const name = 'False Alarm-Hook N Sling Mix';
    const artists = ['Matoma'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('7FWSYDL3TOu0Q4fzBdx3F5');
  });
  it('should find Closer (R3HAB Mix)', async function() {
    const name = 'Closer (R3HAB Mix)';
    const artists = ['The Chainsmokers', 'Halsey'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('0Ye1olMyvB2rLjZ4vlYVWI');
  });
  it('should find Falling', async function() {
    const name = 'Falling';
    const artists = ['Alesso'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('43mNwDn0zOH2HKl5B4aqcx');
  });
  it('should find Another Life', async function() {
    const name = 'Another Life (f.Ester Dean)';
    const artists = ['David Guetta', 'Afrojack'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('0AOEd0Zw22aTE8LzsS4EMg');
  });
  it('should find Subeme La Radio-Ravell Remix', async function() {
    const name = 'Subeme La Radio-Ravell Remix';
    const artists = ['Enrique Iglesias', 'Descemer Bueno', 'Zio'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('1eJaMOi47bQlinXC9wi5b3');
  });
  it('should find Something Just Like This-Alesso Rem', async function() {
    const name = 'Something Just Like This-Alesso Rem';
    const artists = ['The Chainsmokers', 'Coldplay'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('50RJdoxw8iajGNtHQe6QeS');
  });
  it('should find Jumpin\' Jumpin\'', async function() {
    const name = 'Jumpin\' Jumpin\' (00)';
    const artists = ['Destiny\'s Child'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('4pmc2AxSEq6g7hPVlJCPyP');
  });
  it('should find Don\'t Kill My Vibe (Gryffin Remix)', async function() {
    const name = 'Don\'t Kill My Vibe (Gryffin Remix)';
    const artists = ['Sigrid'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('6VEbv3jRYbOeo2UZ0mkN7h');
  });
  it('should find The Creator (\'92)', async function() {
    const name = 'The Creator (\'92)';
    const artists = ['Pete Rock & C.L. Smooth'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('0vDgtmc5vMDyE69oYnAbUm');
  });
  it('should find Blurred Lines', async function() {
    const name = 'Blurred Lines';
    const artists = ['Robin Thicke ft T.I. & Pharrell'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).to.eq('0n4bITAu0Y0nigrz3MFJMb');
  });
});
