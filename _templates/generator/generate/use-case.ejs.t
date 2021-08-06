---
to: '<%= locals.useCase ? `src/modules/${h.changeCase.param(locals.module?.name)}/use-cases/${h.changeCase.param(locals.useCase.name)}.use-case.ts` : null %>'
---
import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext } from '@/shared/interfaces';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';

export interface I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO {

}

const schema = yup.object().shape({

});
const validateDTO = createSchemaValidator<I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO>(schema);

interface I<%= h.changeCase.pascal(locals.useCase?.name) %>UseCaseResult {

}
export async function <%= h.changeCase.camel(locals.useCase?.name) %>UseCase(dto: I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO, ctx: IContext): Promise<I<%= h.changeCase.pascal(locals.useCase?.name) %>UseCaseResult> {
  await checkAuthentication(ctx);

  const { } = await validateDTO(dto);

  return {

  }
}
