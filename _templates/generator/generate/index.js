/* eslint-disable no-await-in-loop */
const inquirer = require('inquirer');

const dbMigrationScript = require('./database-migration-script.prompt');
const dbSeedScript = require('./database-seed-script.prompt');
const dbModelPrompt = require('./database-model.prompt');
const useCasePrompt = require('./use-case.prompt');
const graphqlResolverPrompt = require('./graphql-resolver.prompt');
const restRouteHandlerPrompt = require('./rest-route-handler.prompt');
const servicePrompt = require('./service.prompt');
const factoryPrompt = require('./factory.prompt');

const ScaffoldType = {
  DB_MIGRATION_SCRIPT: 'Database Migration Script',
  DB_SEED_SCRIPT: 'Database Seed Script',
  DB_MODEL: 'Database Model',
  USE_CASE: 'Use Case',
  GQL_RESOLVER: 'GraphQL Resolver',
  REST_ROUTE_HANDLER: 'REST Request Handler',
  SERVICE: 'Service',
  FACTORY: 'Factory',
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
        case ScaffoldType.DB_MIGRATION_SCRIPT: {
          await dbMigrationScript(args);
          break;
        }

        case ScaffoldType.DB_SEED_SCRIPT: {
          await dbSeedScript(args);
          break;
        }

        case ScaffoldType.DB_MODEL: {
          await dbModelPrompt(args);
          break;
        }

        case ScaffoldType.USE_CASE: {
          await useCasePrompt(args);
          break;
        }

        case ScaffoldType.GQL_RESOLVER: {
          await graphqlResolverPrompt(args);
          break;
        }

        case ScaffoldType.REST_ROUTE_HANDLER: {
          await restRouteHandlerPrompt(args);
          break;
        }

        case ScaffoldType.SERVICE: {
          await servicePrompt(args);
          break;
        }

        case ScaffoldType.FACTORY: {
          await factoryPrompt(args);
          break;
        }

        default:
      }
    }

    return args;
  },
};
