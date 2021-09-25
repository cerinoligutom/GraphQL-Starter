---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Mutation" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlSchemaFileName)}.graphql` : null %>'
append: true
skip_if: '<%= h.changeCase.camel(locals.gqlResolver?.name) %>\(input'
---
extend type Mutation {
  <%= h.changeCase.camel(locals.gqlResolver?.name) %>(input: <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Input!): <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Payload!
}

input <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Input {
  # TODO: Auto-generated code. Change accordingly.
  foo: String
}

type <%= h.changeCase.pascal(locals.gqlResolver?.name) %>Payload {
  # TODO: Auto-generated code. Change accordingly.
  foo: String
}
