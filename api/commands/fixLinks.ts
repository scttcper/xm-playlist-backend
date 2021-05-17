/* eslint-disable max-depth */
import _ from 'lodash';
import got from 'got';

import { getTrack } from '../src/track';
import { findAndCacheLinks } from '../src/linkfinder';
import { db } from '../src/db';
import { Spotify } from '../src/models';

const pageSize = 100;
const oops = 0;

async function refreshLinks(trackId) {
  const track = await getTrack(trackId);
  // whatever
  const spotify = {
    trackId: track.track.id,
    spotifyId: track.spotify.spotify_id,
    name: track.track.name,
    cover: '',
    previewUrl: '',
  } as any as Spotify;

  await db('links').delete().where('trackId', trackId).limit(1);
  await findAndCacheLinks(spotify);
}

async function main() {
  const total = await db('links').select().count();
  console.log({ total });

  for (const chunk of _.range(oops, total[0].count as number, pageSize)) {
    console.log({ chunk });
    const linkPage = await db('links').offset(chunk).orderBy('createdAt', 'asc').limit(pageSize);

    for (const link of linkPage) {
      const deezerObj = link.links.find(x => x.site === 'deezer');
      if (deezerObj) {
        try {
          const req = await got.head(deezerObj.url, {
            retry: 0,
            throwHttpErrors: false,
            timeout: 10000,
          });
          if (req.statusCode === 404) {
            console.log('404', link.trackId);
            refreshLinks(link.trackId);
          }
        } catch (e) {
          // pass
        }
      }
    }
  }
}

main()
  .then(() => process.exit())
  .catch(e => console.error(e));
