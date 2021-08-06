---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Mutation" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlFileName)}.graphql` : null %>'
append: true
skip_if: <%= h.changeCase.camel(locals.gqlResolver?.name) %>
---
extend type Mutation {
  <%= h.changeCase.camel(locals.gqlResolver?.name) %>(input: <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Input): <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Payload!
}

input <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Input {
  foo: String
}

type <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Payload {
  bar: String
}
