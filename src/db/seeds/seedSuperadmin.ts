import * as Knex from 'knex';
import { bcryptUtil } from '@app/utils';
import { User } from '../models';

const TABLE_NAME = 'users';

// tslint:disable-next-line: no-any
export async function seed(knex: Knex): Promise<any> {
  const defaultPassword = 'password';
  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(defaultPassword, salt);

  const superadmin = {
    hash,
    salt,
    username: 'superadmin',
    firstName: 'superadmin',
    lastName: 'sa',
    email: 'superadmin@app.com',
  } as User;

  const query = knex(TABLE_NAME).insert([superadmin]);

  return knex.raw('? ON CONFLICT DO NOTHING', [query]);
}
