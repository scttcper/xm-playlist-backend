/* eslint-disable no-await-in-loop */
import debug from 'debug';
import delay from 'delay';
import pForever from 'p-forever';
import * as Sentry from '@sentry/node';

import { channels } from './channels';
import { checkEndpoint } from './sirius';
import config from '../config';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    await checkEndpoint(channel).catch((e: Error) => catchError(e));
    await delay(300);
  }

  return updateAll();
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  log('cron running');
  pForever(() => updateAll()).catch((e: Error) => catchError(e));
}

function catchError(err: Error) {
  log(err);
  Sentry.captureException(err);
  process.exit(0);
}
