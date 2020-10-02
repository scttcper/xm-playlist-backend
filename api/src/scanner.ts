/* eslint-disable max-depth */
import debug from 'debug';
import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';
import { RequestError } from 'got';

import { channels } from '../../frontend/channels';
import config from '../config';
import { checkEndpoint } from './sirius';
import { spotifyFindAndCache, SpotifyFailed } from './spotify';
import { findAndCacheLinks, FailedLinkFinding } from './linkfinder';
import { Spotify } from './models';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    // log(`checking ${channel.name}`);
    try {
      const tracks = await checkEndpoint(channel);
      for (const { track } of tracks) {
        let spotify: Spotify;
        try {
          spotify = await spotifyFindAndCache(track);
        } catch (error) {
          if (error instanceof SpotifyFailed) {
            continue;
          }

          throw error;
        }

        if (spotify) {
          try {
            await findAndCacheLinks(spotify);
          } catch (error) {
            if (error instanceof FailedLinkFinding) {
              continue;
            }

            throw error;
          }
        }
      }
    } catch (error) {
      catchError(error);
    } finally {
      await delay(300);
    }
  }
}

function catchError(error: Error) {
  if (error instanceof RequestError) {
    return;
  }

  console.error(error);
  Sentry.captureException(error);
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  pForever(async () => updateAll().catch(catchError));

  // restart every 12 hours
  // const hours = 12;
  // setTimeout(() => {
  //   console.log('Restarting');
  //   process.exit(0);
  // }, 1000 * 60 * 60 * hours);
}
