/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import Objection, { compose, PartialModelObject } from 'objection';
import knex from '../../knex';
import { mapToCursorPaginationResult } from './objection-cursor.plugin-helper';
import { Ability } from '@casl/ability';
import { SystemAbilityAction, SystemAbilitySubject } from '@app/core/authorization';
import { screenPermittedFields } from '@app/utils';

const cursorMixin = require('objection-cursor');

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

interface ISetOptions {
  ability: Ability;
  action: SystemAbilityAction;
}
type ModelName = Exclude<Extract<SystemAbilitySubject, string>, 'all'>;

export class BaseModel extends EnhancedModel {
  static get QueryBuilder() {
    return class<M extends Objection.Model, R = M[]> extends EnhancedModel.QueryBuilder<M, R> {
      cursorPage(cursor?: string | null, before = false) {
        return super.cursorPage(cursor, before).runAfter((result) => mapToCursorPaginationResult(result as any));
      }
    };
  }

  /**
   * For CASL Ability Subject
   */
  static readonly modelName: ModelName;

  private get _modelName(): ModelName {
    const model = this.constructor as typeof BaseModel;
    return model.modelName;
  }

  /**
   * Set this object's property values. Internally calls `Objection.Model.$set()` method but with
   * auto completion based on this model's properties.
   *
   * Related: https://github.com/Vincit/objection.js/issues/1716
   */
  set(values: PartialModelObject<this>, options?: ISetOptions): this {
    if (!options) {
      return this.$set(values);
    }

    const { ability, action } = options;
    const screenedValues = screenPermittedFields(values, {
      ability,
      action,
      subject: this._modelName,
    });

    return this.$set(screenedValues);
  }
}
