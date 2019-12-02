import debug from 'debug';
import { Dialect } from 'sequelize';

const log = debug('xmplaylist');
const env = process.env.NODE_ENV || 'test';
log(`Env: ${env}`);

let config = {
  username: '',
  database: 'xm',
  password: '',
  db: {
    host: 'localhost',
    dialect: 'postgres' as Dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 1000,
    },
  },
  port: 5000,
  dsn: '',
  host: 'http://localhost:5000',
  spotifyUsername: '',
  spotifyPassword: '',
  spotifyClientId: '',
  spotifyClientSecret: '',
  location: '',
  googleCredentials: '',
};

const filename = `./config.${env}`;
log(`Using: ${filename}`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imported = require(filename).default;
config = { ...config, ...imported };

export default config;
