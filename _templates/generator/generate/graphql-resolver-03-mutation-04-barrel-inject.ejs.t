---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Mutation" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/index.ts` : null %>'
after: 'Mutation: {'
skip_if: '<%= h.changeCase.camel(locals.gqlResolver?.name) %>: <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver,'
---
    <%= h.changeCase.camel(locals.gqlResolver?.name) %>: <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver,