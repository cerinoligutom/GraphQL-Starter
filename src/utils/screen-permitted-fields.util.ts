// tslint:disable: no-any
import { Ability } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { pick } from 'lodash';
import { SystemAbilityAction, SystemAbilitySubject } from '@app/core/authorization';

interface IScreenPermittedFieldsArgs {
  ability: Ability;
  subject: Extract<SystemAbilitySubject, string>;
  action: SystemAbilityAction;
}

export const screenPermittedFields = <T extends object>(data: T, { ability, subject, action }: IScreenPermittedFieldsArgs): Partial<T> => {
  if (Array.isArray(data)) {
    throw new Error(`"data" is an array. "data" must be of type object.`);
  }

  const fields: string[] = permittedFieldsOf(ability, action, subject);

  if (fields.length === 0 || fields.includes('*')) {
    return data;
  }
  return pick(data, fields);
};
