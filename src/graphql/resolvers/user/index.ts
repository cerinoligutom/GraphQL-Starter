import { users } from './users.query';
import { fullName } from './fullName.query';

export default {
  Query: {
    users,
  },
  User: {
    fullName,
  },
};
