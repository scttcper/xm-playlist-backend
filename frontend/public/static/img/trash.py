#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import re

channels = [{"id":"siriushits1","deeplink":"SiriusXMHits1","number":2,"name":"SiriusXM Hits 1","genre":"pop","desc":"Today\'s Pop Hits","playlist":"40al90DcGyME5Hri3nxE9P"},{"id":"9492","deeplink":"PandoraNow","number":3,"name":"Pandora Now","genre":"pop","desc":"Today\'s trending hits from Pandora","playlist":"2UHgiiLbPUHFPo1ivAn1mf"},{"id":"9500","deeplink":"SoulCycleRadio","number":4,"name":"SoulCycle Radio","genre":"pop","desc":"Music to energize your soul","playlist":"2dVvfQeglS3iyR7LVWN92w"},{"id":"9389","deeplink":"Venus","number":303,"name":"Venus","genre":"pop","desc":"Pop Music You Can Move To","playlist":"5EMlxbEmQpcA9bMDZawvfN"},{"id":"9406","deeplink":"PitbullsGlobalization","number":13,"name":"Pitbull\'s Globalization","genre":"pop","desc":"Worldwide Rhythmic Hits","playlist":"6WV3W3FH1mgK9Ao3mRlsdW"},{"id":"siriusgold","deeplink":"50son5","number":5,"name":"\'50s on 5","genre":"pop","desc":"\'50s Pop Hits","playlist":"0MQHK3oxSSaqQgIEd7sqCm"},{"id":"60svibrations","deeplink":"60son6","number":6,"name":"\'60s on 6","genre":"pop","desc":"\'60s Pop Hits w/ Cousin Brucie","playlist":"1TKPtgYaVx2XXDHyXG8vTr"},{"id":"totally70s","deeplink":"70son7","number":7,"name":"\'70s on 7","genre":"pop","desc":"\'70s Pop Hits","playlist":"54XRfhXgr5N5QT4LRJ5Elf"},{"id":"big80s","deeplink":"80son8","number":8,"name":"\'80s on 8","genre":"pop","desc":"\'80s Pop Hits","playlist":"47uqNTJniFyzXf5UMli4E7"},{"id":"8206","deeplink":"90son9","number":9,"name":"\'90s on 9","genre":"pop","desc":"\'90s Pop Hits","playlist":"3sZC2O1CF7b32afyxMohFs"},{"id":"8208","deeplink":"Pop2K","number":10,"name":"Pop2K","genre":"pop","desc":"2000s Pop Hits","playlist":"0ho4C6Yj4EYJSpiFgwzXWC"},{"id":"coffeehouse","deeplink":"TheCoffeeHouse","number":14,"name":"The Coffee House","genre":"pop","desc":"Acoustic/Singer-Songwriters","playlist":"6KzgIcb4jxpU7dgq5WVJA1"},{"id":"thepulse","deeplink":"ThePulse","number":15,"name":"The Pulse","genre":"pop","desc":"Adult Pop Hits","playlist":"1B8WYlu9LA5yDm3mPilKnK"},{"id":"starlite","deeplink":"TheBlend","number":16,"name":"The Blend","genre":"pop","desc":"Bright Pop Hits","playlist":"4U1w1DNhpN6Y8ZvxvJpwn0"},{"id":"9450","deeplink":"PopRocks","number":17,"name":"PopRocks","genre":"pop","desc":"Rock & Pop from the \'90s & 2Ks","playlist":"1PcSu1p5PaLOssq9VnW30g"},{"id":"9446","deeplink":"TheBeatlesChannel","number":18,"name":"The Beatles Channel","genre":"rock","desc":"It\'s the beatles","playlist":"4EGCtCsXlFrNpDs9BXcnGS"},{"id":"elvisradio","deeplink":"ElvisRadio","number":19,"name":"Elvis Radio","genre":"rock","desc":"Elvis 24/7 Live from Graceland","playlist":"37QyH0bSkU4GIdVNCgwMSq"},{"id":"estreetradio","deeplink":"EStreetRadio","number":20,"name":"E Street Radio","genre":"rock","desc":"Bruce Springsteen, 24/7","playlist":"1BotIEv0DM0TpRGCbHRmal"},{"id":"undergroundgarage","deeplink":"UndergroundGarage","number":21,"name":"Underground Garage","genre":"rock","desc":"Little Steven\'s Garage Rock","playlist":"1CRqLRDsoD0PJOJa4M87F4"},{"id":"8370","deeplink":"PearlJamRadio","number":22,"name":"Pearl Jam Radio","genre":"rock","desc":"Pearl Jam 24/7","playlist":"6ek7nnWygaVFEvbLi35nWT"},{"id":"gratefuldead","deeplink":"GratefulDead","number":23,"name":"Grateful Dead Channel","genre":"rock","desc":"Grateful Dead, 24/7","playlist":"2nLYX0Copv5u58VBUymo2d"},{"id":"radiomargaritaville","deeplink":"RadioMargaritaville","number":24,"name":"Radio Margaritaville","genre":"rock","desc":"Escape to Margaritaville","playlist":"0JwUOCX909iPq2sk8mgtAU"},{"id":"classicrewind","deeplink":"ClassicRewind","number":25,"name":"Classic Rewind","genre":"rock","desc":"\'70s/\'80s Classic Rock","playlist":"7vTtnf3vjVvzvlCMGOrWyC"},{"id":"classicvinyl","deeplink":"ClassicVinyl","number":26,"name":"Classic Vinyl","genre":"rock","desc":"\'60s/\'70s Classic Rock","playlist":"78n3FrbkunJt6IH5TUZ8Ni"},{"id":"thevault","deeplink":"DeepTracks","number":27,"name":"Deep Tracks","genre":"rock","desc":"Deep Classic Rock","playlist":"54uqMB4L3mmKJnxY8suNjZ"},{"id":"thespectrum","deeplink":"TheSpectrum","number":28,"name":"The Spectrum","genre":"rock","desc":"New Rock Meets Classic Rock","playlist":"5wf2VnbUFSaOENW4NzL4Id"},{"id":"jamon","deeplink":"JamOn","number":29,"name":"Jam On","genre":"rock","desc":"Jam Bands","playlist":"5HwDqrfXSHmDcKrhOX38jP"},{"id":"8207","deeplink":"TheLoft","number":30,"name":"The Loft","genre":"rock","desc":"Eclectic Rock","playlist":"5SnpYIF1lrdv5pM9GYhpgJ"},{"id":"9407","deeplink":"TomPettyRadio","number":31,"name":"Tom Petty Radio","genre":"rock","desc":"Music Curated by Tom Petty","playlist":"0G2ZTnmGv2slp2vNszb5C0"},{"id":"thebridge","deeplink":"TheBridge","number":32,"name":"The Bridge","genre":"rock","desc":"Mellow Rock","playlist":"0NHFhSjOzj6WqKC35hnq3e"},{"id":"firstwave","deeplink":"1stWave","number":33,"name":"1st Wave","genre":"rock","desc":"\'80s Alternative/New Wave","playlist":"5PirJdWNH0K8FecVmIZDog"},{"id":"90salternative","deeplink":"Lithium","number":34,"name":"Lithium","genre":"rock","desc":"\'90s Alternative/Grunge","playlist":"0NSVcRasPeL716J4CCA4sX"},{"id":"leftofcenter","deeplink":"SiriusXMU","number":35,"name":"SiriusXMU","genre":"rock","desc":"New Indie Rock","playlist":"2dUxEz8plLylyhIpa9ERXT"},{"id":"altnation","deeplink":"AltNation","number":36,"name":"Alt Nation","genre":"rock","desc":"New Alternative Rock","playlist":"2D0rRuf9aL6W8xRZ7Gbzpn"},{"id":"octane","deeplink":"Octane","number":37,"name":"Octane","genre":"rock","desc":"New Hard Rock","playlist":"4uEfLey0UZfmEp4vobm378"},{"id":"buzzsaw","deeplink":"OzzysBoneyard","number":38,"name":"Ozzy\'s Boneyard","genre":"rock","desc":"Ozzy\'s Classic Hard Rock","playlist":"3v2ddXnIRIq8A33FQH2DaJ"},{"id":"hairnation","deeplink":"HairNation","number":39,"name":"Hair Nation","genre":"rock","desc":"\'80s Hair Bands","playlist":"1lsFTg8ohGiqf1JHnwIrmB"},{"id":"hardattack","deeplink":"LiquidMetal","number":40,"name":"Liquid Metal","genre":"rock","desc":"Heavy Metal-XL","playlist":"002KgHoHT4zKaarhGgpWhu"},{"id":"9413","deeplink":"SiriusXMTurbo","number":41,"name":"SiriusXM Turbo","genre":"rock","desc":"Hard Rock from the \'90s/2000s","playlist":"2rXLvsVeVTcpZrbesfRxFw"},{"id":"reggaerhythms","deeplink":"TheJoint","number":42,"name":"The Joint","genre":"rnb","desc":"Reggae","playlist":"3unI3vzoWlLSJzoeitejbC"},{"id":"9471","deeplink":"RockTheBellsRadio","number":43,"name":"Rock The Bells Radio","genre":"hiphop","desc":"Classic Hip-Hop-XL","playlist":"6dJf2NJOX1l0mWoXFf1Hki"},{"id":"hiphopnation","deeplink":"HipHopNation","number":44,"name":"Hip-Hop Nation","genre":"hiphop","desc":"Today\'s Hip-Hop Hits-XL","playlist":"1gjLA07Y6zdKtSdGx4NR0f"},{"id":"shade45","deeplink":"Shade45","number":45,"name":"Shade 45","genre":"hiphop","desc":"Eminem\'s Hip-Hop Channel XL","playlist":"0p3t02TwsD8urU3ZNqVfMp"},{"id":"hotjamz","deeplink":"TheHeat","number":46,"name":"The Heat","genre":"rnb","desc":"Today\'s R&B Hits","playlist":"0S2qEvq6d9pDwmhdHSSNIy"},{"id":"9339","deeplink":"SiriusXMFLY","number":47,"name":"SiriusXM FLY","genre":"rnb","desc":"\'90s & 2000s Hip-Hop/R&B - XL","playlist":"4iCBk59izwYcvP4pzplQLg"},{"id":"heartandsoul","deeplink":"HeartSoul","number":48,"name":"Heart & Soul","genre":"rnb","desc":"Adult R&B Hits","playlist":"0tXm5JR4g1T1LedqkCRQzi"},{"id":"soultown","deeplink":"SoulTown","number":49,"name":"Soul Town","genre":"rnb","desc":"Classic Soul/Motown","playlist":"2YAUKtfO6ZusVfqlWmjqJO"},{"id":"8228","deeplink":"TheGroove","number":50,"name":"The Groove","genre":"rnb","desc":"\'70s/\'80s R&B","playlist":"0U3AEZcxXPCKYXimd8C3KE"},{"id":"thebeat","deeplink":"BPM","number":51,"name":"BPM","genre":"electronic","desc":"Electronic Dance Music Hits","playlist":"7DEiHntTkFb4TcJcRCJhL0"},{"id":"9472","deeplink":"DiplosRevolution","number":52,"name":"Diplo\'s Revolution","genre":"electronic","desc":"Top Rhythmic Music","playlist":"5HpCrxQKRXg7YnYBdBY4eT"},{"id":"chill","deeplink":"SiriusXMChill","number":53,"name":"SiriusXM Chill","genre":"electronic","desc":"Downtempo/Deep House","playlist":"4zCgB1d2enUh63CdekFeij"},{"id":"9481","deeplink":"StayHomeRadio","number":707,"name":"Stay Home Radio","genre":"pop","desc":"Happy and uplifting music","playlist":"64lWquJHXpq3L5Qh0DFunN"},{"id":"9482","deeplink":"Calm","number":68,"name":"Calm","genre":"electronic","desc":"Calm","playlist":"2rhZEcbqsFoHmFR2QnQlrv"},{"id":"9145","deeplink":"Studio54Radio","number":54,"name":"Studio 54 Radio","genre":"electronic","desc":"\'70s-2000s Dance Hits","playlist":"2gKrN0ChUDzaWkTpmvgsDf"},{"id":"9421","deeplink":"TheGarthChannel","number":55,"name":"The Garth Channel","genre":"country","desc":"Garth\'s Own Channel, 24/7","playlist":"1F3Y68SEvPruvDQ9P1wICu"},{"id":"newcountry","deeplink":"TheHighway","number":56,"name":"The Highway","genre":"country","desc":"Today\'s Country Hits","playlist":"1NEhiGacNUMoSdH4pI73yr"},{"id":"9418","deeplink":"NoShoesRadio","number":57,"name":"No Shoes Radio","genre":"country","desc":"Kenny Chesney\'s Music Channel","playlist":"6MQ1c1ixTNbgP74sMJASgm"},{"id":"primecountry","deeplink":"PrimeCountry","number":58,"name":"Prime Country","genre":"country","desc":"\'80s/\'90s Country Hits","playlist":"7jnOANbKO2EHLg4bjCD4IO"},{"id":"theroadhouse","deeplink":"WilliesRoadhouse","number":59,"name":"Willie\'s Roadhouse","genre":"country","desc":"Willie\'s Classic Country","playlist":"0VTk5reFEU3RCTFMJsepOF"},{"id":"outlawcountry","deeplink":"OutlawCountry","number":60,"name":"Outlaw Country","genre":"country","desc":"Rockin\' Country Rebels","playlist":"7q3kzMhlxwd9eoo9ZCPfSq"},{"id":"9340","deeplink":"Y2Kountry","number":61,"name":"Y2Kountry","genre":"country","desc":"2000s Country Hits","playlist":"5anBQRaNx5vSG3x6ia0VpX"},{"id":"bluegrass","deeplink":"BluegrassJunction","number":62,"name":"Bluegrass Junction","genre":"country","desc":"Bluegrass","playlist":"3RzhOj8Kj2EtF6fiObNNvi"},{"id":"spirit","deeplink":"TheMessage","number":63,"name":"The Message","genre":"christian","desc":"Christian Pop & Rock","playlist":"0WYpaAG3IBHOAxU3biDqn5"},{"id":"praise","deeplink":"KirkFranklinsPraise","number":64,"name":"Kirk Franklin\'s Praise","genre":"christian","desc":"Kirk Franklin\'s Gospel Channel","playlist":"7HDMsQitItAZ3IhIai9YIe"},{"id":"8229","deeplink":"enLighten","number":65,"name":"enLighten","genre":"christian","desc":"Southern Gospel","playlist":"3paZb4U6gZRmUflLaY3sbE"},{"id":"jazzcafe","deeplink":"Watercolors","number":66,"name":"Watercolors","genre":"jazz","desc":"Smooth/Contemporary Jazz","playlist":"74UCWlZbDE50BAfsebS45P"},{"id":"purejazz","deeplink":"RealJazz","number":67,"name":"Real Jazz","genre":"jazz","desc":"Classic Jazz","playlist":"3mDuSPlntj533CvZXvMnDS"},{"id":"spa73","deeplink":"Spa","number":295,"name":"Spa","genre":"jazz","desc":"New Age","playlist":"6nDBgy12A29JltPBr9dhH9"},{"id":"8215","deeplink":"Escape","number":69,"name":"Escape","genre":"jazz","desc":"Easy Listening","playlist":"5nU2RzjetBRSdXEqv5VYOR"},{"id":"siriusblues","deeplink":"BBKingsBluesville","number":70,"name":"BB King\'s Bluesville","genre":"jazz","desc":"B.B. King\'s Blues Channel","playlist":"3rDJ69lqvGnZFr9VMlhhJJ"},{"id":"siriuslysinatra","deeplink":"SiriuslySinatra","number":71,"name":"Siriusly Sinatra","genre":"jazz","desc":"Standards By Sinatra & More","playlist":"0IJZ61tFSoZuhwtM7ENPzt"},{"id":"symphonyhall","deeplink":"SymphonyHall","number":76,"name":"Symphony Hall","genre":"classical","desc":"Classical Music","playlist":"4KdXsNll67tp8qsp8wT0jF"},{"id":"rumbon","deeplink":"Caliente","number":158,"name":"Caliente","genre":"pop","desc":"Hot Latin Hits","playlist":"6v3yXVN8Jl5UJwK7Dc5N2u"},{"id":"yachtrockradio","deeplink":"YachtRockRadio","number":178,"name":"Yacht Rock Radio","genre":"rock","desc":"\'70s/\'80s Smooth-Sailing Soft Rock","playlist":"0iEg6jD6Bappj9Ed7txsAp"},{"id":"9412","deeplink":"Celebrate","number":718,"name":"Celebrate!","genre":"pop","desc":"Happy Songs For A Celebration","playlist":"2pYWStfTTBmOU1SnyiBoOe"},{"id":"9415","deeplink":"RoadTripRadio","number":301,"name":"Road Trip Radio","genre":"pop","desc":"Music to Drive to!","playlist":"07GjrjDZV4egbvK15AYoR6"},{"id":"9361","deeplink":"Velvet","number":304,"name":"Velvet","genre":"pop","desc":"Today’s Pop Vocalists","playlist":"0rO5UkNWpDLOCPgBZdHNfK"},{"id":"9174","deeplink":"SXMRockHallRadio","number":310,"name":"Rock and Roll Hall of Fame Radio","genre":"rock","desc":"Rock Hall Inducted Artists","playlist":"4SnTpLzCwnwQxzPmOrYwRf"},{"id":"9175","deeplink":"RockBar","number":313,"name":"RockBar","genre":"rock","desc":"Rock & Roll Jukebox Songs","playlist":"2USB8PHJQnDKzlY3XchbYp"},{"id":"faction","deeplink":"FactionPunk","number":314,"name":"Faction Punk","genre":"rock","desc":"Punk & Beats w/ Jason Ellis XL","playlist":"3HRoF7JJ3UcyRoc49eGNpZ"},{"id":"9176","deeplink":"SiriusXMComesAlive","number":316,"name":"SiriusXM Comes Alive!","genre":"rock","desc":"Live Classic Rock","playlist":"2XYFWA88EEK3szMesnXBJs"},{"id":"9364","deeplink":"SiriusXMSilk","number":330,"name":"SiriusXM Silk","genre":"rnb","desc":"Smooth R&B Love Songs","playlist":"3OxxBFDjqm5QIZNn0pOeSJ"},{"id":"9365","deeplink":"Utopia","number":341,"name":"Utopia","genre":"electronic","desc":"\'90s/2000s Dance Hits","playlist":"3FEpFULHGJMO8a9Khm0ZG7"},{"id":"9178","deeplink":"RedWhiteBooze","number":350,"name":"Red White & Booze","genre":"country","desc":"Country Bar Songs","playlist":"0vBFF5hqInc8S1riqCAgfr"},{"id":"9404","deeplink":"CarolinaShagRadio","number":701,"name":"Carolina Shag Radio","genre":"pop","desc":"Carolina R&B Beach Music","playlist":"4sa4rgNUYdVj53WPOOoLUA"},{"id":"9419","deeplink":"ONEderland","number":702,"name":"ONEderland","genre":"pop","desc":"One-Hit Wonders, 24/7","playlist":"63HilGW4VxiBs2dZC1OTCE"},{"id":"9362","deeplink":"Elevations","number":702,"name":"Elevations","genre":"pop","desc":"Reimagined Pop & Rock Classics","playlist":"60gIBD04pALn7z0USgo1Kx"},{"id":"9378","deeplink":"OldiesParty","number":703,"name":"Oldies Party","genre":"pop","desc":"Party Songs from the 50s & 60s","playlist":"6dMdtesN5GCJdY6CI2fwZC"},{"id":"9373","deeplink":"80s90sPop","number":705,"name":"80s/90s Pop","genre":"pop","desc":"\'80s & \'90s Party Hits","playlist":"5tWH2KZxXUYEZwDRg9VywX"},{"id":"9447","deeplink":"TheEmoProject","number":713,"name":"The Emo Project","genre":"rock","desc":"Emotionally Driven Alt Rock","playlist":"78boQ0amoXinbWAbBWGgpd"},{"id":"9451","deeplink":"Indie10","number":714,"name":"Indie 1.0","genre":"rock","desc":"First-generation Indie Rock","playlist":"1D8g8Vvz4qr3jtlTYJuX1x"},{"id":"9375","deeplink":"ClassicRockParty","number":715,"name":"Classic Rock Party","genre":"rock","desc":"Non-Stop Classic Rock","playlist":"19DiREdiropsGcjcNIXFY8"},{"id":"8227","deeplink":"TheVillage","number":741,"name":"The Village","genre":"country","desc":"Folk","playlist":"62Wpb6cKV5NFuZjTpuKawj"},{"id":"9186","deeplink":"Aguila","number":761,"name":"Águila","genre":"latino","desc":"Regional Mexican Music","playlist":"0WRHaBdzi7LucUaZ9Eto5b"},{"id":"8225","deeplink":"Viva","number":763,"name":"Viva","genre":"latino","desc":"Modern Latin Pop & Ballads","playlist":"6wC4Kr9NK5sSKINGGqEDhq"},{"id":"9187","number":764,"deeplink":"Latidos","name":"Latidos","genre":"latino","desc":"Latin Love Songs","playlist":"02zY0UVXtSCA8boGxQjwlF"},{"id":"9185","number":765,"deeplink":"FlowNacion","name":"Flow Nación","genre":"latino","desc":"Latin Urban Music","playlist":"4c4IxB5XpHC7jOk8waDaNk"},{"id":"9189","number":766,"deeplink":"Luna","name":"Luna","genre":"latino","desc":"Latin Jazz","playlist":"3WmVgs0QfIxPRERYuNg3s1"},{"id":"9190","number":767,"deeplink":"Rumbon","name":"Rumbón","genre":"latino","desc":"Classic Salsa","playlist":"0onanEy3SOLW14YUuPsAyw"},{"id":"9191","number":768,"deeplink":"LaKueva","name":"La Kueva","genre":"latino","desc":"Latin Rock","playlist":"383VxcqOpZcmz4lbMNkNiv"},{"id":"8216","deeplink":"KidsPlaceLive","number":903,"name":"Kids Place Live","genre":"kids","desc":"Kids\' Music","playlist":"0Qu2crzuwmYxi7IjZeDrJ6"},{"id":"9366","deeplink":"KIDZBOPRadio","number":900,"name":"KIDZ BOP Radio","genre":"kids","desc":"Pop Hits Sung By Kids For Kids","playlist":"7kMH8fsSB44c25CiED3PQL"},{"id":"9342","deeplink":"HolidayTraditions","number":782,"name":"Holiday Traditions","genre":"pop","desc":"Traditional Holiday Music","playlist":"6CuCQZ5cksOpuLGm1kOI89"},{"id":"bluecollarcomedy","deeplink":"ComedyRoundup","number":97,"name":"Comedy Roundup","genre":"comedy","desc":"Great American Comedy","playlist":"3LKURR6gd0q7j298ZDKqWn"},{"id":"9494","deeplink":"NetflixIsAJokeRadio","number":93,"name":"Netflix Is A Joke Radio","genre":"comedy","desc":"Ad-free Netflix standup","playlist":"4k4VSPD2zorw1HGRgvTY53"},{"id":"9408","deeplink":"SiriusXMComedyGreats","number":94,"name":"SiriusXM Comedy Greats","genre":"comedy","desc":"All-Time Greatest Comedians XL","playlist":"06JTWY48k6CQxJrfKn4bWe"},{"id":"9356","deeplink":"ComedyCentralRadio","number":95,"name":"Comedy Central Radio","genre":"comedy","desc":"Comedy Central Uncensored XL","playlist":"0iBXjXfvBVGe9NEVYyLwwR"},{"id":"9469","deeplink":"KevinHartsLaughOutLoudRadio","number":96,"name":"KevinHart Laugh Out Loud","genre":"comedy","desc":"Comedy & Shows w/Kevin Hart-XL","playlist":"0Uh7YsOisgn6tfm4pt3cvD"},{"id":"laughbreak","deeplink":"LaughUSA","number":98,"name":"Laugh USA","genre":"comedy","desc":"Comedy For The Entire Family","playlist":"4ASNqTcjhkhFtOjXFZliix"},{"id":"rawdog","deeplink":"RawDogComedy","number":99,"name":"Raw Dog Comedy","genre":"comedy","desc":"The Best Uncensored Comedy XL","playlist":"6qlAVjDpxjnfQqEnjUpMEp"},{"id":"8259","deeplink":"JustForLaughsCanada","number":168,"name":"Just For Laughs Canada","genre":"comedy","desc":"JUST FOR LAUGHS CANADA","playlist":"7AxlfnSgRtvk1SPwz5h6Bb"},{"id":"9503","deeplink":"ShesSoFunny","number":771,"name":"She\'s So Funny","genre":"comedy","desc":"The Funniest Female Comedians","playlist":"2nOk54j5r7lZjBXj5SVQTV"},{"id":"9398","deeplink":"Top1000Countdowns","number":177,"name":"Top 1000 Countdowns","genre":"pop","desc":"Top 1000 Countdowns","playlist":"6GCnMjegMN32SzrgdE6jKY"},{"id":"icebergradio","deeplink":"Iceberg","number":177,"name":"Top 1000 Countdowns","genre":"pop","desc":"Top 1000 Countdowns","playlist":"6GCnMjegMN32SzrgdE6jKY"}]

for channel in channels:
  pattern = re.compile(r'\W+');
  deepLink = channel['deeplink']
  print(deepLink)
  response = requests.get(f"http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink?deepLinkId={deepLink}&deepLink-type=live").json()
  images = response["ModuleListResponse"]["moduleList"]["modules"][0]["moduleResponse"]["moduleDetails"]["liveChannelResponse"]["liveChannelResponses"][0]["channel"]["images"]["images"]
  for image in images:
    if image['name'] == "color channel logo (on dark) ~ square":
      r = requests.get(image['url'], allow_redirects=True)
      open(f'{deepLink}-lg.png', 'wb').write(r.content)
    # if image['name'] == "list view channel logo ~ square":
    #   r = requests.get(image['url'], allow_redirects=True)
    #   open(f'{deepLink}.png', 'wb').write(r.content)
    # if image['name'] == "white logo":
    #   r = requests.get(image['url'], allow_redirects=True)
    #   open(f'{deepLink}-white.png', 'wb').write(r.content)
