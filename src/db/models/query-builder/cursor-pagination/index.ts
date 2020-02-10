import { Model, Page, QueryBuilder } from 'objection';
import { CursorQueryBuilder } from './cursor.query-builder';

export class CursorPaginationQueryBuilder<M extends Model, R = M[]> extends CursorQueryBuilder<M, R> {
  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: CursorPaginationQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CursorPaginationQueryBuilder<M, M>;
  NumberQueryBuilderType!: CursorPaginationQueryBuilder<M, number>;
  PageQueryBuilderType!: CursorPaginationQueryBuilder<M, Page<M>>;
}
