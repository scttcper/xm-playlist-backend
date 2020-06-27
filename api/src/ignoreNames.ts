import micromatch from 'micromatch';

import { Marker } from './siriusDeeplink';

const ignorePaterns = [
  '@MorningMashUp',
  '**WeekendCountdown**',
  'social@soul-cycle.com',
  'Venus',
  '*SXM.com*',
  'Ch179 On Now',
  'Ch 19',
  'Ch 73',
  '@CalienteSXM',
  '87785-SALSA',
  '50s on 5',
  '**10pET**',
  '**2aET**',
  '**1aET**',
  '**7aET**',
  '**8aET**',
  '**9aET**',
  '**10aET**',
  '**1pET**',
  '**2pET**',
  '**4pET**',
  '**5pET**',
  '**6pET**',
  '**8pET**',
  '**9pET**',
  '*FlowNacion*',
  '*TumbaLaCasa*',
  'Spectrum',
  '#**SXM**',
  '@**SXM',
  'Yacht Rock Radio',
  '**SiriusXM**',
  '**Sirius XM**',
  'Vocalists',
  'rockhall.com',
  '@icecube',
  '#RockHall*',
  'This Day In History',
  '*RockHall*',
  '**fb.com**',
  '@RadioFaction',
  'Faction Punk',
  'Pulse Morning Show',
  'Top 15 Countdown',
  '*PUL_AM_Hometown*',
  '*50son5*',
  '& Booze',
  'NewMusicShowcase',
  'to 2000s',
  'ONEderland',
  '#OneBigPopHit',
  "Today's Top",
  "Pitbull's Globalization",
  'Globalization',
  "Pitbull's",
  'Prime Country',
  'sirius*xm',
  'Studio 54',
  'KidzBop.com',
  '**@SXM**',
  '#Throwback30',
  '2004 Events',
  'Homecoming Radio',
  'Like and Follow',
  '#GoldenHourBPM',
  '#InTheAir',
  '#betaBPM',
  'EAS Monthly Test',
  '#RecordsOnRecords',
  '#*SXM',
  '#ThrowbackHour',
  'Classic Dance Hits',
  'Marc & Myra',
  '#Top*Countdown',
  '#60sOn6',
  'All 60s Hits',
  '*Cousin Brucie*',
  'Critical Workers',
  'Alt**Discovery',
  'Tmrw*',
  '**@altnation**',
  '#AdvancedPlacement',
  'Inside Tracks',
  'Dave Koz Lounge',
  'The Craft Room',
  '@watercolorsjazz',
  'Euge Groove',
  '*New*Trending*',
  'Pandora*Now',
  '*SoulCycle*',
  'Best On Hits 1',
  'Hit-Bound',
  'And on Instagram',
  'And on Facebook',
  'Blend News Bites',
  '*sCommercial Free*',
  'You May Also Like',
  '#TheCalmChannel',
  '**siriusmx**',
  '*SwayInTheMorning*',
  '*SWAY IN THE MORNING*',
  'The Lord Sear Special',
  'Feel Good Friday',
  'Shade45',
  '*onemorejude*',
  '*TheHYPEisREAL*',
  '*fastcashboyz*',
  '*djgodfatherdetroit*',
  '*EminemShow*',
  '*Prime Country*',
  '*80s & 90s*',
  'Grand Ole Opry',
  'Ranger Doug',
  '*Prime Country*',
  '*Prime 30*',
  "*80's On 8*",
  'On App*Online',
  'enLighten',
  '*SXMenLighten*',
  "Kirk Franklin's Praise",
  'Lee DeWyze',
  '*TheCoffeeHouse*',
  'Essential Workers',
  'THANK YOU',
  '*George Floyd*',
  '*AokisHouse*',
  '**Facebook.com**',
  '*SiriusXM*',
  '#DoubleDownRadio',
  '*WEEKLY TEST*',
  "Ear Poppin' Music*",
  '**SXM App**',
  '**#SXM**',
  '@TheGrahamNash',
  'Weekdays 5-11pET',
  'Alt Countdown',
  '**Top1000**',
  '**Top 1000**',
  '**Ch.34**',
  '**PopRocks**',
  '**Ch30**',
  '**80s on 8**',
  '@alanhuntermtv',
  'Summer Sounds',
  'Weekend Countdown',
  '**RockTheBells**',
  '**Party Rock Joint**',
  '**Growing Up 80s**',
  'Big Daddy Kane',
  'Hip Hop Scene',
  '#CultureMix',
  '#BreakinBells',
  'Dr. Dre on',
  'Marley Marl on',
  'RZA on',
  'Wu-Tang on',
  'Biz Markie Show',
  '#HaveANiceDay',
  'ClassicFreestyle',
  'Hair Nation',
  'Classic Vinyl',
  'Bluesville',
  '@goodymade',
  '@alanhuntermtv',
  '@NinaBlackwood',
  'Celtic Crush',
  'James Joyce Show',
  "**Jeff & Larry's**",
  'NETFLIX IS A JOKE RADIO',
  '**LatidosSXM**',
  'Unpopped!',
  '**8SongsAWeek**',
  "**John's Jukebox**",
  '**Pop Rocks**',
  '**TIGDH**',
  'Hard Rock 1000',
  'The Carles Show',
  'Celebrate!*',
  '#StayAtHome',
];

export function matchesGarbage(marker: Marker): boolean {
  const name = (marker.cut?.artists?.[0]?.name ?? '').replace('/', '').replace('', '');
  const title = (marker.cut?.title ?? '').replace('/', '').replace('', '');
  return (
    micromatch([name, title], ignorePaterns, {
      nocase: true,
      nonegate: true,
    }).length > 0
  );
}
