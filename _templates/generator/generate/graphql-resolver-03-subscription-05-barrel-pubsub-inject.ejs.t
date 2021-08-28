---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/pubsub/index.ts` : null %>'
before: 'get Trigger()'
skip_if: publish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>Event
---
    publish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>Event: createPublish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>EventPubSub(pubsub, PubSubTrigger.<%= h.changeCase.constant(locals.gqlResolver?.subscriptionResolver?.eventName) %>_EVENT),