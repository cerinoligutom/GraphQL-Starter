/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Objection, { compose, PartialModelObject } from 'objection';
import knexInstance from '@/db/knex';
import { mapToCursorPaginationResult } from './objection-cursor.plugin-helper';

const cursorMixin = require('objection-cursor');

// Attach knex to objection model
Objection.Model.knex(knexInstance);

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

export class ObjectionModel extends EnhancedModel {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static get QueryBuilder() {
    return class ObjectionModelQueryBuilder<M extends Objection.Model, R = M[]> extends EnhancedModel.QueryBuilder<M, R> {
      cursorPage(cursor?: string | null, before = false) {
        return super.cursorPage(cursor, before).runAfter((result) => mapToCursorPaginationResult(result as any));
      }
    };
  }

  /**
   * Set this object's property values. Internally calls `Objection.Model.$set()` method but with
   * auto completion based on this model's properties.
   *
   * Related: https://github.com/Vincit/objection.js/issues/1716
   */
  set(values: PartialModelObject<this>): void {
    this.$set(values);
  }
}
