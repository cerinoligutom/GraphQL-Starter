const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'restRouteHandler';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Route Handler Name?',
      default: args.useCase?.name,
    },
    {
      type: 'input',
      name: `${KEY}.useCaseName`,
      message: 'Use Case Name for this Route Handler?',
      default: args.useCase?.name,
    },
  ]);

  Object.assign(args, answer);
};
