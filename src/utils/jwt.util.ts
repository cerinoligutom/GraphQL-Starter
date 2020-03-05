import jwt from 'jsonwebtoken';

const validateToken = <T>(token: string, secretKey: string) => {
  const result = jwt.verify(token, secretKey);
  return (result as unknown) as T;
};

// tslint:disable-next-line: no-any
const createToken = (payload: any, secretKey: string, signOptions: jwt.SignOptions) => {
  return jwt.sign(payload, secretKey, signOptions);
};

export const jwtUtil = {
  validateToken,
  createToken,
};
