import { Knex } from 'knex';
import { addTimeStamps } from '../helpers/add-timestamps';

const TABLE_NAME = 'users';

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema.createTable(TABLE_NAME, (t) => {
      t.uuid('id').primary();
      t.string('firstName').notNullable();
      t.string('middleName');
      t.string('lastName').notNullable();
      t.string('email').unique().notNullable();
      t.string('hash').notNullable();
    });
    await addTimeStamps(knex, TABLE_NAME, {
      createdAt: true,
      updatedAt: true,
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
