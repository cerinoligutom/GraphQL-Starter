import Objection, { OrderByDirection } from 'objection';

export interface IOrderByOperation {
  column: Objection.ColumnRef | Objection.ColumnRefOrOrderByDescriptor[];
  order?: OrderByDirection;
  property?: string;
}
