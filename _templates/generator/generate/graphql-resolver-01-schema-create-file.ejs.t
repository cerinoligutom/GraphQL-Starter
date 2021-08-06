---
to: '<%= locals.gqlResolver ? `src/modules/${h.changeCase.param(locals.module?.name)}/graphql/${h.changeCase.pascal(locals.gqlResolver?.gqlFileName)}.graphql` : null %>'
unless_exists: true
---
