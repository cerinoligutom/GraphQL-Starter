import Knex from 'knex';
import config from '../../knexfile';

const knex = Knex(config);

export const ping = async (): Promise<void> => {
  try {
    await knex.raw('select 1+1 as result');
    console.info('[OK] PG DB');
    return await Promise.resolve();
  } catch (err) {
    console.error('[FAIL] PG DB');
    console.error(err);
    return Promise.reject(err);
  }
};

export default knex;
