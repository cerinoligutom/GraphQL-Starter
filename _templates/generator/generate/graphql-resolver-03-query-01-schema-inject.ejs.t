---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Query" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlFileName)}.graphql` : null %>'
append: true
skip_if: <%= h.changeCase.camel(locals.gqlResolver?.name) %>
---
extend type Query {
  <%= h.changeCase.camel(locals.gqlResolver?.name) %>(foo: String!): <%= locals.gqlResolver?.queryResolver?.gqlReturnType %>
}

<% if (!locals.gqlResolver?.queryResolver?.gqlReturnTypeExists) { -%>
type <%= h.changeCase.pascal(locals.gqlResolver?.queryResolver?.gqlReturnTypeName) %> {
  # TODO: Auto-generated code. Change accordingly.
  foo: String
}
<% } -%>
