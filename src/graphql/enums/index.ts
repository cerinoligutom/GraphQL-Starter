// If you have enums that you want to expose to the GraphQL Schema,
// just export them directly here and it'll be resolved as per configuration
// from "src/graphql/schema.ts".

// Do know that you can actually resolve these enums on their respective
// module graphql index barrel and it would still work. If you prefer to resolve
// it on the module level, make sure to map the enum in the `codegen.yml`
// if you also want to get strict types in generated code.

// GraphQL Code Generator is currently configured to map enum values
// to this file as seen on `codegen.yml` under the `enumValues` key.
// Rationale being, I'd prefer for this file to grow rather than the
// codegen config as the project gets bigger over time.

export { SortDirection } from '@/shared/constants';
export { UserSortField } from '@/modules/user/constants/user-sort-field.enum';
