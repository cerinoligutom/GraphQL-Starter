---
to: '<%= locals.gqlResolver ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/index.ts` : null %>'
unless_exists: true
---
import { GQL_Resolvers } from '@/generated/graphql';

const resolvers: GQL_Resolvers = {
  Query: {
    // Do not remove this comment until populated.
  },
  Mutation: {
    // Do not remove this comment until populated.
  },
  Subscription: {
    // Do not remove this comment until populated.
  },
};
export default resolvers;
