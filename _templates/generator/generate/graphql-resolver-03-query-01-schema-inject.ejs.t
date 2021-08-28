---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Query" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlSchemaFileName)}.graphql` : null %>'
append: true
skip_if: <%= h.changeCase.camel(locals.gqlResolver?.name) %>
---
extend type Query {
  <%= h.changeCase.camel(locals.gqlResolver?.name) %>(foo: String!): <%= locals.gqlResolver?.common?.gqlReturnType %>
}

<% if (!locals.gqlResolver?.common?.gqlReturnTypeExists) { -%>
type <%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %> {
  # TODO: Auto-generated code. Change accordingly.
  foo: String
}
<% } -%>
