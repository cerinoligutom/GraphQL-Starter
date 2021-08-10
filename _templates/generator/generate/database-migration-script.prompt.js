const inquirer = require('inquirer');
const { paramCase } = require('change-case');

const KEY = 'dbMigration';
const PROMPT_PREFIX = '? [DB Migration]';

/**
 * Based on [Knex timestamp's implementation](https://github.com/knex/knex/blob/1744c8c2655a8362260ba987d706ec3473681a78/lib/migrations/util/timestamp.js).
 */
function createTimestamp() {
  const now = new Date();

  return (
    now.getUTCFullYear().toString() +
    (now.getUTCMonth() + 1).toString().padStart(2, '0') +
    now.getUTCDate().toString().padStart(2, '0') +
    now.getUTCHours().toString().padStart(2, '0') +
    now.getUTCMinutes().toString().padStart(2, '0') +
    now.getUTCSeconds().toString().padStart(2, '0')
  );
}

module.exports = async (args) => {
  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.fileName`,
      message: 'Migration Script Name?',
      prefix: PROMPT_PREFIX,
      filter(input) {
        return `${createTimestamp()}_${paramCase(input)}`;
      },
      transformer(input) {
        return `${createTimestamp()}_${paramCase(input)}`;
      },
    },
    {
      type: 'input',
      name: `${KEY}.tableName`,
      message: 'Database Table Name?',
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
