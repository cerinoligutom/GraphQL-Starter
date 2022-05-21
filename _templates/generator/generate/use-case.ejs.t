---
to: '<%= locals.useCase ? `src/modules/${h.changeCase.param(locals.module?.name)}/use-cases/${h.changeCase.param(locals.useCase.name)}.use-case.ts` : null %>'
---
import { checkAuthentication } from '@/modules/auth/helpers/check-authentication';
import { IContext } from '@/shared/interfaces';
import { createSchemaValidator } from '@/utils';
import * as yup from 'yup';

export interface I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO {
  // TODO: Populate accordingly
  foo: string;
}

const schema = yup.object().shape({
  // TODO: Populate accordingly
  foo: yup.string(),
});
const validateDTO = createSchemaValidator<I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO>(schema);

interface I<%= h.changeCase.pascal(locals.useCase?.name) %>UseCaseResult {
  // TODO: Populate accordingly
  foo: string;
}
export async function <%= h.changeCase.camel(locals.useCase?.name) %>UseCase(dto: I<%= h.changeCase.pascal(locals.useCase?.name) %>DTO, ctx: IContext): Promise<I<%= h.changeCase.pascal(locals.useCase?.name) %>UseCaseResult> {
  const { userId: ctxUserId } = await checkAuthentication(ctx);
  console.info(`Requested by ${ctxUserId}`)

  const { foo } = await validateDTO(dto);

  return {
    // TODO: Populate accordingly
    foo,
  };
}
