// tslint:disable: no-any

import { AbilityBuilder, InferSubjects, Ability } from '@casl/ability';
import { User } from '@app/db/models';
import { createAbility } from './common/casl-helpers';
import { rolePermissions } from './role-permissions';

// Modify these as per your needs
type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subject = typeof User;

// Do not touch
export type SystemAbilityAction = Action;
export type SystemAbilitySubject = InferSubjects<Subject, true> | 'all';
export type SystemAbility = Ability<[SystemAbilityAction, SystemAbilitySubject]>;

export async function defineSystemAbilitiesFor(userId?: string) {
  const abilityBuilder = new AbilityBuilder<SystemAbility>();
  const { rules } = abilityBuilder;

  if (!userId) {
    return createAbility<SystemAbilityAction, SystemAbilitySubject>(rules);
  }

  const user = await User.query().findById(userId).withGraphFetched('roles');
  if (!user) {
    throw new Error(`Failed to create abilities. User ID "${userId}" does not exist.`);
  }

  // Set default permissions
  rolePermissions.default({ userId }, abilityBuilder);

  for (const role of user?.roles ?? []) {
    rolePermissions[role.name as keyof typeof rolePermissions]({ userId }, abilityBuilder);
  }

  return createAbility<SystemAbilityAction, SystemAbilitySubject>(rules);
}
