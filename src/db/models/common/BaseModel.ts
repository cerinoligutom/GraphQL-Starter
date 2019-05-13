import Objection, { compose } from 'objection';
import knex from '../../knex-config';

// Attach knex to objection model
Objection.Model.knex(knex);

import objectionCursorPlugin from 'objection-cursor';

const cursorMixin = objectionCursorPlugin({
  pageInfo: {
    total: true,
    hasNext: true,
    hasPrevious: true,
    remaining: true,
  },
});

// Insert plugins if there's any, e.g. objection-timestamps
// but timestamps should be generated
// in the DB level instead of app level.
const enhancedModel = compose([cursorMixin])(Objection.Model);

export class BaseModel extends enhancedModel {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
