---
to: '<%= locals.dbModel ? `src/db/models/${h.changeCase.param(locals.dbModel.name)}.model.ts` : null %>'
---
<% if (locals.dbModel?.hasOwnId) { -%>
import { BaseModel } from './common/base-model';
<% } else { -%>
import { ObjectionModel } from './common/objection-model';
<% } -%>
import { RelationMappings } from 'objection';
import * as yup from 'yup';

export class <%= h.changeCase.pascal(locals.dbModel?.name) %>Model extends <%= locals.dbModel?.hasOwnId ? 'BaseModel' : 'ObjectionModel' %> {
  static tableName = '<%= locals.dbModel?.tableName %>';

  static relationMappings: RelationMappings = {};

  static yupSchema = {
    
  };

  // Database Fields


  // Eager loaded properties

}
