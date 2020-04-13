import * as Knex from 'knex';

const TABLE_NAME = 'system_role_permissions';

export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);
  if (!tableExists) {
    await knex.schema.createTable(TABLE_NAME, t => {
      t.uuid('roleId').notNullable();
      t.uuid('permissionId').notNullable();

      t.foreign('roleId').references('system_roles.id');
      t.foreign('permissionId').references('system_permissions.id');

      t.unique(['roleId', 'permissionId']);
    });
  }
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
