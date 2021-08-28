const inquirer = require('inquirer');
const { paramCase } = require('change-case');

const KEY = 'dbSeed';
const PROMPT_PREFIX = '? [DB Seed]';

module.exports = async (args) => {
  args[KEY] = {};

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.fileName`,
      message: 'Migration Seed File Name?',
      prefix: PROMPT_PREFIX,
      filter(input) {
        return paramCase(input);
      },
      transformer(input) {
        return paramCase(input);
      },
    },
    {
      type: 'input',
      name: `${KEY}.modelName`,
      message: 'Database Model Name?',
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
