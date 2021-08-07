const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'factory';
const PROMPT_PREFIX = '? [Factory]';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Factory name?',
      default: args.module?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.modelName`,
      message: 'Model to import for this Factory?',
      default: args.dbModel?.name,
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
