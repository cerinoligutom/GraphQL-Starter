import { ICursorPaginationResult } from '@/shared/interfaces';

declare module 'objection' {
  import 'objection';

  interface QueryBuilder<M extends Model, R = M[]> extends Promise<R> {
    cursorPage(cursor: string | null | undefined, before?: boolean): this;
    nextCursorPage(cursor?: string | null): Promise<ICursorPaginationResult<M>>;
    previousCursorPage(cursor?: string | null): Promise<ICursorPaginationResult<M>>;
  }
}
