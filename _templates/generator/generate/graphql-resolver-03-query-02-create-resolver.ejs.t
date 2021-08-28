---
to: '<%= locals.gqlResolver?.resolverType === "Query" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/${h.changeCase.param(locals.gqlResolver?.name)}.query.ts` : null %>'
unless_exists: true
---
import { GQL_QueryResolvers } from '@/generated/graphql';
import { <%= h.changeCase.camel(locals.gqlResolver?.useCaseName) %>UseCase } from '../../use-cases/<%= h.changeCase.param(locals.gqlResolver?.useCaseName) %>.use-case';

export const <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver: GQL_QueryResolvers['<%= h.changeCase.camel(locals.gqlResolver?.name) %>'] = async (root, args, ctx) => {
  const { foo } = await <%= h.changeCase.camel(locals.gqlResolver?.useCaseName) %>UseCase(
    {
      // TODO: Populate accordingly
      foo: args.foo,
    },
    ctx,
  );

  // TODO: 
  // Make sure to use a factory to transform the db model results into a response model 
  // from the use case result if there is any
};
