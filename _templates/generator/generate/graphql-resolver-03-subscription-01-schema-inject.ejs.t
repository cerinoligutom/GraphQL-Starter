---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlFileName)}.graphql` : null %>'
append: true
skip_if: <%= h.changeCase.camel(locals.gqlResolver?.name) %>
---
extend type Subscription {
  <%= h.changeCase.camel(locals.gqlResolver?.name) %>(foo: String!): <%= locals.gqlResolver?.common?.gqlReturnType %>
}

<% if (!locals.gqlResolver?.common?.gqlReturnTypeExists) { -%>
type <%= h.changeCase.pascal(locals.gqlResolver?.common?.gqlReturnTypeName) %> {
  # TODO: Auto-generated code. Change accordingly.
  foo: String
}
<% } -%>
