import { SortDirection } from '../constants';

// Currently, it's not possible to create generic enums as stated from the docs.
// https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types
// There's an ongoing issue with this: https://github.com/microsoft/TypeScript/issues/30611
export interface ICursorPaginationArgs<SF> {
  first: number;
  before?: string | null;
  after?: string | null;
  sortDirection: SortDirection;
  sortField: SF;
}
