import { matchesGarbage } from './ignoreNames';

it('it should block garbage', () => {
  expect(matchesGarbage({ cut: { artists: [{ name: 'WeekendCountdown' }], title: '' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: 'weekendCountdown' }], title: '' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: '' }], title: '@SiriusXMHits1' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: 'New & Trending!' }], title: 'Pandora Now' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: 'SoulCycle Radio' }], title: 'on SiriusXM' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: 'Send yours!' }], title: 'social@soul-cycle.com' } } as any)).toBeTruthy();
  expect(matchesGarbage({ cut: { artists: [{ name: 'Be a Hit-Maker!' }], title: 'siriusxm.com/hits1' } } as any)).toBeTruthy();
});

it('it should allow non garbage', () => {
  expect(matchesGarbage({ cut: { artists: [{ name: 'Kanye' }], title: 'Follow God' } } as any)).toBeFalsy();
});
