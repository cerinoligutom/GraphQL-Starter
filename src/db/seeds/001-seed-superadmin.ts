import { Knex } from 'knex';
import { bcryptUtil } from '@/utils';
import { UserModel, SystemRoleModel } from '@/db/models';
import { SystemRoleID } from '@/shared/constants';

export async function seed(knex: Knex): Promise<void> {
  // Create Super Admin Role

  const superadminRole = new SystemRoleModel();
  superadminRole.set({
    id: SystemRoleID.SUPER_ADMINISTRATOR,
    name: 'Super Administrator',
    description: 'The chosen ones',
  });

  await superadminRole.$query(knex).insertAndFetch().onConflict().ignore();

  // Create Super Admin User
  const defaultEmail = 'superadmin@app.com';
  const defaultPassword = 'password';
  const hash = await bcryptUtil.generateHash(defaultPassword);

  let superadmin = await UserModel.query(knex).findOne('email', defaultEmail);
  if (!superadmin) {
    superadmin = new UserModel();
    superadmin.set({
      hash,
      firstName: 'superadmin',
      lastName: 'sa',
      email: defaultEmail,
    });
  }
  await superadmin.$query(knex).insertAndFetch().onConflict().ignore();

  // Add Super Admin Role to Super Admin User

  await superadmin.$relatedQuery('roles', knex).relate(superadminRole).onConflict().ignore();
}
