import { GQL_QueryResolvers } from '@/generated/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _timeResolver: GQL_QueryResolvers['_time'] = async (_, { input }) => {
  console.info('time:', input);
  const processedInput = input ? new Date(input) : new Date();
  return processedInput;
};
