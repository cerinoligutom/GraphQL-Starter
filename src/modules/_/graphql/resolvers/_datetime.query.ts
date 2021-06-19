import { GQL_QueryResolvers } from '@/generated/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _datetimeResolver: GQL_QueryResolvers['_datetime'] = async (_, { input }) => {
  console.info('datetime:', input);
  const processedInput = input ? new Date(input) : new Date();
  return processedInput;
};
