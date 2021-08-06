const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'service';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Service Name?',
      default: args.module?.name,
    },
    {
      type: 'input',
      name: `${KEY}.modelName`,
      message: 'Model Name for this Service?',
      default: args.dbModel?.name,
    },
  ]);

  Object.assign(args, answer);
};
