import Objection, { compose, QueryBuilder } from 'objection';
import knex from '../../knex';
import base64url from 'base64url';

// Attach knex to objection model
Objection.Model.knex(knex);

// Insert plugins if there's any, e.g. objection-timestamps
// but timestamps should be generated
// in the DB level instead of app level.
const EnhancedModel = compose([])(Objection.Model);

export class BaseModel extends EnhancedModel {
  static async nextCursorPage<QM extends Objection.Model>(query: QueryBuilder<QM>, cursor?: string) {
    return this.cursorPage(query, cursor, false);
  }

  static async previousCursorPage<QM extends Objection.Model>(query: QueryBuilder<QM>, cursor?: string) {
    return this.cursorPage(query, cursor, true);
  }

  private static async cursorPage<QM extends Objection.Model>(
    originalQuery: QueryBuilder<QM>,
    cursor: string = '',
    before: boolean = false,
  ) {
    // Add 'Order By' info to the query builder context for custom cursor based pagination purposes.
    // tslint:disable-next-line: no-any
    (originalQuery as any).forEachOperation(/orderBy/, (op: any) => {
      const opColName = op.args[0];
      const opColDir = op.args[1] ? op.args[1].toLowerCase() : 'asc'; // Ascending is the default order for 'Order By' statements

      const orderByContext = originalQuery.context().orderBy || [];
      orderByContext.push({ col: opColName, dir: opColDir });
      originalQuery.mergeContext({ orderBy: orderByContext });
    });

    const { orderBy } = originalQuery.context() as IObjectionQueryBuilderContext;
    if (!orderBy) {
      throw new Error(`At least 1 'Order By' statement is required.`);
    }
    if (orderBy && orderBy.length > 1) {
      throw new Error(`Only 1 'Order By' statement is supported currently.`);
    }

    // Currently, we only require and support 1 'Order By' statement so let's access index 0 directly.
    const { col, dir } = orderBy[0];
    let direction = dir ? dir.toLowerCase() : 'asc';

    // Do note modify original query. Make a copy instead.
    let originalQueryCopy = originalQuery.clone();

    // We'll use ID as a surrogate key in case of multiple rows having the same value.
    originalQueryCopy = originalQueryCopy.orderBy('id', dir);
    let query = originalQueryCopy.clone();

    // If going backward: asc => desc, desc => asc
    if (before) {
      direction = direction === 'asc' ? 'desc' : 'asc';

      // tslint:disable-next-line: no-any
      (query as any).forEachOperation(/orderBy/, (op: any) => {
        op.args[1] = op.args[1] === 'asc' ? 'desc' : 'asc';
      });
    }

    if (cursor) {
      const [columnValue, id] = this.decodeCursor(cursor);

      if (columnValue === null) {
        throw new Error(`Invalid cursor. Cursor value is 'null'.`);
      }

      const whereOp = direction === 'asc' ? '>' : '<';

      query = query.andWhereRaw(`(??, ??) ${whereOp} (?, ?)`, [col, 'id', columnValue, id]);
    }

    const [results, total, queryResultSize] = await Promise.all([query, originalQueryCopy.resultSize(), query.resultSize()]);

    if (before) {
      results.reverse();
    }

    const cursorPaginationResult: ICursorPaginationResult<QM> = {
      edges: [],
      nodes: [],
      pageInfo: {
        startCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: null,
      },
      totalCount: 0,
    };

    cursorPaginationResult.edges = results.map(result => ({
      cursor: this.generateCursor([result[col as keyof typeof result], result['id' as keyof typeof result]]),
      node: result,
    }));
    cursorPaginationResult.nodes = results;

    // Compute Page Info
    const remaining = queryResultSize - results.length;
    const hasNextPage = (!before && remaining > 0) || (before && total - queryResultSize > 0);
    const hasPreviousPage = (before && remaining > 0) || (!before && total - queryResultSize > 0);

    const first = results.length > 0 ? results[0] : null;
    const last = results.length > 0 ? results[results.length - 1] : null;
    const startCursor = first ? this.generateCursor([first[col as keyof typeof first], first['id' as keyof typeof first]]) : null;
    const endCursor = last ? this.generateCursor([last[col as keyof typeof last], last['id' as keyof typeof last]]) : null;

    cursorPaginationResult.pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };

    cursorPaginationResult.totalCount = total;

    return cursorPaginationResult;
  }

  // tslint:disable-next-line: no-any
  private static generateCursor(values: any[]) {
    return values.map(value => base64url(JSON.stringify(value))).join('.');
  }

  private static decodeCursor(cursor: string) {
    return cursor.split('.').map(cursorValue => JSON.parse(base64url.decode(cursorValue)));
  }

  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

interface IObjectionQueryBuilderContext {
  orderBy?: [
    {
      col: string;
      dir: string;
    },
  ];
}

interface ICursorPaginationResult<T> {
  // tslint:disable-next-line: prefer-array-literal
  edges: Array<IEdge<T>>;
  nodes: T[];
  pageInfo: IPageInfo;
  totalCount: number;
}

interface IPageInfo {
  startCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
}

interface IEdge<T> {
  cursor: string;
  node: T;
}
