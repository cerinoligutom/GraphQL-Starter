import { users } from './users.query';
import { fullName } from './fullname.query';

export default {
  Query: {
    users,
  },
  User: {
    fullName,
  },
};
