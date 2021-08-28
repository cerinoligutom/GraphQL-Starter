---
to: '<%= locals.service ? `src/modules/${h.changeCase.param(locals.module?.name)}/services/${h.changeCase.param(locals.service?.name)}.service.ts` : null %>'
---
import { <%= h.changeCase.pascal(locals.service?.modelName) %>Model } from '@/db/models';
import { NotFoundError } from '@/errors';
import { UniqueID } from '@/shared/types';

async function findByIdOrThrow(id: UniqueID): Promise<<%= h.changeCase.pascal(locals.service?.modelName) %>Model> {
  const <%= h.changeCase.camel(locals.service?.modelName) %> = await <%= h.changeCase.pascal(locals.service?.modelName) %>Model.query().findById(id);

  if (!<%= h.changeCase.camel(locals.service?.modelName) %>) {
    throw new NotFoundError(`<%= h.changeCase.pascal(locals.service?.modelName) %> (${id}) not found.`);
  }

  return <%= h.changeCase.camel(locals.service?.modelName) %>;
}

async function findByIds(ids: UniqueID[]): Promise<<%= h.changeCase.pascal(locals.service?.modelName) %>Model[]> {
  const result = await <%= h.changeCase.pascal(locals.service?.modelName) %>Model.query().findByIds(ids);

  return result;
}

export const <%= h.changeCase.camel(locals.service?.name) %>Service = {
  findByIdOrThrow,
  findByIds,
};
