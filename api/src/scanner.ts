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
    log(`checking ${channel.name}`);
    try {
      const tracks = await checkEndpoint(channel);
      for (const {track} of tracks) {
        const spotify = await spotifyFindAndCache(track);
        if (spotify) {
          await findAndCacheLinks(spotify);
        }
      }
    } catch (error) {
      await catchError(error);
    } finally {
      await delay(400);
    }
  }

  return updateAll();
}

async function catchError(error: Error) {
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
    console.error('Request Error');
    await delay(1000);
    return;
  }

  Sentry.captureException(error);
  console.error(error);
  return delay(2000).then(() => {
    process.exit(0);
  });
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  log('cron running');
  pForever(() => updateAll()).catch(async (e: Error) => catchError(e));

  // restart every 12 hours
  const hours = 12;
  setTimeout(() => {
    console.log('Restarting');
    process.exit(0);
  }, 1000 * 60 * 60 * hours);
}
