// tslint:disable:no-any

import { ContextBase } from './context-base.query-builder';
import Objection, { Model, OrderByDirection } from 'objection';
import _ from 'lodash';
import { columnToProperty } from './convert';
import { IOrderByOperation } from './IOrderByOperation';

export class OrderByCoalesceQueryBuilder<M extends Model, R = M[]> extends ContextBase<M, R> {
  orderBy = (column: Objection.ColumnRef | Objection.ColumnRefOrOrderByDescriptor[], order: OrderByDirection = 'asc') => {
    if (this.$flag('runBefore')) {
      // orderBy was called from an onBuild handler
      return super.orderBy(column as any, order);
    }

    this.$data<IOrderByOperation[]>('orderBy', (this.$data<IOrderByOperation[]>('orderBy') || []).concat([{ column, order }]));

    return this.runBefore((result, builder) => {
      this.buildOrderBy(builder);
      return result;
    });
  };

  orderByCoalesce(
    column: Objection.ColumnRef | Objection.ColumnRefOrOrderByDescriptor[],
    order: OrderByDirection = 'asc',
    coalesceValues: any[] = [''],
  ) {
    return this.$data(
      'orderByCoalesce',
      Object.assign({}, this.$data('orderByCoalesce'), {
        [columnToProperty(this.modelClass(), column)]: _.castArray(coalesceValues),
      }),
    ).orderBy(column, order);
  }

  private buildOrderBy(builder: this) {
    this.lockStatement(builder, 'runBefore', () => {
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
    });
  }

  protected stringifyObjectionBuilder(builder: this, val: any) {
    if (val && typeof val.toKnexRaw === 'function') {
      return val.toKnexRaw(builder);
    }
    return val;
  }
}
