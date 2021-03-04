import * as Knex from 'knex';
import { bcryptUtil } from '@/utils';
import { UserModel, SystemRoleModel } from '@/db/models';
import { SystemRoleID } from '@/shared/enums';

const USERS_TABLE_NAME = 'users';
const ROLES_TABLE_NAME = 'system_roles';
const USER_ROLES_TABLE_NAME = 'user_system_roles';

export async function seed(knex: Knex): Promise<any> {
  // Create Super Admin Role

  const superadminRole = new SystemRoleModel();
  superadminRole.set({
    id: SystemRoleID.SUPER_ADMINISTRATOR,
    name: 'Super Administrator',
    description: 'The chosen ones',
  });

  const createSuperadminRoleQuery = knex(ROLES_TABLE_NAME).insert([superadminRole]);
  const createSuperadminRoleQueryResult = await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createSuperadminRoleQuery]);

  // Create Super Admin User
  const defaultPassword = 'password';
  const hash = await bcryptUtil.generateHash(defaultPassword);

  const superadmin = new UserModel();
  superadmin.set({
    hash,
    firstName: 'superadmin',
    lastName: 'sa',
    email: 'superadmin@app.com',
  });

  const createSuperadminUserQuery = knex(USERS_TABLE_NAME).insert([superadmin]);
  const createSuperadminUserQueryResult = await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createSuperadminUserQuery]);

  // Skip the association of the records if one of the query result has a row count of 0.
  if (!createSuperadminRoleQueryResult.rowCount || !createSuperadminUserQueryResult.rowCount) {
    // This simply means this has been done before so it's okay to skip.
    return;
  }

  // Otherwise, Associate superadmin role to superadmin user
  const {
    rows: [{ id: superadminRoleId }],
  } = createSuperadminRoleQueryResult;

  const {
    rows: [{ id: superadminUserId }],
  } = createSuperadminUserQueryResult;

  const assignRoleToUserQuery = knex(USER_ROLES_TABLE_NAME).insert([
    {
      roleId: superadminRoleId,
      userId: superadminUserId,
    },
  ]);
  await knex.raw('? ON CONFLICT DO NOTHING', [assignRoleToUserQuery]);
}
