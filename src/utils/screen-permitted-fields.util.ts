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

export const screenPermittedFields = <T>(data: T, { ability, subject, action }: IScreenPermittedFieldsArgs): Partial<T> => {
  if (Array.isArray(data)) {
    throw new Error('"data" is an array. "data" must be of type object.');
  }

  // https://casl.js.org/v5/en/api/casl-ability-extra#permitted-fields-of
  const fields: string[] = permittedFieldsOf(ability, action, subject, {
    fieldsFrom: (rule) =>
      rule.fields ||
      [
        /* list of all fields for the model */
      ],
  });

  if (fields.length === 0 || fields.includes('*')) {
    return data;
  }
  return pick(data, [...fields, 'id']);
};
