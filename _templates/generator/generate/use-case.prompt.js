const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'useCase';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Use Case Name?',
    },
  ]);

  Object.assign(args, answer);
};
