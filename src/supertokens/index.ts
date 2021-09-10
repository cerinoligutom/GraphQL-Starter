import { superTokensConfig } from '@/config/supertokens';
import SuperTokens from 'supertokens-node';
import { SessionRecipe } from './session.recipe';

SuperTokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: superTokensConfig.connectionUrl,
    apiKey: superTokensConfig.apiKey,
  },
  appInfo: {
    appName: superTokensConfig.appInfo.appName,
    apiDomain: superTokensConfig.appInfo.apiDomain,
    websiteDomain: superTokensConfig.appInfo.websiteDomain,
    apiBasePath: '/api/v1/auth',
  },
  recipeList: [SessionRecipe],
});
