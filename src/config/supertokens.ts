import { env } from '@/config/environment';

interface ISuperTokensConfig {
  connectionUrl: string;
  apiKey?: string;

  appInfo: {
    appName: string;
    apiDomain: string;
    websiteDomain: string;
  };
}

export const superTokensConfig: ISuperTokensConfig = {
  connectionUrl: process.env.SUPERTOKENS_CONNECTION_URL!,
  apiKey: process.env.SUPERTOKENS_API_KEY,

  appInfo: {
    appName: process.env.SUPERTOKENS_APP_NAME!,
    apiDomain: process.env.SUPERTOKENS_API_DOMAIN!,
    websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN!,
  },
};

// Environment defaults
if (!env.isProduction) {
  superTokensConfig.connectionUrl ||= 'http://supertokens:3567';
  superTokensConfig.apiKey ||= 'graphql-starter-supertokens-api-key';

  superTokensConfig.appInfo.appName ||= 'GraphQL Starter';
  superTokensConfig.appInfo.apiDomain ||= 'http://localhost';
  superTokensConfig.appInfo.websiteDomain ||= 'http://localhost';
}
