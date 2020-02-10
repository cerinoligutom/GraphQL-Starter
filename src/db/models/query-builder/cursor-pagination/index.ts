import { Model, Page, QueryBuilder } from 'objection';
import { CursorQueryBuilder } from './cursor.query-builder';

export class CursorPaginationQueryBuilder<M extends Model, R = M[]> extends CursorQueryBuilder<M, R> {
  // These are necessary. See https://vincit.github.io/objection.js/recipes/custom-query-builder.html#extending-the-query-builder-in-typescript
  ArrayQueryBuilderType!: CursorPaginationQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CursorPaginationQueryBuilder<M, M>;
  NumberQueryBuilderType!: CursorPaginationQueryBuilder<M, number>;
  PageQueryBuilderType!: CursorPaginationQueryBuilder<M, Page<M>>;
}
