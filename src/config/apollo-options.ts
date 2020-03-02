import { config as configDotEnv } from 'dotenv';
configDotEnv();

interface IApolloOptions {
  maxFileSize: number;
  maxFiles: number;
  engineApiKey?: string;
}

export const apolloOptions: IApolloOptions = {
  maxFileSize: +process.env.APOLLO_MAX_FILE_SIZE! || 10 * 1000 * 1000, // 10 MB
  maxFiles: +process.env.APOLLO_MAX_FILES! || 20,
  engineApiKey: process.env.APOLLO_ENGINE_API_KEY,
};
