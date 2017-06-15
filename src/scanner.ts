import * as debug from 'debug';

import { checkEndpoint } from './sirius';
import { channels } from './channels';

const log = debug('xmplaylist');

async function updateAll() {
  for (const channel of channels) {
    await checkEndpoint(channel);
  }
}

if (!module.parent) {
  log('cron running');
  setInterval(async () => await updateAll(), 10000);
}
