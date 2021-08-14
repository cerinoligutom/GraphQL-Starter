---
inject: true
to: '<%= locals.restRouteHandler ? `src/app.ts` : null %>'
after: 'maintenanceRouter'
skip_if: "'<%= h.changeCase.camel(locals.module?.name) %>Router'"
---
import { <%= h.changeCase.camel(locals.module?.name) %>Router } from '@/modules/<%= h.changeCase.param(locals.module?.name) %>/routes';