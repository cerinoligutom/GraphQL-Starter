export interface IJwtOptions {
  issuer: string | undefined;
  audience: string | undefined;
  secretKey: string;
  expiresIn: string | number | undefined;
}

export const jwtOptions: IJwtOptions = {
  issuer: process.env.JWT_ISSUER || 'Graphql Starter API',
  audience: process.env.JWT_AUDIENCE || 'GraphQL Starter API Consumer',
  secretKey: process.env.JWT_SECRET || '',
  expiresIn: '7d',
};

// Remove `secretKey` property and code block below
// if your keys are asymmetrically signed.
if (!jwtOptions.secretKey) {
  throw new Error('JWT Secret Key not provided in environment config.');
}
