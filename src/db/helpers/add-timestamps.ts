import { Knex } from 'knex';

interface IAddTimeStamps {
  createdAt: boolean;
  updatedAt: boolean;
}
export const addTimeStamps = async (knex: Knex, tableName: string, timestamps: IAddTimeStamps): Promise<any> => {
  return knex.schema.alterTable(tableName, (t) => {
    if (timestamps.createdAt) {
      t.timestamp('createdAt', { precision: 3 }).defaultTo(knex.fn.now());
    }
    if (timestamps.updatedAt) {
      t.timestamp('updatedAt', { precision: 3 }).defaultTo(knex.fn.now());
    }
  });
};
