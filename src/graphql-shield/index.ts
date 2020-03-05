import { shield, allow, deny, and } from 'graphql-shield';
import { isAuthenticated, yupRule } from './rules';
import { loginSchema, registerSchema, cursorArgsSchema } from './yup-validation-schemas';

/**
 * Read more about `GraphQL Shield` if this doesn't make sense to you.
 *
 * Currently using `Per Type Wildcard Rule` (https://github.com/maticzav/graphql-shield#per-type-wildcard-rule)
 * as using `fallbackRule` would catch all types. (https://github.com/maticzav/graphql-shield/issues/298#issuecomment-464660843)
 * Since our mutation responses are wrapped in an `<x>Payload` type,
 * it'll keep on throwing errors unless we specify all `<x>Payload` types below.
 *
 */
export const schemaPermissions = shield({
  Query: {
    '*': isAuthenticated,
    users: and(isAuthenticated, yupRule(cursorArgsSchema)),
  },
  Mutation: {
    '*': isAuthenticated,
    login: yupRule(loginSchema),
    logout: allow,
    register: yupRule(registerSchema),
  },
});
