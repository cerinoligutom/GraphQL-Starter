/* eslint-disable no-await-in-loop */
const inquirer = require('inquirer');

const dbModelPrompt = require('./database-model.prompt');

const ScaffoldType = {
  DB_MODEL: 'Database Model',
};

module.exports = {
  prompt: async ({ args }) => {
    const { scaffoldTypes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'scaffoldTypes',
        message: 'What would you like to generate?',
        choices: Object.values(ScaffoldType),
      },
    ]);

    for (const scaffoldType of scaffoldTypes) {
      switch (scaffoldType) {
        case ScaffoldType.DB_MODEL: {
          await dbModelPrompt(args);
          break;
        }

        default:
      }
    }

    return args;
  },
};
