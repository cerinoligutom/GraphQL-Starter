// tslint:disable:no-any
import _ from 'lodash';
import { ModelClass, Model, ReferenceBuilder } from 'objection';

function stringToProperty<M extends Model>(model: ModelClass<M>, str: string): string {
  const prop = str.substr(str.lastIndexOf('.') + 1);
  return (model as any).columnNameToPropertyName(prop);
}

function refToProperty<M extends Model>(model: ModelClass<M>, ref: any) {
  const parsedExpr = ref.parsedExpr || ref.reference; // parsedExpr for Objection v2
  const { columnName, access } = parsedExpr;

  const columnPieces = columnName.split('.');
  columnPieces[columnPieces.length - 1] = (model as any).columnNameToPropertyName(_.last(columnPieces));

  const prop = `${columnPieces.join('.')}.${access.map((a: any) => a.ref).join('.')}`;
  return _.trim(prop, '.');
}

function columnToProperty<M extends Model>(model: ModelClass<M>, col: string | ReferenceBuilder) {
  if (typeof col === 'string') {
    return stringToProperty(model, col);
  }

  if (_.get(col, 'constructor.name') === 'ReferenceBuilder') {
    return refToProperty(model, col);
  }

  throw new TypeError('orderBy column must be string or ReferenceBuilder');
}

export { columnToProperty };
