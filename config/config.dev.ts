module.exports = {
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
      logging: true,
    },
  },
  port: 5000,
  dsn: false,
};
