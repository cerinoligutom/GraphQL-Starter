// tslint:disable: no-any
import { Ability, subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { pick } from 'lodash';
import { SystemAbilityAction, SystemAbilitySubject } from '@app/core/authorization';

interface IScreenPermittedFieldsArgs {
  ability: Ability;
  modelName?: Extract<SystemAbilitySubject, string>;
  action: SystemAbilityAction;
}

export const screenPermittedFields = <T extends object>(
  data: T,
  { ability, modelName, action }: IScreenPermittedFieldsArgs,
): Partial<T> => {
  if (Array.isArray(data)) {
    throw new Error(`"data" is an array. "data" must be of type object.`);
  }

  let fields: string[] = [];

  // Check if "data" is a plain object
  if (data?.constructor?.name === 'Object') {
    // Must then supply a "modelName" to aid with Subject identification
    if (!modelName) {
      throw new Error(`"data" is a plain object but no "modelName" was supplied.`);
    }

    fields = permittedFieldsOf(ability, action, subject(modelName, data));
  } else {
    // "data" must be a model instance. The helper can derive the Subject.
    fields = permittedFieldsOf(ability, action, data);
  }

  if (fields.length === 0 || fields.includes('*')) {
    return data;
  }
  return pick(data, fields);
};
