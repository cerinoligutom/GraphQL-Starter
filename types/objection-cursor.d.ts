import { ICursorPaginationResult } from '@app/core/interfaces';

declare module 'objection' {
  interface QueryBuilder<M extends Model, R = M[]> extends Promise<R> {
    cursorPage(cursor: string | null | undefined, before?: boolean): this;
    nextCursorPage(cursor?: string | null): Promise<ICursorPaginationResult<M>>;
    previousCursorPage(cursor?: string | null): Promise<ICursorPaginationResult<M>>;
  }
}

declare module 'objection-cursor' {
  interface IObjectionCursorResult<M> {
    nodes: Array<{
      data: M;
      cursor: string;
    }>;
    pageInfo: {
      total: number;
      remaining: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }
}
