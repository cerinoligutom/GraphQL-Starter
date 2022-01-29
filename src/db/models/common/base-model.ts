/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { UniqueID } from '@/shared/types';
import { QueryContext } from 'objection';
import { v4 as uuidV4 } from 'uuid';
import { ObjectionModel } from './objection-model';

// If you have an associative (or junction) table, extend the Objection Model class directly
export class BaseModel extends ObjectionModel {
  static idColumn = 'id';

  id!: UniqueID;

  $beforeInsert(queryContext: QueryContext) {
    super.$beforeInsert(queryContext);

    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
