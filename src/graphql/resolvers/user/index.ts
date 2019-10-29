import { usersResolver } from './users.query';
import { fullNameResolver } from './fullName.query';

export default {
  Query: {
    users: usersResolver,
  },
  User: {
    fullName: fullNameResolver,
  },
};
