---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/pubsub/index.ts` : null %>'
after: 'enum PubSubTrigger {'
skip_if: <%= h.changeCase.constant(locals.gqlResolver?.subscriptionResolver?.eventName) %>_EVENT
---
  <%= h.changeCase.constant(locals.gqlResolver?.subscriptionResolver?.eventName) %>_EVENT = '<%= h.changeCase.pascal(locals.module?.name) %> - <%= h.changeCase.constant(locals.gqlResolver?.subscriptionResolver?.eventName) %>',