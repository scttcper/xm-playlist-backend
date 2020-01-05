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
