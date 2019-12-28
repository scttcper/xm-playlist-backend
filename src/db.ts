import knex from 'knex';
import knexStringcase from 'knex-stringcase';

const options: knex.Config = {
  client: 'postgresql',
  connection: {
    database: 'xmplaylist',
    user: 'postgres',
    password: '',
  },
};

const stringcaseOptions = knexStringcase(options);
export const db = knex(stringcaseOptions);
