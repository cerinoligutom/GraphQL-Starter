import 'dotenv/config';

interface IJwtOptions {
  secretKey: string;
  expiresIn: string | number | undefined;
}

export const accessTokenOptions: IJwtOptions = {
  secretKey: process.env.ACCESS_TOKEN_SECRET || 'acC3sS_jw+s3cr3+',
  expiresIn: '30m',
};

export const refreshTokenOptions: IJwtOptions = {
  secretKey: process.env.REFRESH_TOKEN_SECRET || 'r3fR35h_jw+s3cr3+',
  expiresIn: '7d',
};
