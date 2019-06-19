import jwt, { VerifyOptions, SignOptions } from 'jsonwebtoken';
import { env } from '@app/config/environment';

export interface IJwtPayload {
  userId: string;
}

const { issuer, audience, expiresIn, secretKey } = env.jwt;

const signOptions: SignOptions = {
  issuer,
  audience,
  expiresIn,
};

const verifyOptions: VerifyOptions = {
  issuer,
  audience,
};

const validateToken = (bearerToken: string | undefined) => {
  if (!bearerToken) {
    return null;
  }

  try {
    const token = bearerToken.split(' ')[1]; // Bearer <token>
    const result = jwt.verify(token, secretKey, verifyOptions);
    return result as IJwtPayload;
  } catch {
    return null;
  }
};

const createToken = (payload: IJwtPayload) => {
  return jwt.sign(payload, secretKey, signOptions);
};

export const jwtUtil = {
  validateToken,
  createToken,
};
