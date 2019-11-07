import jwt, { VerifyOptions, SignOptions } from 'jsonwebtoken';
import { jwtOptions } from '@app/config/jwt-options';

export interface IJwtPayload {
  userId: string;
}

const { issuer, audience, expiresIn, secretKey } = jwtOptions;

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
