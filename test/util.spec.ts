import * as Util from '../src/util';

describe('Util', () => {
  it('should clean ft', () => {
    expect(Util.cleanFt('Take You There(feat.Jamie Principle)')).toBe('Take You There( Jamie Principle)');
    expect(Util.cleanFt('Talk About Me (Feat. Victoria Zaro)')).toBe('Talk About Me ( . Victoria Zaro)');
    expect(Util.cleanFt('Another Life (f.Ester Dean)')).toBe('Another Life (Ester Dean)');
    expect(Util.cleanFt('I Need You (f/Fernando Garibay)')).toBe('I Need You ( Fernando Garibay)');
    expect(Util.cleanFt('The Right Song (feat. Natalie La Ro')).toBe('The Right Song ( . Natalie La Ro');
    expect(Util.cleanFt('The Right Song (w/Natalie La Ro')).toBe('The Right Song ( Natalie La Ro');
    expect(Util.cleanFt('Your Love feat Jamie Lewis')).toBe('Your Love  Jamie Lewis');
    expect(Util.cleanFt('Morning After Dark')).toBe('Morning After Dark');
    expect(Util.cleanFt('Robin Thicke ft T.I. & Pharrell')).toBe('Robin Thicke   T.I. & Pharrell');
  });
  it('should clean clean Music Video', () => {
    expect(Util.cleanMusicVideo('Song (official video) ft. Natalie')).toBe('Song () ft. Natalie');
    expect(Util.cleanMusicVideo('Robin Schulz (Official)')).toBe('Robin Schulz ');
    expect(Util.cleanMusicVideo('Robin Schulz Lyrics')).toBe('Robin Schulz ');
  });
  it('should clean clean', () => {
    expect(Util.cleanClean('Swish Swish (Clean)')).toBe('Swish Swish ');
  });
  it('should collapse', () => {
    expect(Util.cleanSpaces('Song blah  blah   blah')).toBe('Song blah blah blah');
  });
  it('should clean remix', () => {
    expect(Util.cleanRemix('Young (Gil Glaze Remix)')).toBe('Young (Gil Glaze )');
    expect(Util.cleanRemix('Animals-Botnek Edit')).toBe('Animals-Botnek ');
    expect(Util.cleanRemix('Don\'t Kill My Vibe (Gryffin Remix)')).toBe('Don\'t Kill My Vibe (Gryffin )');
    expect(Util.cleanRemix('False Alarm-Hook N Sling Mix')).toBe('False Alarm-Hook N Sling ');
    expect(Util.cleanRemix('Closer (R3HAB Mix)')).toBe('Closer (R3HAB )');
  });
  it('should clean cut off end words', () => {
    expect(Util.cleanCutoff('Something Just Like This-Alesso Rem')).toBe('Something Just Like This-Alesso');
    expect(Util.cleanCutoff('one two three')).toBe('one two three');
  });
  it('should clean up garbage', () => {
    expect(Util.cleanupExtra('Something Just Like This-Alesso Rem')).toBe('Something Just Like This Alesso Rem');
  });
  it('should clean up year', () => {
    expect(Util.cleanYear('Gimme Shelter (69)')).toBe('Gimme Shelter ');
    expect(Util.cleanYear('Hello, I Love You (68)')).toBe('Hello, I Love You ');
    expect(Util.cleanYear('The Creator (\'92)')).toBe('The Creator ');
    expect(Util.cleanYear('Another Life (f.Ester Dean)')).toBe('Another Life (f.Ester Dean)');
  });
});
