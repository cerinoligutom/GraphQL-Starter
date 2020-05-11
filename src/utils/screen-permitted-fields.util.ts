// tslint:disable: no-any
import { Ability, subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { SystemAbilityAction, SystemAbilitySubject } from '@app/core/authorization';
import * as _ from 'lodash';

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

  if (data?.constructor?.name === 'Object') {
    if (!modelName) {
      throw new Error(`"data" is a plain object but no "modelName" was supplied.`);
    }

    fields = permittedFieldsOf(ability, action, subject(modelName, data));
  } else {
    fields = permittedFieldsOf(ability, action, data);
  }

  return _.pick(data, fields);
};
