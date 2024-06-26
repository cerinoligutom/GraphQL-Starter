import { GQL_QueryResolvers } from '@/generated/graphql/index.js';

export const _timeResolver: GQL_QueryResolvers['_time'] = async (_, { input }) => {
  console.info('time:', input);
  const processedInput = input ? new Date(input) : new Date();
  return processedInput;
};
