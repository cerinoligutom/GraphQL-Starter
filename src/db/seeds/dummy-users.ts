import * as Knex from 'knex';
import { bcryptUtil } from '@app/utils';
import { User } from '../models';
import faker from 'faker';

const TABLE_NAME = 'users';

// tslint:disable-next-line: no-any
export async function seed(knex: Knex): Promise<any> {
  const defaultPassword = 'password';
  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(defaultPassword, salt);

  const query = knex(TABLE_NAME).insert(
    [...Array(2000)].fill(0).map<Partial<User>>(() => {
      return {
        hash,
        salt,
        username: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      };
    }),
  );

  return knex.raw('? ON CONFLICT DO NOTHING', [query]);
}
