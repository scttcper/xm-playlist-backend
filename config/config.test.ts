export default {
  db: {
    client: 'postgresql',
    connection: {
      database: 'xmtest',
      user: 'postgres',
      password: '',
    },
  },
  dsn: false,
  spotifyClientId: process.env.CLIENT_ID || '',
  spotifyClientSecret: process.env.CLIENT_SECRET || '',
  googleCredentials: process.env.GOOGLE_KEY || '',
};
