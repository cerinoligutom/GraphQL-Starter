import { ICursorResult } from './ICursorResult';
import { IPageInfo } from './IPageInfo';

export interface ICursorPaginationResult<M> {
  results: Array<ICursorResult<M>>;
  pageInfo: IPageInfo;
  totalCount: number;
  remaining: number;
}
