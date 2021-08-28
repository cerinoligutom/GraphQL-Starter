const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'service';
const PROMPT_PREFIX = '? [Service]';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Service name?',
      default: args.module?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.modelName`,
      message: 'Model to import for this Service?',
      default: args.dbModel?.name,
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
