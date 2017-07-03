// https://www.siriusxm.com/albumart/Live/Default/DefaultMDS_m_52.jpg
export interface Channel {
  id: string;
  name: string;
  number: number;
  genre: string;
  desc: string;
  img?: string;
}
export const channels: Channel[] = [
  {
    id: 'siriushits1',
    number: 2,
    name: 'SiriusXM Hits 1',
    genre: 'Pop',
    desc: "Today's Pop Hits",
  },
  {
    id: '9389',
    number: 3,
    name: 'Venus',
    genre: 'Pop',
    desc: 'Pop Music You Can Move To',
  },
  {
    id: '9406',
    number: 4,
    name: "Pitbull's Globalization",
    genre: 'Pop',
    desc: 'Worldwide Rhythmic Hits',
  },
  {
    id: 'siriusgold',
    number: 5,
    name: "'50s on 5",
    genre: 'Pop',
    desc: "'50s Pop Hits",
  },
  {
    id: '60svibrations',
    number: 6,
    name: "'60s on 6",
    genre: 'Pop',
    desc: "'60s Pop Hits w/ Cousin Brucie",
  },
  {
    id: 'totally70s',
    number: 7,
    name: "'70s on 7",
    genre: 'Pop',
    desc: "'70s Pop Hits",
  },
  {
    id: 'big80s',
    number: 8,
    name: "'80s on 8",
    genre: 'Pop',
    desc: "'80s Pop Hits",
  },
  {
    id: '8206',
    number: 9,
    name: "'90s on 9",
    genre: 'Pop',
    desc: "'90s Pop Hits",
  },
  {
    id: '8208',
    number: 10,
    name: 'Pop2K',
    genre: 'Pop',
    desc: '2000s Pop Hits',
  },
  // {
  //   id: '9138',
  //   number: 13,
  //   name: 'SiriusXM Limited Edition',
  //   genre: 'Pop',
  //   desc: 'Exclusive Limited-Run Channels',
  // },
  {
    id: 'coffeehouse',
    number: 14,
    name: 'The Coffee House',
    genre: 'Pop',
    desc: 'Acoustic/Singer-Songwriters',
  },
  {
    id: 'thepulse',
    number: 15,
    name: 'The Pulse',
    genre: 'Pop',
    desc: 'Adult Pop Hits',
  },
  {
    id: 'starlite',
    number: 16,
    name: 'The Blend',
    genre: 'Pop',
    desc: 'Bright Pop Hits',
  },
  // {
  //   id: 'siriuslove',
  //   number: 17,
  //   name: 'SiriusXM Love',
  //   genre: 'Pop',
  //   desc: 'Love Songs',
  // },
  // {
  //   id: '9446',
  //   number: 18,
  //   name: 'The Beatles Channel',
  //   genre: 'Rock',
  //   desc: 'The Fab Four, 24/8',
  // },
  // {
  //   id: 'elvisradio',
  //   number: 19,
  //   name: 'Elvis Radio',
  //   genre: 'Rock',
  //   desc: 'Elvis 24/7 Live from Graceland',
  // },
  // {
  //   id: 'estreetradio',
  //   number: 20,
  //   name: 'E Street Radio',
  //   genre: 'Rock',
  //   desc: 'Bruce Springsteen, 24/7',
  // },
  {
    id: 'undergroundgarage',
    number: 21,
    name: 'Underground Garage',
    genre: 'Rock',
    desc: "Little Steven's Garage Rock",
  },
  // {
  //   id: '8370',
  //   number: 22,
  //   name: 'Pearl Jam Radio',
  //   genre: 'Rock',
  //   desc: 'Pearl Jam 24/7',
  // },
  // {
  //   id: 'gratefuldead',
  //   number: 23,
  //   name: 'Grateful Dead Channel',
  //   genre: 'Rock',
  //   desc: 'Grateful Dead, 24/7',
  // },
  {
    id: 'radiomargaritaville',
    number: 24,
    name: 'Radio Margaritaville',
    genre: 'Rock',
    desc: 'Escape to Margaritaville',
  },
  {
    id: 'classicrewind',
    number: 25,
    name: 'Classic Rewind',
    genre: 'Rock',
    desc: "'70s/'80s Classic Rock",
  },
  {
    id: 'classicvinyl',
    number: 26,
    name: 'Classic Vinyl',
    genre: 'Rock',
    desc: "'60s/'70s Classic Rock",
  },
  {
    id: 'thevault',
    number: 27,
    name: 'Deep Tracks',
    genre: 'Rock',
    desc: 'Deep Classic Rock',
  },
  {
    id: 'thespectrum',
    number: 28,
    name: 'The Spectrum',
    genre: 'Rock',
    desc: 'New Rock Meets Classic Rock',
  },
  {
    id: 'jamon',
    number: 29,
    name: 'Jam_ON',
    genre: 'Rock',
    desc: 'Jam Bands',
  },
  {
    id: '8207',
    number: 30,
    name: 'The Loft',
    genre: 'Rock',
    desc: 'Eclectic Rock',
  },
  // {
  //   id: '9407',
  //   number: 31,
  //   name: 'Tom Petty Radio',
  //   genre: 'Rock',
  //   desc: 'Music Curated by Tom Petty',
  // },
  {
    id: 'thebridge',
    number: 32,
    name: 'The Bridge',
    genre: 'Rock',
    desc: 'Mellow Rock',
  },
  {
    id: 'firstwave',
    number: 33,
    name: '1st Wave',
    genre: 'Rock',
    desc: "'80s Alternative/New Wave",
  },
  {
    id: '90salternative',
    number: 34,
    name: 'Lithium',
    genre: 'Rock',
    desc: "'90s Alternative/Grunge",
  },
  {
    id: 'leftofcenter',
    number: 35,
    name: 'SiriusXMU',
    genre: 'Rock',
    desc: 'New Indie Rock',
  },
  {
    id: 'altnation',
    number: 36,
    name: 'Alt Nation',
    genre: 'Rock',
    desc: 'New Alternative Rock',
  },
  {
    id: 'octane',
    number: 37,
    name: 'Octane',
    genre: 'Rock',
    desc: 'New Hard Rock',
  },
  {
    id: 'buzzsaw',
    number: 38,
    name: "Ozzy's Boneyard",
    genre: 'Rock',
    desc: "Ozzy's Classic Hard Rock",
  },
  {
    id: 'hairnation',
    number: 39,
    name: 'Hair Nation',
    genre: 'Rock',
    desc: "'80s Hair Bands",
  },
  {
    id: 'hardattack',
    number: 40,
    name: 'Liquid Metal',
    genre: 'Rock',
    desc: 'Heavy Metal-XL',
  },
  {
    id: 'faction',
    number: 41,
    name: 'Faction',
    genre: 'Rock',
    desc: 'Punk & Beats w/ Jason Ellis XL',
  },
  {
    id: 'reggaerhythms',
    number: 42,
    name: 'The Joint',
    genre: 'R&B',
    desc: 'Reggae',
  },
  {
    id: '8124',
    number: 43,
    name: 'Backspin',
    genre: 'Hip-Hop',
    desc: 'Classic Hip-Hop-XL',
  },
  {
    id: 'hiphopnation',
    number: 44,
    name: 'Hip-Hop Nation',
    genre: 'Hip-Hop',
    desc: "Today's Hip-Hop Hits-XL",
  },
  {
    id: 'shade45',
    number: 45,
    name: 'Shade 45',
    genre: 'Hip-Hop',
    desc: "Eminem's Hip-Hop Channel XL",
  },
  {
    id: 'hotjamz',
    number: 46,
    name: 'The Heat',
    genre: 'R&B',
    desc: "Today's R&B Hits",
  },
  {
    id: '9339',
    number: 47,
    name: 'SiriusXM FLY',
    genre: 'R&B',
    desc: "'90s & 2000s Hip-Hop/R&B - XL",
  },
  // {
  //   id: 'heartandsoul',
  //   number: 48,
  //   name: 'Heart & Soul',
  //   genre: 'R&B',
  //   desc: 'Adult R&B Hits',
  // },
  // {
  //   id: 'soultown',
  //   number: 49,
  //   name: 'Soul Town',
  //   genre: 'R&B',
  //   desc: 'Classic Soul/Motown',
  // },
  {
    id: '8228',
    number: 50,
    name: 'The Groove',
    genre: 'R&B',
    desc: "'70s/'80s R&B",
  },
  {
    id: 'thebeat',
    number: 51,
    name: 'BPM',
    genre: 'Dance/Electronic',
    desc: 'Electronic Dance Music Hits',
  },
  {
    id: 'area33',
    number: 52,
    name: 'Electric Area',
    genre: 'Dance/Electronic',
    desc: 'EDM DJ Mix Shows',
  },
  {
    id: 'chill',
    number: 53,
    name: 'SiriusXM Chill',
    genre: 'Dance/Electronic',
    desc: 'Downtempo/Deep House',
  },
  // {
  //   id: '9145',
  //   number: 54,
  //   name: 'Studio 54 Radio',
  //   genre: 'Dance/Electronic',
  //   desc: "'70s-2000s Dance Hits",
  // },
  {
    id: '9421',
    number: 55,
    name: 'The Garth Channel',
    genre: 'Country',
    desc: "Garth's Own Channel, 24/7",
  },
  {
    id: 'newcountry',
    number: 56,
    name: 'The Highway',
    genre: 'Country',
    desc: "Today's Country Hits",
  },
  {
    id: '9418',
    number: 57,
    name: 'No Shoes Radio',
    genre: 'Country',
    desc: "Kenny Chesney's Music Channel",
  },
  {
    id: 'primecountry',
    number: 58,
    name: 'Prime Country',
    genre: 'Country',
    desc: "'80s/'90s Country Hits",
  },
  {
    id: 'theroadhouse',
    number: 59,
    name: "Willie's Roadhouse",
    genre: 'Country',
    desc: "Willie's Classic Country",
  },
  {
    id: 'outlawcountry',
    number: 60,
    name: 'Outlaw Country',
    genre: 'Country',
    desc: "Rockin' Country Rebels",
  },
  {
    id: '9340',
    number: 61,
    name: 'Y2Kountry',
    genre: 'Country',
    desc: '2000s Country Hits',
  },
  {
    id: 'bluegrass',
    number: 62,
    name: 'Bluegrass Junction',
    genre: 'Country',
    desc: 'Bluegrass',
  },
  // {
  //   id: 'spirit',
  //   number: 63,
  //   name: 'The Message',
  //   genre: 'Christian',
  //   desc: 'Christian Pop & Rock',
  // },
  // {
  //   id: 'praise',
  //   number: 64,
  //   name: "Kirk Franklin's Praise",
  //   genre: 'Christian',
  //   desc: "Kirk Franklin's Gospel Channel",
  // },
  // {
  //   id: '8229',
  //   number: 65,
  //   name: 'enLighten',
  //   genre: 'Christian',
  //   desc: 'Southern Gospel',
  // },
  // {
  //   id: 'jazzcafe',
  //   number: 66,
  //   name: 'Watercolors',
  //   genre: 'Jazz/Standards',
  //   desc: 'Smooth/Contemporary Jazz',
  // },
  // {
  //   id: 'purejazz',
  //   number: 67,
  //   name: 'Real Jazz',
  //   genre: 'Jazz/Standards',
  //   desc: 'Classic Jazz',
  // },
  // {
  //   id: 'spa73',
  //   number: 68,
  //   name: 'Spa',
  //   genre: 'Jazz/Standards',
  //   desc: 'New Age',
  // },
  // {
  //   id: '8215',
  //   number: 69,
  //   name: 'Escape',
  //   genre: 'Jazz/Standards',
  //   desc: 'Easy Listening',
  // },
  // {
  //   id: 'siriusblues',
  //   number: 70,
  //   name: "BB King's Bluesville",
  //   genre: 'Jazz/Standards',
  //   desc: "B.B. King's Blues Channel",
  // },
  // {
  //   id: 'siriusly`sina`tra',
  //   number: 71,
  //   name: 'Siriusly Sinatra',
  //   genre: 'Jazz/Standards',
  //   desc: 'Standards By Sinatra & More',
  // },
  // {
  //   id: 'broadwaysbest',
  //   number: 72,
  //   name: 'On Broadway',
  //   genre: 'Jazz/Standards',
  //   desc: 'Show Tunes',
  // },
  // {
  //   id: '8205',
  //   number: 73,
  //   name: '40s Junction',
  //   genre: 'Jazz/Standards',
  //   desc: "'40s Pop Hits/Big Band",
  // },
  // {
  //   id: 'metropolitanopera',
  //   number: 74,
  //   name: 'Met Opera Radio',
  //   genre: 'Classical',
  //   desc: 'Opera/Classical Voices',
  // },
  // {
  //   id: 'symphonyhall',
  //   number: 76,
  //   name: 'Symphony Hall',
  //   genre: 'Classical',
  //   desc: 'Classical Music',
  // },
  // {
  //   id: 'rumbon',
  //   number: 158,
  //   name: 'Caliente',
  //   genre: 'Pop',
  //   desc: 'Tropical Latin Music',
  // },
  // {
  //   id: '9412',
  //   number: 300,
  //   name: 'Celebrate!',
  //   genre: 'Pop',
  //   desc: 'Happy Songs For A Celebration',
  // },
  // {
  //   id: '9415',
  //   number: 301,
  //   name: 'Road Trip Radio',
  //   genre: 'Pop',
  //   desc: 'Music to Drive to!',
  // },
  // {
  //   id: '9416',
  //   number: 302,
  //   name: 'The Covers Channel',
  //   genre: 'Pop',
  //   desc: '24/7 Cover Songs',
  // },
  // {
  //   id: '9419',
  //   number: 303,
  //   name: 'ONEderland',
  //   genre: 'Pop',
  //   desc: 'One-Hit Wonders, 24/7',
  // },
  {
    id: '9361',
    number: 304,
    name: 'Velvet',
    genre: 'Pop',
    desc: 'Today’s Pop Vocalists',
  },
  // {
  //   id: '9174',
  //   number: 310,
  //   name: 'Rock and Roll Hall of Fame Radio',
  //   genre: 'Rock',
  //   desc: 'Rock Hall Inducted Artists',
  // },
  // {
  //   id: '9175',
  //   number: 313,
  //   name: 'RockBar',
  //   genre: 'Rock',
  //   desc: 'Rock & Roll Jukebox Songs',
  // },
  // {
  //   id: '9413',
  //   number: 314,
  //   name: 'SiriusXM Turbo',
  //   genre: 'Rock',
  //   desc: "Hard Rock from the '90s/2000s",
  // },
  // {
  //   id: '9176',
  //   number: 316,
  //   name: 'SiriusXM Comes Alive!',
  //   genre: 'Rock',
  //   desc: 'Live Classic Rock',
  // },
  // {
  //   id: '9364',
  //   number: 330,
  //   name: 'SiriusXM Silk',
  //   genre: 'R&B',
  //   desc: 'Smooth R&B Love Songs',
  // },
  // {
  //   id: '9219',
  //   number: 340,
  //   name: "Tiësto's Club Life Radio",
  //   genre: 'Dance/Electronic',
  //   desc: "Tiësto's EDM Channel",
  // },
  // {
  //   id: '9365',
  //   number: 341,
  //   name: 'Utopia',
  //   genre: 'Dance/Electronic',
  //   desc: "'90s/2000s Dance Hits",
  // },
  // {
  //   id: '9178',
  //   number: 350,
  //   name: 'Red White & Booze',
  //   genre: 'Country',
  //   desc: 'Country Bar Songs',
  // },
  // {
  //   id: '8372',
  //   number: 700,
  //   name: 'Neil Diamond Radio',
  //   genre: 'Pop',
  //   desc: 'Neil Diamond, 24/7',
  // },
  // {
  //   id: '9362',
  //   number: 702,
  //   name: 'Elevations',
  //   genre: 'Pop',
  //   desc: 'Reimagined Pop & Rock Classics',
  // },
  // {
  //   id: '9378',
  //   number: 703,
  //   name: 'Oldies Party',
  //   genre: 'Pop',
  //   desc: 'Party Songs from the 50s & 60s',
  // },
  // {
  //   id: '9372',
  //   number: 704,
  //   name: '70s/80s Pop',
  //   genre: 'Pop',
  //   desc: "''70s & '80s Super Party Hits",
  // },
  // {
  //   id: '9373',
  //   number: 705,
  //   name: '80s/90s Pop',
  //   genre: 'Pop',
  //   desc: "'80s & '90s Party Hits",
  // },
  // {
  //   id: '9352',
  //   number: 712,
  //   name: "Tom Petty's Buried Treasure",
  //   genre: 'Rock',
  //   desc: 'Tom Petty’s Buried Treasure 24/7',
  // },
  // {
  //   id: '9447',
  //   number: 713,
  //   name: 'The Emo Project',
  //   genre: 'Rock',
  //   desc: 'Emotionally Driven Alt Rock',
  // },
  // {
  //   id: '9375',
  //   number: 715,
  //   name: 'Classic Rock Party',
  //   genre: 'Rock',
  //   desc: 'Non-Stop Classic Rock',
  // },
  // {
  //   id: '9139',
  //   number: 716,
  //   name: 'SiriusXM Limited Edition 2',
  //   genre: 'Rock',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '9353',
  //   number: 717,
  //   name: 'SiriusXM Limited Edition 3',
  //   genre: 'Rock',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '9397',
  //   number: 720,
  //   name: "Sway's Universe",
  //   genre: 'Hip-Hop',
  //   desc: "Sway's Lifestyle Channel XL",
  // },
  // {
  //   id: '9398',
  //   number: 721,
  //   name: 'SiriusXM Limited Edition 4',
  //   genre: 'Hip-Hop',
  //   desc: 'Home for limited-run channels XL',
  // },
  // {
  //   id: '9399',
  //   number: 726,
  //   name: 'SiriusXM Limited Edition 5',
  //   genre: 'R&B',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '9400',
  //   number: 730,
  //   name: 'SiriusXM Limited Edition 6',
  //   genre: 'Dance/Electronic',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '8227',
  //   number: 741,
  //   name: 'The Village',
  //   genre: 'Country',
  //   desc: 'Folk',
  // },
  // {
  //   id: '9401',
  //   number: 742,
  //   name: 'SiriusXM Limited Edition 7',
  //   genre: 'Country',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '9402',
  //   number: 745,
  //   name: 'SiriusXM Limited Edition 8',
  //   genre: 'Christian',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '8211',
  //   number: 750,
  //   name: 'Cinemagic',
  //   genre: 'Jazz/Standards',
  //   desc: 'Movie Soundtracks and More',
  // },
  // {
  //   id: '9179',
  //   number: 751,
  //   name: 'Krishna Das Yoga Radio',
  //   genre: 'Jazz/Standards',
  //   desc: 'Chant/Sacred/Spiritual Music',
  // },
  // {
  //   id: '9403',
  //   number: 752,
  //   name: 'SiriusXM Limited Edition 9',
  //   genre: 'Jazz/Standards',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: 'siriuspops',
  //   number: 755,
  //   name: 'SiriusXM Pops',
  //   genre: 'Classical',
  //   desc: 'Classical Pops',
  // },
  // {
  //   id: '9404',
  //   number: 756,
  //   name: 'SiriusXM Limited Edition 10',
  //   genre: 'Classical',
  //   desc: 'Home for limited-run channels',
  // },
  // {
  //   id: '9186',
  //   number: 761,
  //   name: 'Águila',
  //   genre: 'Latino',
  //   desc: 'Regional Mexican Music',
  // },
  // {
  //   id: '9188',
  //   number: 762,
  //   name: 'Caricia',
  //   genre: 'Latino',
  //   desc: 'Ballads in Spanish & English',
  // },
  // {
  //   id: '8225',
  //   number: 763,
  //   name: 'Viva',
  //   genre: 'Latino',
  //   desc: 'Modern Latin Pop & Ballads',
  // },
  // {
  //   id: '9187',
  //   number: 764,
  //   name: 'Latidos',
  //   genre: 'Latino',
  //   desc: 'Latin Love Songs',
  // },
  // {
  //   id: '9185',
  //   number: 765,
  //   name: 'Flow Nación',
  //   genre: 'Latino',
  //   desc: 'Latin Urban Music',
  // },
  // {
  //   id: '9189',
  //   number: 766,
  //   name: 'Luna',
  //   genre: 'Latino',
  //   desc: 'Latin Jazz',
  // },
  // {
  //   id: '9190',
  //   number: 767,
  //   name: 'Rumbón',
  //   genre: 'Latino',
  //   desc: 'Classic Salsa',
  // },
  // {
  //   id: '9191',
  //   number: 768,
  //   name: 'La Kueva',
  //   genre: 'Latino',
  //   desc: 'Latin Rock',
  // },
  // {
  //   id: '9342',
  //   number: 782,
  //   name: 'Holiday Traditions',
  //   genre: 'Pop',
  //   desc: 'Traditional Holiday Music',
  // },
  // {
  //   id: '9363',
  //   number: 791,
  //   name: 'Jason Ellis',
  //   genre: 'Rock',
  //   desc: 'Jason Ellis Show Nonstop XL',
  // },
];
