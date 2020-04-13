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
export const schemaPermissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      _dummy: allow,
      _sampleDateTimeScalar: allow,
      _sampleDateScalar: allow,
      _sampleTimeScalar: allow,
      _authorizedOnlyQuery: allow,
      users: and(isAuthenticated, yupRule(cursorArgsSchema)),
    },
    Mutation: {
      '*': isAuthenticated,
      _dummy: allow,
      login: yupRule(loginSchema),
      logout: allow,
      register: yupRule(registerSchema),
    },
    Subscription: {
      '*': isAuthenticated,
      _dummy: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
);
