import * as debug from 'debug';

const log = debug('xmplaylist');
const env = process.env.NODE_ENV || 'test';
log(`Env: ${env}`);

let config = {
  username: '',
  database: 'xm',
  password: '',
  db: {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 1000,
    },
  },
  port: 5000,
  dsn: '',
  spotifyClientId: '',
  spotifyClientSecret: '',
};

const filename = `./config.${env}`;
log(`Using: ${filename}`);
const imported = require(filename);
config = { ...config, ...imported };

export default config;
