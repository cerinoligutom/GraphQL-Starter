import Objection, { compose, QueryBuilder } from 'objection';
import knex from '../../knex';
import { CursorPaginationQueryBuilder } from '../query-builder/cursor-pagination';

// Attach knex to objection model
Objection.Model.knex(knex);

// Insert plugins if there's any, e.g. objection-timestamps
// but timestamps should be generated
// in the DB level instead of app level.
const EnhancedModel = compose([])(Objection.Model);

export class BaseModel extends EnhancedModel {
  // Both of these are needed.
  QueryBuilderType!: CursorPaginationQueryBuilder<this>;
  static QueryBuilder = CursorPaginationQueryBuilder;
}
