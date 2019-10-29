import { loginResolver } from './login.mutation';
import { registerResolver } from './register.mutation';

export default {
  Mutation: {
    login: loginResolver,
    register: registerResolver,
  },
};
