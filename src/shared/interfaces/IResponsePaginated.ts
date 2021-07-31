import { IPageInfo } from './IPageInfo';

export interface IResponsePaginated<T> {
  data: T[];
  pageInfo: IPageInfo;
  totalCount: number;
  remaining: number;
}
