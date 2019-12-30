/* eslint-disable no-await-in-loop */
import debug from 'debug';
import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';

import { channels } from '../frontend/channels';
import { checkEndpoint, NoSongMarker, AlreadyScrobbled } from './sirius';
import config from '../config';
import { spotifyFindAndCache } from './spotify';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    log(`checking ${channel.name}`);
    try {
      const { track } = await checkEndpoint(channel);
      await spotifyFindAndCache(track);
    } catch (error) {
      catchError(error);
    } finally {
      await delay(300);
    }
  }

  return updateAll();
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  log('cron running');
  pForever(() => updateAll()).catch((e: Error) => catchError(e));
}

function catchError(error: Error) {
  log(error.message);
  if (error instanceof NoSongMarker) {
    return;
  }

  if (error instanceof AlreadyScrobbled) {
    return;
  }

  Sentry.captureException(error);
  process.exit(0);
}
