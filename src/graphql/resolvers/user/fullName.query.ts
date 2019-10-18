import { GQL_UserResolvers } from 'graphql-resolvers';
import { User } from '@app/db/models';

export const fullName: GQL_UserResolvers['fullName'] = async parent => {
  const user = parent as User;
  const name = [user.firstName, user.middleName, user.lastName]
    .map(x => (x ? x.trim() : ''))
    .filter(x => x.trim())
    .join(' ');

  return name;
};
