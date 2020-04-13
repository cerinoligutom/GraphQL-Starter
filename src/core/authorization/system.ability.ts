import { AbilityBuilder, RawRule, InferSubjects } from '@casl/ability';
import { User } from '@app/db/models';
import { SystemRole } from '@app/core/enums';
import { createAbility, parseConditions } from './common/casl-helpers';

// Valid subject for this ability
type Subject = InferSubjects<typeof User> | 'all';

// Note:
// Variables parameter left intentionally for example purposes.
// Replace with proper variables if you start needing it.
export async function defineSystemAbilitiesFor(userId?: string, variables = {}) {
  const { rules, can } = new AbilityBuilder();

  // Note:
  // Define default system abilities for default users here
  can('read', 'all');

  if (!userId) {
    return createAbility<Subject>(rules);
  }

  const user = await User.query().findById(userId).withGraphFetched('roles.permissions');
  if (!user) {
    throw new Error(`Failed to create abilities. User ID "${userId}" does not exist.`);
  }

  const isSuperadmin = user?.roles?.some((x) => x.name === SystemRole.SUPER_ADMINISTRATOR) ?? false;
  if (isSuperadmin) {
    // Don't question the superadmin
    can('manage', 'all');
    return createAbility<Subject>(rules);
  }

  const permissions = (user?.roles?.map((x) => x.permissions ?? []) ?? []).flat();
  const rawRules: RawRule[] = permissions.map<RawRule>((permission) => {
    const { subject, action } = permission;

    // tslint:disable-next-line: no-any
    let conditions: Record<any, any> | undefined;
    if (permission.conditions) {
      conditions = parseConditions(permission.conditions, variables);
    }

    return {
      subject,
      conditions,
      actions: action,
    };
  });

  return createAbility<Subject>([...rawRules, ...rules]);
}
