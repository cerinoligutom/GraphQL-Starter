const inquirer = require('inquirer');

const KEY = 'dbModel';
const PROMPT_PREFIX = '? [DB Model]';

module.exports = async (args) => {
  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Model Name?',
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
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
