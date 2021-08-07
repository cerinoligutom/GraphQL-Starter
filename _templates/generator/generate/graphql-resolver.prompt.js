const inquirer = require('inquirer');
const { pascalCase } = require('change-case');
const modulePrompt = require('./module.prompt');

const KEY = 'gqlResolver';
const PROMPT_PREFIX = '? [GQL Resolver]';

const ResolverType = {
  QUERY: 'Query',
  MUTATION: 'Mutation',
};

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.gqlFileName`,
      message: 'GraphQL File name?',
      default: args.module?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'GraphQL Resolver name?',
      default: args.useCase?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'input',
      name: `${KEY}.useCaseName`,
      message: 'Use Case to import for this Resolver?',
      default: args.useCase?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      type: 'list',
      name: `${KEY}.resolverType`,
      message: 'Resolver Type?',
      choices: Object.values(ResolverType),
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return answers[KEY].resolverType === ResolverType.QUERY;
      },
      type: 'input',
      name: `${KEY}.queryResolver.gqlReturnTypeName`,
      message: 'Return Type name of the GraphQL Query in the schema?',
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return answers[KEY].resolverType === ResolverType.QUERY;
      },
      type: 'confirm',
      name: `${KEY}.queryResolver.gqlReturnTypeExists`,
      message(answers) {
        const { gqlReturnTypeName } = answers[KEY].queryResolver;

        return `Has the GraphQL type '${gqlReturnTypeName}' been already defined? If not, it will be generated.`;
      },
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return answers[KEY].resolverType === ResolverType.QUERY;
      },
      type: 'list',
      name: `${KEY}.queryResolver.gqlReturnType`,
      message: 'How should the Return Type look like?',
      choices(answers) {
        const gqlReturnTypeName = pascalCase(answers[KEY].queryResolver.gqlReturnTypeName);

        return [
          `${gqlReturnTypeName}`,
          `${gqlReturnTypeName}!`,
          `[${gqlReturnTypeName}]`,
          `[${gqlReturnTypeName}]!`,
          `[${gqlReturnTypeName}!]`,
          `[${gqlReturnTypeName}!]!`,
        ];
      },
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
