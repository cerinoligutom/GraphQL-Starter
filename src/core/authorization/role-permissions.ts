import { SystemRole } from '@app/core/enums';
import { AbilityBuilder } from '@casl/ability';
import { SystemAbility } from './system.ability';

interface IDefinePermissionVariables {
  userId: string;
}

type DefinePermission = (variables: IDefinePermissionVariables, builder: AbilityBuilder<SystemAbility>) => void;

export const rolePermissions: Record<SystemRole | 'default', DefinePermission> = {
  default: ({ userId }, { can }) => {
    can('update', 'User', {
      id: userId,
    });
  },

  [SystemRole.SUPER_ADMINISTRATOR]: ({ userId }, { can }) => {
    can('manage', 'all');
  },
};
