import { knex } from 'knex';
import config from '../../knexfile';

const knexInstance = knex(config);

export const ping = async (): Promise<void> => {
  try {
    await knexInstance.raw('select 1+1 as result');
    console.info('[OK] PG DB');
    return await Promise.resolve();
  } catch (err) {
    console.error('[FAIL] PG DB');
    console.error(err);
    return Promise.reject(err);
  }
};

export default knexInstance;
