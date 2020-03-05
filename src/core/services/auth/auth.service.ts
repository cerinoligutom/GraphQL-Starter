import { User } from '@app/db/models';
import { bcryptUtil, jwtUtil } from '@app/utils';
import { GQL_RegisterInput } from 'graphql-resolvers';
import { accessTokenOptions, refreshTokenOptions } from '@app/config/jwt-options';
import { IAccessTokenPayload, IRefreshTokenPayload } from '@app/core/interfaces';

function isBearerToken(token: string) {
  return token.toLowerCase().startsWith('bearer ');
}

function createAccessToken(user: User) {
  const { expiresIn, secretKey } = accessTokenOptions;
  return jwtUtil.createToken(
    {
      userId: user.id,
    },
    secretKey,
    {
      expiresIn,
    },
  );
}

function validateAccessToken(accessToken: string = '') {
  let token = accessToken;
  if (isBearerToken(token)) {
    [, token] = accessToken.split(' ');
  }

  const { secretKey } = accessTokenOptions;
  const payload = jwtUtil.validateToken<IAccessTokenPayload>(token, secretKey);
  return payload;
}

function createRefreshToken(user: User) {
  const { expiresIn, secretKey } = refreshTokenOptions;
  return jwtUtil.createToken(
    {
      userId: user.id,
    },
    secretKey,
    {
      expiresIn,
    },
  );
}

function validateRefreshToken(refreshToken: string = '') {
  let token = refreshToken;
  if (isBearerToken(token)) {
    [, token] = refreshToken.split(' ');
  }

  const { secretKey } = refreshTokenOptions;
  const payload = jwtUtil.validateToken<IRefreshTokenPayload>(token, secretKey);
  return payload;
}

async function login(usernameOrEmail: string, password: string): Promise<{ user: User; token: string }> {
  const user = await User.query()
    .where('username', usernameOrEmail)
    .orWhere('email', usernameOrEmail)
    .first();

  if (user) {
    const isValidPassword = await bcryptUtil.verify(password, user.hash, user.salt);

    if (isValidPassword) {
      const token = createAccessToken(user);

      return {
        user,
        token,
      };
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

  const form: Partial<User> = {
    firstName,
    middleName,
    lastName,
    username,
    email,
    hash,
    salt,
  };

  return await User.query().insertAndFetch(form);
}

export const authService = {
  login,
  register,
  createAccessToken,
  validateAccessToken,
  createRefreshToken,
  validateRefreshToken,
};
