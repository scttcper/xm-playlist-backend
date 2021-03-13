import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('scrobble', table => {
    table.string('content_type', 8);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('scrobble', table => {
    table.dropColumn('content_type');
  });
}
