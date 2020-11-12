import { UserModel } from '@app/db/models';
import { bcryptUtil } from '@app/utils';
import { GQL_RegisterInput } from '@app/graphql-schema-types';
import { EmailAlreadyTakenError } from '@app/error-handler/errors/EmailAlreadyTakenError';
import { UsernameAlreadyTakenError } from '@app/error-handler/errors/UsernameAlreadyTakenError';

async function login(usernameOrEmail: string, password: string): Promise<UserModel> {
  const user = await UserModel.query().where('username', usernameOrEmail).orWhere('email', usernameOrEmail).first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash, user.salt);

    if (isValidPassword) {
      return user;
    }
  }

  throw new Error('Invalid username/email or password');
}

async function register(input: GQL_RegisterInput): Promise<UserModel> {
  const { firstName, middleName, lastName, email, password, username } = input;

  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(password, salt);

  const existingUsername = await UserModel.query().where('username', username).first();
  if (existingUsername) {
    throw new UsernameAlreadyTakenError();
  }

  const existingEmail = await UserModel.query().where('email', email).first();
  if (existingEmail) {
    throw new EmailAlreadyTakenError();
  }

  const form: UserModel = new UserModel();
  form.set({
    firstName,
    middleName,
    lastName,
    username,
    email,
    hash,
    salt,
  });

  return UserModel.query().insertAndFetch(form);
}

export const authService = {
  login,
  register,
};
