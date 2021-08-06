---
to: '<%= locals.gqlResolver?.resolverType === "Mutation" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/${h.changeCase.param(locals.gqlResolver?.name)}.mutation.ts` : null %>'
unless_exists: true
---
import { GQL_MutationResolvers } from '@/generated/graphql';
import { <%= h.changeCase.camel(locals.gqlResolver?.useCaseName) %>UseCase } from '../../use-cases/<%= h.changeCase.param(locals.gqlResolver?.useCaseName) %>.use-case';

export const <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver: GQL_MutationResolvers['<%= h.changeCase.camel(locals.gqlResolver?.name) %>'] = async (root, { input }, ctx) => {
  const result = await <%= h.changeCase.camel(locals.gqlResolver?.useCaseName) %>UseCase(
    {
      // TODO: Populate accordingly
    },
    {
      req: ctx.req,
      res: ctx.res,
    }
  );

  // TODO: 
  // Make sure to use a factory to transform the db model results into a response model 
  // from the use case result if there is any
}