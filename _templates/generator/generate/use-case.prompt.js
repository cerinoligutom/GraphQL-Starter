const inquirer = require('inquirer');
const modulePrompt = require('./module.prompt');

const KEY = 'useCase';
const PROMPT_PREFIX = '? [Use Case]';

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Use Case name?',
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
