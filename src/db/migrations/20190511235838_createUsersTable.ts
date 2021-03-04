import * as Knex from 'knex';
import { addTimeStamps } from '../helpers/add-timestamps';

const TABLE_NAME = 'users';

export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema
      .createTable(TABLE_NAME, (t) => {
        t.uuid('id').primary();
        t.string('firstName').notNullable();
        t.string('middleName');
        t.string('lastName').notNullable();
        t.string('email').unique().notNullable();
        t.string('hash').notNullable();
      })
      .then(async () => {
        await addTimeStamps(knex, TABLE_NAME, {
          createdAt: true,
          updatedAt: true,
        });
      });
  }
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
