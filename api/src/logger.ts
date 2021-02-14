import { createWriteStream } from 'pino-logflare';
import pino from 'pino';

import config from '../config';

const stream = createWriteStream({
  apiKey: config.logflare,
  sourceToken: '26f6fec8-c608-4b53-bdc2-c31bc3415730',
  size: 10,
});
export const logger = pino(undefined, stream);
