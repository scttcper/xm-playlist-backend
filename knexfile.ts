module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'xmplaylist',
      user: 'postgres',
      password: '',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'xmplaylist',
      user: 'postgres',
      password: '',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
