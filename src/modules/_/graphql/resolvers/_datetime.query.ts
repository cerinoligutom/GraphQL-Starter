import { GQL_QueryResolvers } from '@/generated/graphql/index.js';

export const _datetimeResolver: GQL_QueryResolvers['_datetime'] = async (_, { input }) => {
  console.info('datetime:', input);
  const processedInput = input ? new Date(input) : new Date();
  return processedInput;
};
