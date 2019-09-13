export interface IJwtOptions {
  issuer: string | undefined;
  audience: string | undefined;
  secretKey: string;
  expiresIn: string | number | undefined;
}

export const jwtOptions: IJwtOptions = {
  issuer: process.env.JWT_ISSUER || 'Graphql Starter API',
  audience: process.env.JWT_AUDIENCE || 'GraphQL Starter API Consumer',
  secretKey: process.env.JWT_SECRET || 'jw+s3cr3+',
  expiresIn: '7d',
};
