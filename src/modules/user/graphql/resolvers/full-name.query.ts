import { User } from '@/db/types';
import { GQL_UserResolvers, GQL_User } from '@/generated/graphql';
import { Selectable } from 'kysely';

export const fullNameResolver: GQL_UserResolvers['fullName'] = async (parent) => {
  const user = parent as GQL_User & Selectable<User>;
  const name = [user.firstName, user.middleName, user.lastName]
    .map((x) => (x ? x.trim() : ''))
    .filter((x) => x.trim())
    .join(' ');

  return name;
};
