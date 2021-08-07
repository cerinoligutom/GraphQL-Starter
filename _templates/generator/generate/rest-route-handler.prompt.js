const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'restRouteHandler';
const PROMPT_PREFIX = '? [REST Route Handler]';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Route Handler name?',
      default: args.useCase?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.useCaseName`,
      message: 'Use Case to import for this Route Handler?',
      default: args.useCase?.name,
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
