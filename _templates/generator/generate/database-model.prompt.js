const inquirer = require('inquirer');

const KEY = 'dbModel';

module.exports = async (args) => {
  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'Model Name?',
    },
    {
      type: 'confirm',
      name: `${KEY}.hasOwnId`,
      message: 'Should this model have its own ID?',
    },
    {
      type: 'input',
      name: `${KEY}.tableName`,
      message: 'Database Table Name for this Model?',
    },
  ]);

  Object.assign(args, answer);
};
