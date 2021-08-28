---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Query" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/index.ts` : null %>'
after: 'Query: {'
skip_if: '<%= h.changeCase.camel(locals.gqlResolver?.name) %>: <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver,'
---
    <%= h.changeCase.camel(locals.gqlResolver?.name) %>: <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver,