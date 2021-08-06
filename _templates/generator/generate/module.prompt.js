const inquirer = require('inquirer');

const KEY = 'module';

module.exports = async (args) => {
  // Skip this prompt if it has been answered already.
  if (args[KEY]) return;

  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Module Name?',
    },
  ]);

  Object.assign(args, answer);
};
