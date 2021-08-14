---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Query" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/resolvers/index.ts` : null %>'
prepend: true
skip_if: "'<%= h.changeCase.param(locals.gqlResolver?.name) %>.query'"
---
import { <%= h.changeCase.camel(locals.gqlResolver?.name) %>Resolver } from './<%= h.changeCase.param(locals.gqlResolver?.name) %>.query';