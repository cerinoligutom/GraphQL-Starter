import { SystemAbilityAction, SystemAbilitySubject } from '@app/core/authorization';
import { rule } from 'graphql-shield';
import { IGraphQLContext } from '@app/graphql';
import { ForbiddenError } from '@casl/ability';

/**
 * Refer to system ability in authorization for the valid actions and subjects.
 *
 * Note: If you you have conditions or field restrictions,
 * make sure to do a comprehensive check in your resolvers.
 * We do not do it here as what you receive in the args does
 * not always match your database column names so it's better
 * to do it after this layer.
 */
export const can = (action: SystemAbilityAction, subject: Extract<SystemAbilitySubject, string>) =>
  rule()(async (parent, args, { ability }: IGraphQLContext) => {
    ForbiddenError.from(ability).throwUnlessCan(action, subject);

    return true;
  });
