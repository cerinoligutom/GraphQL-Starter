import { loginResolver } from './login.mutation';
import { registerResolver } from './register.mutation';
import { logoutResolver } from './logout.mutation';

export default {
  Mutation: {
    login: loginResolver,
    logout: logoutResolver,
    register: registerResolver,
  },
};
