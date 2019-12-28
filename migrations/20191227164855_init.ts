import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('track', table => {
    table.integer('id').unsigned().primary();
    table.string('name', 200).notNullable();
    table.jsonb('artists').defaultTo('[]');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  knex.schema.createTable('plays', table => {
    table.uuid('id').primary();
    table.integer('track_id').references('track.id');
    table.string('name', 120).unique();
    table.timestamp('start_time');
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('track');
}
