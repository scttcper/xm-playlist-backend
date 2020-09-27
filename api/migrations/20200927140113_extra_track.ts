import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('track', table => {
    table.string('album', 250);
    table.string('itunes_id', 25);
    table.timestamp('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('track', table => {
    table.dropColumn('album');
    table.dropColumn('itunes_id');
    table.dropColumn('updated_at');
  });
}
