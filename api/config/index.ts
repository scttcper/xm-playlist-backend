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
  logflare: '',
  cert: {} as any,
};

const filename = `./config.${env}`;
log(`Using: ${filename}`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const imported = require(filename).default;
config = { ...config, ...imported };

export default config;
