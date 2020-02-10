// tslint:disable:no-any

import { Model } from 'objection';
import _ from 'lodash';
import { OrderByCoalesceQueryBuilder } from './order-by-coalesce.query-builder';
import { IOrderByOperation } from './IOrderByOperation';
import { columnToProperty } from './convert';
import { deserializeCursor, serializeCursor } from './serialize';
import { IObject } from '@app/core/interfaces';

const DEFAULT_LIMIT = 20;

interface ICursorPaginationResult<M> {
  results: ICursorResult<M>[];
  pageInfo: IPageInfo;
}

interface ICursorResult<M> {
  cursor: string;
  data: M;
}

interface IPageInfo {
  startCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
}

export class CursorQueryBuilder<M extends Model, R = M[]> extends OrderByCoalesceQueryBuilder<M, R> {
  cursorPage(cursor: string, before = false) {
    return new Promise(resolve => {
      this.runBefore((result, builder) => {
        // Save current builder (before additional where statements) for pageInfo (total)
        const originalQuery = builder
          .clone()
          .$flag('originalQuery', true)
          .$flag('onBuild', false);

        builder.$data('originalQuery', originalQuery);

        return result;
      })
        .onBuild(builder => this.buildCursor(builder, cursor, before))
        .runAfter(async (models, builder) => {
          const resultModels = (models as unknown) as M[];

          // We want to always return results in the same order; as if turning pages in a book
          if (before) {
            // We know on runtime, this is the result
            resultModels.reverse();
          }

          const item = this.getPartialCursorItem(cursor);

          /* When we reach end while going forward, save the last element of the last page, but discard
           * first element of last page. If we try to go forward, we get an empty result, because
           * there are no elements after the last one. If we go back from there, we get results for
           * the last page. The opposite is true when going backward from the first page.
           */
          const orderByOps = this.getOrderByOperations(before);

          const first = resultModels.length > 0 ? resultModels[0] : before ? item : null;
          const last = resultModels.length > 0 ? resultModels[resultModels.length - 1] : before ? null : item;

          const results = resultModels.map<ICursorResult<M>>(resultModel => ({
            cursor: serializeCursor(orderByOps, resultModel),
            data: resultModel,
          }));

          const originalQueryResultSize = await builder.$data('originalQuery').resultSize();
          const total = originalQueryResultSize;
          const currentQueryResultSize = await builder.$data('resultSizeQuery').resultSize();
          const remaining = currentQueryResultSize - resultModels.length;

          const pageInfo: IPageInfo = {
            startCursor: serializeCursor(orderByOps, first),
            endCursor: serializeCursor(orderByOps, last),
            hasNextPage: (!before && remaining > 0) || (before && total - currentQueryResultSize > 0),
            hasPreviousPage: (before && remaining > 0) || (!before && total - currentQueryResultSize > 0),
          };

          const cursorPaginationResult: ICursorPaginationResult<M> = {
            results,
            pageInfo,
          };

          resolve(cursorPaginationResult);

          return resultModels;
        });
    });
  }

  nextCursorPage(cursor: string) {
    return this.cursorPage(cursor, false);
  }

  previousCursorPage(cursor: string) {
    return this.cursorPage(cursor, true);
  }

  private buildCursor(builder: this, cursor: string, before: boolean) {
    if (builder.$flag('originalQuery')) {
      return;
    }

    const orderByOps = this.getOrderByOperations(before);
    const item = this.getPartialCursorItem(cursor);

    this.addWhereStatements(builder, orderByOps, item);

    if (!builder.has(/limit/)) {
      builder.limit(DEFAULT_LIMIT);
    }

    // Swap orderBy directions when going backward
    if (before) {
      // This method exists on runtime
      (builder as any).forEachOperation(/orderBy/, (op: any) => {
        op.args[1] = op.args[1] === 'asc' ? 'desc' : 'asc';
      });
    }

    // Save copy of current builder for pageInfo (hasNext, remaining, etc.)
    const resultSizeQuery = builder
      .clone()
      .$flag('resultSizeQuery', true)
      .$flag('onBuild', false);

    builder.$data('resultSizeQuery', resultSizeQuery);
  }

  private getOrderByOperations(before = false) {
    const orderByData = this.$data<IOrderByOperation[]>('orderBy') || [];

    return orderByData.map<IOrderByOperation>(({ column, order = 'asc' }) => ({
      column,
      property: columnToProperty(this.modelClass(), column),
      // If going backward: asc => desc, desc => asc
      order: before === (order.toLowerCase() === 'asc') ? 'desc' : 'asc',
    }));
  }

  private getPartialCursorItem(cursor: string) {
    // Direction doesn't matter here, since we only want to know if a column exists
    const orderByOps = this.getOrderByOperations();

    // Get partial item from cursor
    return deserializeCursor(orderByOps, cursor);
  }

  private getCoalescedOp(builder: this, coalesceObj: IObject = {}, { column: origColumn, property, order }: IOrderByOperation, item: any) {
    let value = _.get(item, property, null);
    let column: any = null;

    if (coalesceObj[property]) {
      const model = builder.modelClass();
      const mappedCoalesce = coalesceObj[property].map(v => this.stringifyObjectionBuilder(builder, v));
      const coalesceBindingsStr = mappedCoalesce.map(() => '?');
      column = this.stringifyObjectionBuilder(builder, origColumn);
      value = this.stringifyObjectionBuilder(builder, value);
      column = model.raw(`COALESCE(??, ${coalesceBindingsStr})`, [column].concat(mappedCoalesce));
      value = model.raw(`COALESCE(?, ${coalesceBindingsStr})`, [value].concat(mappedCoalesce));
    }

    return { column, property, value, order };
  }

  private addWhereComposites(builder: this, composites: IOrderByOperation[], item: any) {
    const orderByCoalesceData = this.$data('orderByCoalesce');
    for (const op of composites) {
      const { column, value } = this.getCoalescedOp(this, orderByCoalesceData, op, item);
      builder.andWhere(column, value);
    }
  }

  private addWhereStatements(builder: this, orderByOperations: IOrderByOperation[], item: any, composites: IOrderByOperation[] = []) {
    if (!item) {
      return;
    }

    if (orderByOperations.length === 0) {
      throw new Error('Invalid cursor');
    }

    const orderByCoalesceData = this.$data('orderByCoalesce');
    const nextOperation = orderByOperations[0];

    const { column, value, order } = this.getCoalescedOp(this, orderByCoalesceData, nextOperation, item);
    const comp = order === 'asc' ? '>' : '<';

    if (orderByOperations.length === 1) {
      return builder.where(column, comp, value);
    }

    // tslint:disable-next-line: no-this-assignment
    const self = this;
    // tslint:disable-next-line: no-parameter-reassignment
    composites = [nextOperation, ...composites];

    builder.andWhere(function() {
      this.where(column, comp, value);
      this.orWhere(function() {
        self.addWhereComposites(this, composites, item);
        this.andWhere(function() {
          // Add where statements recursively
          self.addWhereStatements(this, orderByOperations.slice(1), item, composites);
        });
      });
    });

    return;
  }
}
