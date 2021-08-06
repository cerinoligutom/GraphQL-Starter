const inquirer = require('inquirer');
const { pascalCase } = require('change-case');
const modulePrompt = require('./module.prompt');

const KEY = 'gqlResolver';

const ResolverType = {
  QUERY: 'Query',
  MUTATION: 'Mutation',
  SUBSCRIPTION: 'Subscription',
};

module.exports = async (args) => {
  args[KEY] = {};

  await modulePrompt(args);

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: `${KEY}.gqlFileName`,
      message: 'GraphQL File Name?',
      default: args.module?.name,
    },
    {
      type: 'input',
      name: `${KEY}.name`,
      message: 'GraphQL Resolver Name?',
      default: args.useCase?.name,
    },
    {
      type: 'input',
      name: `${KEY}.useCaseName`,
      message: 'Use Case name for this Resolver?',
      default: args.useCase?.name,
    },
    {
      type: 'list',
      name: `${KEY}.resolverType`,
      message: 'Resolver Type?',
      choices: Object.values(ResolverType),
    },
    {
      when(answers) {
        return answers[KEY].resolverType === ResolverType.QUERY;
      },
      type: 'input',
      name: `${KEY}.queryResolver.gqlReturnTypeName`,
      message: 'Return Type name of the GraphQL Query in the schema?',
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
    },
  ]);

  Object.assign(args, answer);
};