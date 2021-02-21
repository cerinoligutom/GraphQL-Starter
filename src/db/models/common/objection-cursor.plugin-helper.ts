import { IObjectionCursorResult } from 'objection-cursor';
import { ICursorPaginationResult } from '@/shared/interfaces';

export function mapToCursorPaginationResult<M>({ nodes, pageInfo }: IObjectionCursorResult<M>): ICursorPaginationResult<M> {
  const result: ICursorPaginationResult<M> = {
    // As of objection-cursor@1.2.1, the returned model from the plugin and ICursorResult interface are the same
    // so we can directly assign the "nodes" from the "cursorPage()" results to our "results" property.
    results: nodes,

    pageInfo: {
      endCursor: nodes[nodes.length - 1]?.cursor ?? null,
      startCursor: nodes[0]?.cursor ?? null,
      hasNextPage: pageInfo.hasNext,
      hasPreviousPage: pageInfo.hasPrevious,
    },
    remaining: pageInfo.remaining,
    totalCount: pageInfo.total,
  };
  return result;
}
