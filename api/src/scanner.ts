import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';
import { RequestError } from 'got';

import { channels } from '../../frontend/channels';
import config from '../config';
import { checkEndpoint } from './sirius';
import { spotifyFindAndCache, SpotifyFailed } from './spotify';
import { findAndCacheLinks, FailedLinkFinding } from './linkfinder';

async function updateAll() {
  for (const channel of channels) {
    // log(`checking ${channel.name}`);
    try {
      const results = await checkEndpoint(channel);
      for (const { track, scrobble } of results) {
        // Skip spotify for links, mostly ads
        if (scrobble.contentType === 'link') {
          continue;
        }

        const spotify = await spotifyFindAndCache(track, channel);
        await findAndCacheLinks(spotify);
      }
    } catch (error) {
      if (error instanceof SpotifyFailed) {
        continue;
      }

      if (error instanceof FailedLinkFinding) {
        continue;
      }

      catchError(error);
    } finally {
      await delay(250);
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
}
