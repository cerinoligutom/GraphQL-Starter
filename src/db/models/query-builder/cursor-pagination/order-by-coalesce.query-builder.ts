// tslint:disable:no-any

import { ContextBase } from './context-base.query-builder';
import { Model } from 'objection';
import _ from 'lodash';
import { columnToProperty } from './convert';
import { IOrderByOperation } from './IOrderByOperation';

export class OrderByCoalesceQueryBuilder<M extends Model, R = M[]> extends ContextBase<M, R> {
  orderBy(column: any, order: 'asc' | 'desc' | 'ASC' | 'DESC' | undefined = 'asc') {
    if (this.$flag('runBefore')) {
      // orderBy was called from an onBuild handler
      return super.orderBy(column, order);
    }

    this.$data<IOrderByOperation[]>('orderBy', (this.$data<IOrderByOperation[]>('orderBy') || []).concat([{ column, order }]));

    return this.runBefore((result, builder) => {
      this.buildOrderBy(builder);
      return result;
    });
  }

  orderByCoalesce(column: string, order: 'asc' | 'desc' | 'ASC' | 'DESC' | undefined = 'asc', coalesceValues = ['']) {
    return this.$data(
      'orderByCoalesce',
      Object.assign({}, this.$data('orderByCoalesce'), {
        [columnToProperty(this.modelClass(), column)]: _.castArray(coalesceValues),
      }),
    ).orderBy(column, order);
  }

  private buildOrderBy(builder: this) {
    const model = this.modelClass();
    const orderByData: IOrderByOperation[] = builder.$data('orderBy') || [];
    const orderByCoalesceData: any = builder.$data('orderByCoalesce') || {};

    for (const { column, order } of orderByData) {
      const coalesceValues = orderByCoalesceData[columnToProperty(model, column)];

      if (coalesceValues) {
        const mappedCoalesce = coalesceValues.map((val: any) => this.stringifyObjectionBuilder(builder, val));
        const colStr = this.stringifyObjectionBuilder(builder, column);

        const coalesceBindingsStr = coalesceValues.map(() => '?').join(', ');

        builder.orderBy(model.raw(`COALESCE(??, ${coalesceBindingsStr})`, [colStr].concat(mappedCoalesce)), order);
      } else {
        builder.orderBy(column, order);
      }
    }
  }

  protected stringifyObjectionBuilder(builder: this, val: any) {
    if (val && typeof val.toKnexRaw === 'function') {
      return val.toKnexRaw(builder);
    }
    return val;
  }
}
