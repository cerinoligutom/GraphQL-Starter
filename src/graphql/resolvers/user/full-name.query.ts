import { GQL_UserResolvers, GQL_User } from 'graphql-resolvers';
import { UserModel } from '@app/db/models';

export const fullNameResolver: GQL_UserResolvers['fullName'] = async (parent) => {
  const user = parent as GQL_User & UserModel;
  const name = [user.firstName, user.middleName, user.lastName]
    .map((x) => (x ? x.trim() : ''))
    .filter((x) => x.trim())
    .join(' ');

  return name;
};
