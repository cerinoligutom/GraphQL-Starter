// tslint:disable:no-any

import {
  Ability,
  ClaimRawRule,
  LegacyClaimRawRule,
  SubjectRawRule,
  LegacySubjectRawRule,
  SubjectType,
  ForbiddenError,
} from '@casl/ability';

ForbiddenError.setDefaultMessage('Unauthorized!');

export function createAbility<A extends string, S extends string | object>(
  rules: (
    | ClaimRawRule<string>
    | LegacyClaimRawRule<string>
    | SubjectRawRule<string, SubjectType, unknown>
    | LegacySubjectRawRule<string, SubjectType, unknown>
  )[],
) {
  return new Ability<[A, S]>(rules as any);
}
