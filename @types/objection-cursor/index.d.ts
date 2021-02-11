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
