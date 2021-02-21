import { jwtOptions } from '@/config/jwt';
import jwt from 'jsonwebtoken';

function sign(payload: Record<string, any>, opts?: Partial<jwt.SignOptions>): string {
  const defaultSignOptions: Partial<jwt.SignOptions> = {
    algorithm: 'RS512',
    issuer: jwtOptions.issuer,
    audience: jwtOptions.audience,
    expiresIn: jwtOptions.expiresIn,
  };

  return jwt.sign(payload, jwtOptions.privateKey, {
    ...defaultSignOptions,
    ...opts,
  });
}

function verify<T extends Record<string, any>>(token: string, opts?: Partial<jwt.VerifyOptions>): T | null {
  try {
    const defaultVerifyOptions: Partial<jwt.VerifyOptions> = {
      algorithms: ['RS512'],
      issuer: jwtOptions.issuer,
      audience: jwtOptions.audience,
    };

    return jwt.verify(token, jwtOptions.publicKey, {
      ...defaultVerifyOptions,
      ...opts,
    }) as T;
  } catch (err) {
    return null;
  }
}

export const tokenGenerator = {
  sign,
  verify,
};
