import { Knex } from 'knex';

const TABLE_NAME = 'user_system_roles';

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);
  if (!tableExists) {
    await knex.schema.createTable(TABLE_NAME, (t) => {
      t.uuid('roleId').notNullable();
      t.uuid('userId').notNullable();

      t.foreign('roleId').references('system_roles.id');
      t.foreign('userId').references('users.id');

      t.unique(['roleId', 'userId']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
