/* eslint-disable no-await-in-loop */
import debug from 'debug';
import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';

import { channels } from '../frontend/channels';
import { checkEndpoint, NoSongMarker, AlreadyScrobbled } from './sirius';
import config from '../config';
import { spotifyFindAndCache, SpotifyFailed } from './spotify';
import { findAndCacheLinks, FailedLinkFinding } from './linkfinder';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    log(`checking ${channel.name}`);
    try {
      const { track } = await checkEndpoint(channel);
      const spotify = await spotifyFindAndCache(track);
      await findAndCacheLinks(spotify);
    } catch (error) {
      await catchError(error);
    } finally {
      await delay(300);
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

  Sentry.captureException(error);
  return delay(2000).then(() => {
    process.exit(0);
  });
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  log('cron running');
  pForever(() => updateAll()).catch(async (e: Error) => catchError(e));
}
