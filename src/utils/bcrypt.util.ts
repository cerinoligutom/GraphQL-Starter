import bcrypt from 'bcryptjs';

const ROUNDS = 14;

const verify = async (input: string, hash: string, salt: string): Promise<boolean> => {
  return await bcrypt.compare(input + salt, hash);
};

const generateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt(ROUNDS);
};

const generateHash = async (input: string, salt: string): Promise<string> => {
  return await bcrypt.hash(input + salt, ROUNDS);
};

export const bcryptUtil = {
  verify,
  generateSalt,
  generateHash,
};
