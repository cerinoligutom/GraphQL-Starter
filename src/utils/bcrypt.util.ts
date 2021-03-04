import bcrypt from 'bcryptjs';

const verify = async (input: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(input, hash);
};

const generateHash = async (input: string, rounds = 14): Promise<string> => {
  return bcrypt.hash(input, rounds);
};

export const bcryptUtil = {
  verify,
  generateHash,
};
