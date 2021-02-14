import { createWriteStream } from 'pino-logflare';
import pino from 'pino';

import config from '../config';

// xmplaylist.api
export const apiLogger = pino(
  undefined,
  createWriteStream({
    apiKey: config.logflare,
    sourceToken: '8a504398-e7fa-44a3-a34a-cbc8b4e4ebb1',
    size: 10,
  }),
);

// xmplaylist.scanner
export const scannerLogger = pino(
  undefined,
  createWriteStream({
    apiKey: config.logflare,
    sourceToken: '9f9c3485-c9b4-48f5-8a4b-e12c33605b9b',
    size: 10,
  }),
);
