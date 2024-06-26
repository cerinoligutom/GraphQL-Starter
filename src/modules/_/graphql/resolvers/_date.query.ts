import { GQL_QueryResolvers } from '@/generated/graphql/index.js';

export const _dateResolver: GQL_QueryResolvers['_date'] = async (_, { input }) => {
  console.info('date:', input);
  const processedInput = input ? new Date(input) : new Date();
  return processedInput;
};
