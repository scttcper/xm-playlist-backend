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

// module.exports = {
//   username: 'hon',
//   database: 'xm',
//   password: 'oRDERYmPYThyDRAwMARAmIDi',
//   db: {
//     host: 'supercop.crpujwt1a7km.us-west-1.rds.amazonaws.com',
//     dialect: 'postgres',
//     pool: {
//       max: 8,
//       min: 0,
//       idle: 2000,
//     },
//   },
//   token: 'TREKMEG2HHF0H9GH',
//   port: 5000,
//   dsn: false,
// };
