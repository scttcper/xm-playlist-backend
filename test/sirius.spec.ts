import { parseArtists, parseName } from '../src/sirius';
import { client } from '../src/redis';

describe('sirius', () => {
  afterAll(done => {
    client.quit(done);
  });
  it('should parse artists', () => {
    const artists = parseArtists('Axwell/\\Ingrosso/Adventure Club vs. DallasK');
    expect(artists.length).toBe(2);
    expect(artists[0]).toBe('Axwell/\\Ingrosso');
  });
  it('should parse song name', () => {
    const name = parseName('Jupiter #bpmDebut');
    expect(name).toBe('Jupiter');
  });
});
