import * as Knex from 'knex';

// tslint:disable-next-line: no-any
export async function up(knex: Knex): Promise<any> {
  await knex.raw('create extension if not exists "uuid-ossp"');
}

// tslint:disable-next-line: no-any
export async function down(knex: Knex): Promise<any> {
  await knex.raw('drop extension if exists "uuid-ossp"');
}
