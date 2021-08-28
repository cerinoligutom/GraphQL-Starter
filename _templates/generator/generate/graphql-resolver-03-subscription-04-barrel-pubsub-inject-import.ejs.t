---
inject: true
to: '<%= locals.gqlResolver?.resolverType === "Subscription" ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/pubsub/index.ts` : null %>'
prepend: true
skip_if: createPublish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>EventPubSub
---
import { createPublish<%= h.changeCase.pascal(locals.gqlResolver?.subscriptionResolver?.eventName) %>EventPubSub } from './publish-<%= h.changeCase.param(locals.gqlResolver?.subscriptionResolver?.eventName)%>-event.pubsub';