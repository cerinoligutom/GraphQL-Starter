const inquirer = require('inquirer');
const { pascalCase } = require('change-case');
const modulePrompt = require('./module.prompt');

const KEY = 'gqlResolver';
const PROMPT_PREFIX = '? [GQL Resolver]';

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
      name: `${KEY}.gqlSchemaFileName`,
      message: 'GraphQL Schema File name?',
      default: pascalCase(args.module?.name),
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
      type: 'list',
      name: `${KEY}.resolverType`,
      message: 'Resolver Type?',
      choices: Object.values(ResolverType),
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        [ResolverType.QUERY, ResolverType.MUTATION].includes(answers[KEY].resolverType);

        return [ResolverType.QUERY, ResolverType.MUTATION].includes(answers[KEY].resolverType);
      },
      type: 'input',
      name: `${KEY}.useCaseName`,
      message: 'Use Case to import for this Resolver?',
      default: args.useCase?.name,
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return [ResolverType.QUERY, ResolverType.SUBSCRIPTION].includes(answers[KEY].resolverType);
      },
      type: 'input',
      name: `${KEY}.common.gqlReturnTypeName`,
      message: 'Return Type name of the GraphQL Query in the schema?',
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return [ResolverType.QUERY, ResolverType.SUBSCRIPTION].includes(answers[KEY].resolverType);
      },
      type: 'confirm',
      name: `${KEY}.common.gqlReturnTypeExists`,
      message(answers) {
        const { gqlReturnTypeName } = answers[KEY].common;

        return `Has the GraphQL type '${pascalCase(gqlReturnTypeName)}' been already defined? If not, it will be generated.`;
      },
      prefix: PROMPT_PREFIX,
    },
    {
      when(answers) {
        return [ResolverType.QUERY, ResolverType.SUBSCRIPTION].includes(answers[KEY].resolverType);
      },
      type: 'list',
      name: `${KEY}.common.gqlReturnType`,
      message: 'How should the Return Type look like?',
      choices(answers) {
        const gqlReturnTypeName = pascalCase(answers[KEY].common.gqlReturnTypeName);

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
    {
      when(answers) {
        return answers[KEY].resolverType === ResolverType.SUBSCRIPTION;
      },
      type: 'input',
      name: `${KEY}.subscriptionResolver.eventName`,
      message: 'PubSub Trigger/Event name?',
      default(answers) {
        return answers[KEY].name;
      },
      prefix: PROMPT_PREFIX,
    },
  ]);

  Object.assign(args, answer);
};
