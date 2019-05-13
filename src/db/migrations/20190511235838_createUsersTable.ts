import * as Knex from 'knex';
import { TableNames } from '../table-names';
import { addTimeStamps } from '../helpers/addTimeStamps';

// tslint:disable-next-line: no-any
export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TableNames.Users);

  if (!tableExists) {
    await knex.schema
      .createTable(TableNames.Users, t => {
        t.uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('firstName').notNullable();
        t.string('middleName');
        t.string('lastName').notNullable();
        t.string('username')
          .unique()
          .notNullable();
        t.string('email')
          .unique()
          .notNullable();
        t.string('hash').notNullable();
        t.string('salt').notNullable();
      })
      .then(async () => {
        await addTimeStamps(knex, TableNames.Users);
      });
  }
}

// tslint:disable-next-line: no-any
export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TableNames.Users);
}
