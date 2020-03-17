import { User } from '@app/db/models';
import { bcryptUtil } from '@app/utils';
import { GQL_RegisterInput } from 'graphql-resolvers';

async function login(usernameOrEmail: string, password: string): Promise<User> {
  const user = await User.query()
    .where('username', usernameOrEmail)
    .orWhere('email', usernameOrEmail)
    .first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash, user.salt);

    if (isValidPassword) {
      return user;
    }
  }

  throw new Error('Invalid username/email or password');
}

async function register(input: GQL_RegisterInput): Promise<User> {
  const { firstName, middleName, lastName, email, password, username } = input;

  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(password, salt);

  const existingUsername = await User.query()
    .where('username', username)
    .first();
  if (existingUsername) {
    throw new Error('Username is already taken.');
  }

  const existingEmail = await User.query()
    .where('email', email)
    .first();
  if (existingEmail) {
    throw new Error('Email is already taken.');
  }

  const form: User = new User();
  form.$set({
    firstName,
    middleName,
    lastName,
    username,
    email,
    hash,
    salt,
  });

  return User.query().insertAndFetch(form);
}

export const authService = {
  login,
  register,
};
