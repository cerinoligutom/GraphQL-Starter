const inquirer = require('inquirer');

module.exports = async (args) => {
  args.dbModel = {};

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'dbModel.hasOwnId',
      message: 'Should this model have its own ID?',
    },
    {
      type: 'input',
      name: 'dbModel.tableName',
      message: 'What is the name of the table?',
    },
  ]);

  Object.assign(args, answer);
};
