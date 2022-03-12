---
to: '<%= locals.dbSeed ? `src/db/seeds/${locals.dbSeed?.fileName}.ts` : null %>'
---
import { Knex } from 'knex';
import { <%= h.changeCase.pascal(locals.dbSeed?.modelName) %>Model } from '@/db/models';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(<%= h.changeCase.pascal(locals.dbSeed?.modelName) %>Model.tableName).del();

  // Inserts seed entries
  const entry = new <%= h.changeCase.pascal(locals.dbSeed?.modelName) %>Model();
  
  // TODO: Change accordingly
  entry.set({ id: 'foo' });

  await entry.$query(knex).insert();
}
