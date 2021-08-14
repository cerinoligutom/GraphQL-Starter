---
inject: true
to: '<%= locals.restRouteHandler ? `src/app.ts` : null %>'
after: 'const routers'
skip_if: '<%= h.changeCase.camel(locals.module?.name) %>Router,'
---
    <%= h.changeCase.camel(locals.module?.name) %>Router,