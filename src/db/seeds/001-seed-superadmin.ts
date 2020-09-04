import * as Knex from 'knex';
import { bcryptUtil } from '@app/utils';
import { UserModel, SystemRoleModel } from '@app/db/models';
import { PartialModelObject } from 'objection';

const USERS_TABLE_NAME = 'users';
const ROLES_TABLE_NAME = 'system_roles';
const USER_ROLES_TABLE_NAME = 'user_system_roles';

// tslint:disable-next-line: no-any
export async function seed(knex: Knex): Promise<any> {
  // Create Super Admin Role
  const superadminRole: PartialModelObject<SystemRoleModel> = {
    // Note:
    // If you plan to change the name of the superadmin role, make sure to change also the value in the SystemRole enum
    name: 'Super Administrator',
    description: 'Admin of all admins',
  };

  const createSuperadminRoleQuery = knex(ROLES_TABLE_NAME).insert([superadminRole]);
  const createSuperadminRoleQueryResult = await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createSuperadminRoleQuery]);

  // Create Super Admin User
  const defaultPassword = 'password';
  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(defaultPassword, salt);
  const superadmin: PartialModelObject<UserModel> = {
    hash,
    salt,
    username: 'superadmin',
    firstName: 'superadmin',
    lastName: 'sa',
    email: 'superadmin@app.com',
  };

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

  return;
}
