// tslint:disable:no-any ter-prefer-arrow-callback

import {
  Ability,
  ClaimRawRule,
  LegacyClaimRawRule,
  SubjectRawRule,
  LegacySubjectRawRule,
  SubjectType,
  ForbiddenError,
} from '@casl/ability';
import * as _ from 'lodash';

ForbiddenError.setDefaultMessage('Unauthorized!');

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export function createAbility<S extends string | object, A extends string = Actions>(
  rules: (
    | ClaimRawRule<string>
    | LegacyClaimRawRule<string>
    | SubjectRawRule<string, SubjectType, unknown>
    | LegacySubjectRawRule<string, SubjectType, unknown>
  )[],
) {
  return new Ability<[A | Actions, S]>(rules as any);
}

export function parseConditions(conditions: Record<string, string>, variables: Record<string, any>) {
  return JSON.parse(JSON.stringify(conditions), (key: string, rawValue: any) => {
    if (rawValue[0] !== '$') {
      return rawValue;
    }

    const name = rawValue.slice(2, -1);
    const value = _.get(variables, name);

    if (typeof value === 'undefined') {
      throw new ReferenceError(`Variable ${name} is not defined`);
    }

    return value;
  });
}
