---
to: '<%= locals.factory ? `src/modules/${h.changeCase.param(locals.module?.name)}/factories/${h.changeCase.param(locals.factory?.name)}.factory.ts` : null %>'
---
import { <%= h.changeCase.pascal(locals.factory?.modelName) %>Model } from '@/db/models';
import { GQL_<%= h.changeCase.pascal(locals.factory?.modelName) %> } from '@/generated/graphql';

function createGQL<%= h.changeCase.pascal(locals.factory?.modelName) %>(<%= h.changeCase.camel(locals.factory?.modelName) %>: <%= h.changeCase.pascal(locals.factory?.modelName) %>Model): GQL_<%= h.changeCase.pascal(locals.factory?.modelName) %> {
  const <%= h.changeCase.camel(locals.factory?.modelName) %>Json = <%= h.changeCase.camel(locals.factory?.modelName) %>.toJSON();
  return {
    ...<%= h.changeCase.camel(locals.factory?.modelName) %>Json,
  };
}

export const <%= h.changeCase.camel(locals.factory?.name) %>Factory = {
  createGQL<%= h.changeCase.pascal(locals.factory?.modelName) %>,
};
