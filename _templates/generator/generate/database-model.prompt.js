const inquirer = require('inquirer');
const { pluralize } = require('inflection');
const { snakeCase } = require('change-case');

const KEY = 'dbModel';
const PROMPT_PREFIX = '? [DB Model]';

module.exports = async (args) => {
  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Model name?',
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'confirm',
      name: `${KEY}.hasOwnId`,
      message: 'Should this model have its own ID?',
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.tableName`,
      message: 'Database Table Name for this Model?',
      default(answers) {
        return args.dbMigration?.tableName || snakeCase(pluralize(answers[KEY].name));
      },
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
