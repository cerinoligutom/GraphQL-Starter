export interface IPageInfo {
  startCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
}
