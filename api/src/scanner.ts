/* eslint-disable no-await-in-loop */
import debug from 'debug';
import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';
import { RequestError } from 'got';

import { channels } from '../../frontend/channels';
import { checkEndpoint, NoSongMarker, AlreadyScrobbled } from './sirius';
import config from '../config';
import { spotifyFindAndCache, SpotifyFailed } from './spotify';
import { findAndCacheLinks, FailedLinkFinding } from './linkfinder';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    // log(`checking ${channel.name}`);
    try {
      const tracks = await checkEndpoint(channel);
      for (const {track} of tracks) {
        const spotify = await spotifyFindAndCache(track);
        if (spotify) {
          await findAndCacheLinks(spotify);
        }
      }
    } catch (error) {
      catchError(error);
    } finally {
      await delay(400);
    }
  }
}

function catchError(error: Error) {
  if (error instanceof NoSongMarker) {
    return;
  }

  if (error instanceof AlreadyScrobbled) {
    return;
  }

  if (error instanceof SpotifyFailed) {
    return;
  }

  if (error instanceof FailedLinkFinding) {
    return;
  }

  if (error instanceof RequestError) {
    return;
  }

  console.error(error);
  Sentry.captureException(error);
  return;
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  pForever(async () => await updateAll().catch(catchError));

  // restart every 12 hours
  // const hours = 12;
  // setTimeout(() => {
  //   console.log('Restarting');
  //   process.exit(0);
  // }, 1000 * 60 * 60 * hours);
}
