import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('spotify', table => {
    table.boolean('lock').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable('spotify', table => {
    table.dropColumn('lock');
  });
}
