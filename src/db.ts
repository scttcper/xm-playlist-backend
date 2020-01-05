import knex from 'knex';
import knexStringcase from 'knex-stringcase';

import config from '../config';

const stringcaseOptions = knexStringcase(config.db);
export const db = knex(stringcaseOptions);
