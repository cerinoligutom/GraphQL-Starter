// If you have enums that belongs to the "src/core" directory that you want to
// expose to the GraphQL Schema, just export them directly here and it'll
// be resolved as per configuration from "src/graphql/schema.ts".

export { SortDirection } from '@/shared/constants';
export { UserSortField } from '@/modules/user/constants/user-sort-field.enum';
