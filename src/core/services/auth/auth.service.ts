import { User } from '@app/db/models';
import { bcryptUtil, jwtUtil } from '@app/utils';
import { RegisterInput } from 'graphql-resolvers';

const login = async (usernameOrEmail: string, password: string) => {
  const user = await User.query()
    .where('username', usernameOrEmail)
    .orWhere('email', usernameOrEmail)
    .first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash, user.salt);

    if (isValidPassword) {
      const token = jwtUtil.createToken({ userId: user.id });

      return {
        user,
        token,
      };
    }
  }

  throw new Error('Invalid username/email or password');
};

const register = async (input: RegisterInput) => {
  const { firstName, middleName, lastName, email, password, username } = input;

  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(password, salt);

  const existingUsername = await User.query().where('username', username).first();
  if (existingUsername) {
    throw new Error('Username is already taken.');
  }

  const existingEmail = await User.query().where('email', email).first();
  if (existingEmail) {
    throw new Error('Email is already taken.');
  }

  return await User.query().insertAndFetch({
    firstName,
    middleName,
    lastName,
    username,
    email,
    hash,
    salt,
  } as User);
};

export const authService = {
  login,
  register,
};
