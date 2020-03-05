import 'dotenv/config';

interface IApolloOptions {
  maxFileSize: number;
  maxFiles: number;
  engineApiKey?: string;
}

export const apolloOptions: IApolloOptions = {
  maxFileSize: +process.env.APOLLO_MAX_FILE_SIZE! || 10 * 1000 * 1000, // 10 MB
  maxFiles: +process.env.APOLLO_MAX_FILES! || 20,
  engineApiKey: process.env.ENGINE_API_KEY,
};
