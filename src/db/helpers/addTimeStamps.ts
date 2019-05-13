import * as Knex from 'knex';

export const addTimeStamps = async (knex: Knex, tableName: string) => {
  return knex.schema
    .alterTable(tableName, t => {
      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
    .then(() => {
      // We need to ensure the function exists, then add the table trigger
      return knex.raw(`
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW."updatedAt" = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_${tableName}_updated_at
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();
      `);
    });
};
