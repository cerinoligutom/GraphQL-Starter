import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const EnvironmentConfigSchema = z.object({
  NODE_ENV: z.coerce.string().toLowerCase().default('development'),
  PORT: z.coerce.number().default(8080),
  POSTGRES_CONNECTION_URL: z
    .string()
    .nonempty()
    .default(() => (isProduction ? '' : 'postgresql://postgres:password@db:5432/db')),
  REDIS_CONNECTION_URL: z
    .string()
    .nonempty()
    .default(() => (isProduction ? '' : 'redis://redis')),
});
type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema> & { isProduction: boolean };

export const env: EnvironmentConfig = {
  ...EnvironmentConfigSchema.parse(process.env),
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
} as const;
