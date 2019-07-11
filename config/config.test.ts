module.exports = {
  username: '',
  database: 'xmtest',
  password: '',
  db: {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 1,
      idle: 1000,
    },
  },
  port: 5000,
  dsn: false,
  spotifyClientId: process.env.CLIENT_ID || '',
  spotifyClientSecret: process.env.CLIENT_SECRET || '',
  googleCredentials: process.env.GOOGLE_KEY || '',
};
