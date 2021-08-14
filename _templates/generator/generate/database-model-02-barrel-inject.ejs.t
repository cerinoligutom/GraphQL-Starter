---
inject: true
to: '<%= locals.dbModel ? `src/db/models/index.ts` : null %>'
append: true
skip_if: "'<%= h.changeCase.param(locals.dbModel?.name) %>.model'"
---
export * from './<%= h.changeCase.param(locals.dbModel?.name) %>.model';