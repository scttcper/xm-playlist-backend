import debug from 'debug';

const log = debug('xmplaylist');
const env = process.env.NODE_ENV || 'test';
log(`Env: ${env}`);

let config = {
  db: {
    client: 'postgresql',
    connection: {
      database: 'xmplaylist',
      user: 'postgres',
      password: '',
    },
  },
  dsn: '',
  spotifyUsername: '',
  spotifyPassword: '',
  spotifyClientId: '',
  spotifyClientSecret: '',
  location: '',
  googleCredentials: '',
};

const filename = `./config.${env}`;
log(`Using: ${filename}`);
const imported = require(filename).default;
config = { ...config, ...imported };

export default config;
