// tslint:disable: max-classes-per-file
import Objection, { compose, PartialModelObject } from 'objection';
import knex from '../../knex';

const cursorMixin = require('objection-cursor');
import { mapToCursorPaginationResult } from './objection-cursor.plugin-helper';

// Attach knex to objection model
Objection.Model.knex(knex);

// Insert plugin/mixin if there's any, e.g. objection-timestamps
// but timestamps should be generated
// in the DB level instead of app level.
const EnhancedModel = compose([
  cursorMixin({
    nodes: true,
    results: false,
    pageInfo: {
      total: true,
      remaining: true,
      hasNext: true,
      hasPrevious: true,
    },
  }),
])(Objection.Model);

export class BaseModel extends EnhancedModel {
  static get QueryBuilder() {
    return class<M extends Objection.Model, R = M[]> extends EnhancedModel.QueryBuilder<M, R> {
      cursorPage(cursor?: string | null, before = false) {
        // tslint:disable-next-line: no-any
        return super.cursorPage(cursor, before).runAfter(result => mapToCursorPaginationResult(result as any));
      }
    };
  }

  /**
   * Set this object's property values. Internally calls `Objection.Model.$set()` method but with
   * auto completion based on this model's properties.
   *
   * Related: https://github.com/Vincit/objection.js/issues/1716
   */
  set(values: PartialModelObject<this>): this {
    return this.$set(values);
  }
}
