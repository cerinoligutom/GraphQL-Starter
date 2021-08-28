const inquirer = require('inquirer');

const KEY = 'module';
const PROMPT_PREFIX = '? [Module]';

module.exports = async (args) => {
  // Skip this prompt if it has been answered already.
  if (args[KEY]) return;

  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Module name?',
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
