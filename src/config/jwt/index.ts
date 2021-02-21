import fs from 'fs';
import path from 'path';

// IMPORTANT:
// Make sure to change your keys on production!
// You can generate your keys here:
// https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/
// https://travistidwell.com/jsencrypt/demo/

// These are RSA 2048 keys
export const privateKey = fs.readFileSync(path.join(__dirname, '/private.key'), 'utf8');
export const publicKey = fs.readFileSync(path.join(__dirname, '/public.key'), 'utf8');

interface IJwtOptions {
  privateKey: string;
  publicKey: string;
  issuer: string;
  audience: string;
  expiresIn: string;
}

export const jwtOptions: IJwtOptions = {
  privateKey,
  publicKey,
  issuer: process.env.JWT_ISSUER! || 'graphql-starter',
  audience: process.env.JWT_AUDIENCE! || 'graphql-starter',
  expiresIn: process.env.JWT_EXPIRES_IN! || '7d',
};
