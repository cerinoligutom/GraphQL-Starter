# TypeScript Node Express + Apollo GraphQL Starter

A boilerplate for TypeScript + Node Express + Apollo GraphQL APIs.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [List of Packages](#list-of-packages)
- [Sample Environment File](#sample-environment-file)
- [Suggested Workflow](#suggested-workflow)
- [Naming Convention](#naming-convention)
- [Deployment](#deployment)
- [CircleCI Config](#circleci-config)
- [Future Plans](#future-plans)
- [Pro Tips](#pro-tips)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Session Cookie Based Authentication** using Email/Username and Password
- Authorization with CASL (user-role-permission)
- Configurable Environments
- Functionality-based project structure
- Node Express REST endpoints
- Apollo GraphQL as middleware for Node Express
- Automatic type code generation for GraphQL resolvers with GraphQL Code Generator
- GraphQL Shield as middleware for GraphQL resolvers
- Facebook Dataloader for caching and batching
- PostgreSQL Database
- Adminer for managing DB Database
- Redis for Caching
- RedisCommander for managing the Redis Database
- Pre-commit hook for auto formatting files with Husky, Lint-Staged and Prettier
- Logging
- Input schema validation on GraphQL resolvers via GraphQL Shield and Yup
- Subscription examples

## Prerequisites

- [Docker](https://www.docker.com/)
- [NodeJS](https://nodejs.org/)
- TypeScript
- TSLint
- (Optional) Extensions/Plugins:
  - Apollo GraphQL
  - Docker
  - TSLint

## Getting Started

```bash
# Install dependencies for the host
npm install

# Build the project for the first time or when you add dependencies
docker-compose build

# Start the application (or to restart after making changes to the source code)
docker-compose up
```

**Note:** You might be prompted to share your drive with Docker if you haven't done so previously. The drive letter you need to share in this case would be the drive letter of where this repository resides.

---

If docker compose have bootstrapped all services successfully, you should be able to access:

### GraphQL Endpoint

[http://localhost:8080/graphql](http://localhost:8080/graphql)

### Adminer endpoint

[http://localhost:8888/](http://localhost:8888/)

Credentials:

| Field    | Value      | Notes                                                                                        |
| -------- | ---------- | -------------------------------------------------------------------------------------------- |
| System   | PostgreSQL | `docker-compose.yml` config is using Postgres as the SQL Database so we pick PostgreSQL here |
| Server   | db         | Service name in `docker-compose.yml` file for our Database service is named `db`             |
| Username | postgres   | Default username is `postgres`                                                               |
| Password | password   | As defined in the `docker-compose.yml` config                                                |
| Database | db         | As defined in the `docker-compose.yml` config                                                |

### Redis Commander endpoint

[http://localhost:8889](http://localhost:8889/)

### Node Express REST Health Check endpoint

[http://localhost:8080/api/v1/maintenance/health-check](http://localhost:8080/api/v1/maintenance/health-check)

### Node Express Status Monitor endpoint

[http://localhost:8080/status](http://localhost:8080/status)

**Note:** If you prefer a different port, container name, or anything docker environment related. Just modify the `docker-compose.yml` file and adjust to your setup needs.

## Project Structure

| Name                                                                                            | Description                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **infrastructure**/Dockerrun.aws.json                                                           | Sample config for deploying a Docker app to AWS Elastic Beanstalk from a remote Docker repository (AWS ECR for this config). Make sure to replace the placeholders with your setup.                                                |
| **logs**/access.log                                                                             | HTTP access logs by the `morgan` request middleware.                                                                                                                                                                               |
| **logs**/combined.log                                                                           | All logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                                      |
| **logs**/errors.log                                                                             | Error logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                                    |
| **logs**/exceptions.log                                                                         | Unhandled exceptions logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                     |
| **src/config**/\*                                                                               | Any app level environment configs should go here.                                                                                                                                                                                  |
| **src/controllers**/`<feature-name>`/`<feature-name>`.ctrl.ts                                   | Controller files.                                                                                                                                                                                                                  |
| **src/core/\*\***/\*.ts                                                                         | Business Logic Layer files.                                                                                                                                                                                                        |
| **src/core**/authorization/`<ability-name>`.ability.ts                                          | CASL Ability (Authorization) files.                                                                                                                                                                                                |
| **src/core**/enums/`<enum-name>`.enum.ts                                                        | Enum files.                                                                                                                                                                                                                        |
| **src/core**/error-handler/error-handler.ts                                                     | Centralized error handlng logic                                                                                                                                                                                                    |
| **src/core**/error-handler/errors/`<name>Error`.ts                                              | Custom errors                                                                                                                                                                                                                      |
| **src/core**/interfaces/\*.ts                                                                   | Interfaces that are shared by many and cannot be owned by one module goes here.                                                                                                                                                    |
| **src/core**/services/`<service-name>`/`<service-name>`.service.ts                              | Business Logic services.                                                                                                                                                                                                           |
| **src/core**/types/\*.ts                                                                        | Custom types.                                                                                                                                                                                                                      |
| **src/db**/helpers/\*.ts                                                                        | Migration script helpers.                                                                                                                                                                                                          |
| **src/db**/helpers/addTimeStamps.ts                                                             | Migration script for adding `createdAt` and `updatedAt` fields to a table.                                                                                                                                                         |
| **src/db**/migrations/\*.ts                                                                     | Generated migration files by KnexJS goes here as per `knexfile.ts` config.                                                                                                                                                         |
| **src/db**/models/common/BaseModel.ts                                                           | ObjectionJS Base Class model for other models to inherit.                                                                                                                                                                          |
| **src/db**/models/`<entity-name>`.model.ts                                                      | Database Entity Models.                                                                                                                                                                                                            |
| **src/db**/seeds/\*.ts                                                                          | Generated seed files by KnexJS goes here as per `knexfile.ts` config.                                                                                                                                                              |
| **src/graphql**/enums/`<enum-name>`.enum.ts                                                     | GraphQL internal Enum resolvers/values.                                                                                                                                                                                            |
| **src/graphql**/resolvers/`<feature-name>`/`<resolver-name>`.`query\|mutation\|subscription`.ts | 1 file per field/query/mutation/subscription resolver. Name your file accordingly for quick searching. Don't forget the **barrel files (index.ts)** as this is what the schema script checks to find the resolver implementations. |
| **src/graphql**/resolvers/\_dummy/\_dummy.`query\|mutation\|subscription`.ts                    | Resolver examples. 1 for each resolver type (`query`, `mutation` and `subscription`).                                                                                                                                              |
| **src/graphql**/resolvers/\_sample/index.ts                                                     | More setup-specific examples.                                                                                                                                                                                                      |
| **src/graphql**/scalars/`<scalar-name>`.scalar.ts                                               | GraphQL Enum resolvers and internal values.                                                                                                                                                                                        |
| **src/graphql**/typeDefs/`<feature-name>`.graphql                                               | Graphql schema files.                                                                                                                                                                                                              |
| **src/graphql**/index.ts                                                                        | Apollo GraphQL setup.                                                                                                                                                                                                              |
| **src/graphql**/schema.ts                                                                       | GraphQL Schema/Resolver builder script                                                                                                                                                                                             |
| **src/graphql-dataloaders**/`<dataloader-name>`.dataloader.ts                                   | Facebook Dataloader files                                                                                                                                                                                                          |
| **src/graphql-pubsub**/`<pubsub-name>`.pubsub.ts                                                | PubSub action creators                                                                                                                                                                                                             |
| **src/graphql-shield**/rules/\*.ts                                                              | Custom GraphQL Shield rules                                                                                                                                                                                                        |
| **src/graphql-shield**/yup-validation-schemas/`<yup-schema-name>`.schema.ts                     | Yup schema files for input validation from client                                                                                                                                                                                  |
| **src/graphql-shield**/index.ts                                                                 | GraphQL Shield middleware rules implementation.                                                                                                                                                                                    |
| **src/middleware**/`<middleware-name>`.middleware.ts                                            | Node Express Middleware files.                                                                                                                                                                                                     |
| **src/passport-strategies**/`<strategy-name>`.passport-strategy.ts                              | Contains all your PassportJS strategies and setup                                                                                                                                                                                  |
| **src/redis**/client.ts                                                                         | Redis client is initialized here                                                                                                                                                                                                   |
| **src/routes**/`<api-version>`/index.ts                                                         | Exports all routers for this api version to a single variable to be used by `src/routes/index.ts`.                                                                                                                                 |
| **src/routes**/`<api-version>`/`<router-name>`.routes.ts                                        | Node Express Router files.                                                                                                                                                                                                         |
| **src/routes**/index.ts                                                                         | Node Express Routes initialization.                                                                                                                                                                                                |
| **src/utils**/`<utility-name>`.util.ts                                                          | Utility files.                                                                                                                                                                                                                     |
| **src/utils**/asyncHandler.util.ts                                                              | Async wrapper for Node Express middlewares/controllers.                                                                                                                                                                            |
| **src/utils**/bcrypt.util.ts                                                                    | Utility for generating salt/hash and verifying passwords.                                                                                                                                                                          |
| **src/utils**/jwt.util.ts                                                                       | Utility for JWT verification and generation.                                                                                                                                                                                       |
| **src/utils**/logger.util.ts                                                                    | Logging utility. Make sure to use the `logger` function if you want logs go to the `logs/*.log`.                                                                                                                                   |
| **src/app.ts**                                                                                  | Main application file.                                                                                                                                                                                                             |
| **types**/graphql-resolvers.d.ts                                                                | Auto generated types and interfaces by GraphQL Code Generator based on GraphQL Schema files defined at `src/graphql/typeDefs`.                                                                                                     |
| .dockerignore                                                                                   | Folder and files ignored by docker usage.                                                                                                                                                                                          |
| .gitignore                                                                                      | Folder and files ignored by git.                                                                                                                                                                                                   |
| .huskyrc                                                                                        | Husky config.                                                                                                                                                                                                                      |
| .lintstagedrc                                                                                   | Lint-staged config git.                                                                                                                                                                                                            |
| .npmrc                                                                                          | `npm` config. Currently automatically saves all npm dependencies installed as `--save` if not specified.                                                                                                                           |
| .prettierrc                                                                                     | Prettier formatter configuration file.                                                                                                                                                                                             |
| apollo.config.js                                                                                | Apollo Server configuration file.                                                                                                                                                                                                  |
| codegen.yml                                                                                     | GraphQL Code Generator (file watcher) configuration file.                                                                                                                                                                          |
| docker-compose.yml                                                                              | Docker compose configuration file.                                                                                                                                                                                                 |
| Dockerfile                                                                                      | `Production` Docker configuration file.                                                                                                                                                                                            |
| Dockerfile.dev                                                                                  | `Development` Docker configuration file used by `docker-compose`.                                                                                                                                                                  |
| knexfile.ts                                                                                     | KnexJS configuration file that contains database config.                                                                                                                                                                           |
| nodemon.json                                                                                    | Nodemon (file watcher) configuration file.                                                                                                                                                                                         |
| package.json                                                                                    | NPM dependencies.                                                                                                                                                                                                                  |
| package-lock.json                                                                               | Contains exact versions of NPM dependencies in package.json.                                                                                                                                                                       |
| tsconfig.json                                                                                   | Contains typescript configuration for this project.                                                                                                                                                                                |
| tslint.json                                                                                     | Rules for TSLint linter. Configured to use airbnb style guide and is integrated with prettier formatter.                                                                                                                           |

**Note:** This project structure makes use of **barrel files**, those **index.ts** you see on most of the folders. These barrel files are then used by the `paths` property in `tsconfig.json` for pretty imports. Make sure not to forget this by always exporting the newly created files to their respective **barrel files (index.ts)** if applicable!

## List of Packages

### Dependencies

| Package                   | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| @casl/ability             | An isomorphic authorization JS library.                                        |
| @graphql-tools/load-files | GraphQL Schema helper for loading the files needed to build our schema.        |
| @graphql-tools/merge      | GraphQL Schema helper for merging the loaded files needed to build our schema. |
| apollo-server-express     | Apollo GraphQL for Express.                                                    |
| bcryptjs                  | Library for hashing and salting user passwords.                                |
| compression               | ExpressJS compression middleware.                                              |
| compression               | ExpressJS compression middleware.                                              |
| connect-redis             | Redis Store for express-session.                                               |
| cookie-parser             | Parse cookies into a nice object format.                                       |
| cors                      | ExpressJS cors middleware.                                                     |
| dataloader                | Facebook Dataloader for batching and caching GraphQL requests.                 |
| dotenv                    | Loads environment variables from `.env` file.                                  |
| express                   | Unopinionated NodeJS web framework.                                            |
| express-session           | ExpressJS session middleware.                                                  |
| express-status-monitor    | Reports real-time server metrics for express.                                  |
| graphql                   | GraphQL core library.                                                          |
| graphql-depth-limit       | GraphQL depth limit middleware.                                                |
| graphql-iso-date          | GraphQL ISO Date scalars.                                                      |
| graphql-middleware        | GraphQL Middlewares made easy.                                                 |
| graphql-shield            | GraphQL Server permissions as another layer of abstraction.                    |
| helmet                    | Security middleware.                                                           |
| ioredis                   | NodeJS Redis Client.                                                           |
| knex                      | SQL Query Builder.                                                             |
| lodash                    | A utility library for working with arrays, numbers, objects, strings.          |
| morgan                    | ExpressJS HTTP request logger middleware.                                      |
| objection                 | ObjectionJS SQL ORM.                                                           |
| objection-cursor          | ObjectionJS mixin for cursor-based pagination.                                 |
| passport                  | Simple, unobtrusive authentication for NodeJS.                                 |
| pg                        | Node Postgres client.                                                          |
| tsconfig-paths            | TypeScript path resolver.                                                      |
| winston                   | Logging library.                                                               |
| yup                       | Schema validator.                                                              |

### Dev Dependencies

| Package                               | Description                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| @graphql-codegen/cli                  | GraphQL Code Generator CLI.                                                                                       |
| @graphql-codegen/introspection        | GraphQL Code Generator introspection plugin.                                                                      |
| @graphql-codegen/typescript           | GraphQL Code Generator typescript plugin.                                                                         |
| @graphql-codegen/typescript-resolvers | GraphQL Code typescript-resolvers plugin.                                                                         |
| concurrently                          | For running multiple commands concurrently.                                                                       |
| copyfiles                             | For copying files. Currently used in the build toolchain. Particularly, to copy files needed for the final build. |
| husky                                 | Git hooks.                                                                                                        |
| lint-staged                           | Run linters against staged git files.                                                                             |
| nodemon                               | File watcher.                                                                                                     |
| prettier                              | File formatter.                                                                                                   |
| rimraf                                | For deleting folders and/or files.                                                                                |
| ts-node                               | TypeScript Node environment.                                                                                      |
| tslint                                | TypeScript linter.                                                                                                |
| tslint-config-airbnb                  | Airbnb TypeScript style guide configuration for TSLint.                                                           |
| tslint-config-prettier                | Integration for prettier to use rules defined in TSLint.                                                          |
| typescript                            | TypeScript compiler.                                                                                              |

## Sample Environment File

You can configure your environments thru `.env.{APP_ENV}` files. For example, to create one for your `development` environment, create a `.env.development` file in the root folder. Paste the snippet below and supply the appropriate variables for the environment. These environment variables are then consumed by the config file found under **src/config/environment.ts**. You can switch between environments by setting `CURRENT_ENVIRONMENT` variable in that file.

```dotenv
APP_PORT=

POSTGRES_CONNECTION_URL=
REDIS_CONNECTION_URL=

# Apollo Graph Manager
APOLLO_KEY=

# Express Session
SESSION_SECRET=
```

Currently there are 4 environments supported. Make sure the corresponding `.env` file for the environment exists so that it'll be loaded accordingly.

| `APP_ENV`   | `.env` file        |
| ----------- | ------------------ |
| PRODUCTION  | `.env.production`  |
| STAGING     | `.env.staging`     |
| TEST        | `.env.test`        |
| DEVELOPMENT | `.env.development` |

## Suggested Workflow

Keep in mind this layered architecture.

![image](https://i.imgur.com/lZzIFYS.png)

The folder structure of this project is mainly functionality-based so it should mostly be self explanatory where to put what.

### Create a migration script with KnexJS for your database table

1. Run `npm run migrate:make <script_name>`.
2. Go to the generated script at `src/db/migrations/<your_script>.ts`.
3. Populate the script accordingly. Use the `addTimestamps.ts` helper if you need timestamps for your table.

### (Optional) Create a seed script with KnexJS

1. Run `npm run seed:make <script_name>`.
2. Go to the generated script at `src/db/seeds/<your_script>.ts`.
3. Populate the script accordingly.

### Create the corresponding ObjectionJS model

1. Create a TS file at `src/db/models/`.
2. Populate the file accordingly.
   - Make sure to set the static `tableName` property.
   - (Optional) Set the static `relationMappings` property if applicable. See ObjectionJS docs for more details.
   - (Recommended) Create a static `yupSchema` property for a centralized schema validation for that model. See existing models for example. This will later be used on in graphql-shield for graphql input validations.
   - Setup the model's properties based on your database table schema.

### Create a service (Business Logic)

1. Create a new folder at `src/core/services/<service_name>`.
2. Create the service file under the new folder.
3. Populate it with the basic stuffs you'll need.
   - Such as the basic CRUD methods.

**Note:** Your Interface Layer shouldn't do any DB Operations directly.

### Create the GraphQL type definitions for your entity

1. Create a GraphQL file at `src/graphql/typeDefs/`.
2. Define your GraphQL typedef that you want to expose on your schema.
3. Think in graphs.
   - So that your GraphQL schema wouldn't look like a reflection of your database schema.

### Create your GraphQL resolvers based on the GraphQL TypeDefs

1. Create a new folder under `src/graphql/resolvers/<entity_name>`.
   - I'd like to group the resolvers by their `type`.
2. Create an `index.ts` file under that
   - **Note:** This is important as `schema.ts` uses the `index` barrels (TS files) to get the resolvers.
3. Create the `query/mutation/subscription` resolver file under the folder.
4. Implement. Refer to the resolvers under `user` for examples.

**Tip:** Keep your resolvers thin by making the business logic layer services do the actual work and call those functions in the resolvers.

If you have enums defined in your GraphQL Schema, most likely you have your own internal values which means you'll have to resolve these enums to match your internal values which, most of the time, are internal enums you use in the app. Simply define the enums under the `src/graphql/enums` directory and make sure to export it on the `index` barrel.

This is also true to scalars at `src/graphql/scalars`.

### Add resolver permission rules with GraphQL Shield

Populate accordingly at `src/graphql-shield/index.ts`.

If you want to validate your graphql inputs (e.g. input from a mutation), define your yup schema at `src/graphql-shield/yup-validation-schemas` then pass that as an argument of `yupRule` and use that on the corresponding resolver on the GraphQL Shield config.

## Naming Convention

### For files and folders

Generally, use `snake-case`.

In some cases, we include the file `functionality` in its file name in the format:

`file-name.<functionality>.<extension>`

For example:

- user`.service`.ts
- sort-direction`.enum`.ts
- User`.model`.ts
- async-handler`.util`.ts

TypeScript `interface` and `type` file names should match their definition name.

For example:

| Interface/Type name       | File name                    |
| ------------------------- | ---------------------------- |
| `ICursorPaginationResult` | `ICursorPaginationResult`.ts |
| `ICursorResult`           | `ICursorResult`.ts           |
| `IPageInfo`               | `IPageInfo`.ts               |
| `Await`                   | `Await`.ts                   |
| `ExcludeMaybe`            | `ExcludeMaybe`.ts            |

## Deployment

There are a few ways to go about this and can vary based on your setup.

### Docker Way

Simply build the image from your local machine (or let your CI tool do it) with the syntax below.

```bash
# The dot on the end is important.
docker build -f <docker_file> -t <image_name>[:<image_tag>] .

# Example:
docker build -f Dockerfile -t graphql-starter:latest .
```

Then push the image you just built from your local machine (or from your CI tool) to your docker image repository (e.g. Docker Hub, AWS ECR).

```bash
docker push <typically_a_url_to_your_docker_image_repository>
```

**Note:** Typically, the `tag` for the image you built should match the `url` to your docker image repository. Refer to your image repository provider for specific details.

**Extra:** If you want to test the image you just built with your local setup, then configure the docker-compose file such that it points to your image instead of building from a Dockerfile. For example:

From:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    command: npm start
    restart: always
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

To:

```yaml
services:
  api:
    # Set it to the image you just built
    image: graphql-starter:latest
    restart: always
```

### Build Locally

If you're not using Docker, you can still get your hands on the build files. Normally, you'd want this approach if you're deploying to a VPS and have to move the files via FTP manually to your server or you have a cloud provider that accepts node apps where you'll have to provide it your project files with a `package.json` file in the project folder (typically zipped).

Build the project:

```bash
npm run build
```

This will create a `build` folder in the project directory which you can deploy.

**Note:** You might need to manually install the dependencies yourself if you're using a VPS. Otherwise, your cloud provider's NodeJS container will typically just need a `package.json` from the root folder and they'll do the installation on every deploy.

### Deploy to AWS Elastic Beanstalk w/ AWS ECR and CircleCI

This is more advanced and can get pretty long so I'll assume you have prepared the AWS Resources and CircleCI account needed to make things work. Refer to the [CircleCI Config](#circleci-config) for which variables you need to set.

The workflow would be:

1. Make a PR to a configured branch as per config. Currently `master`, `staging` and `test`.

1. CircleCI would process the pipeline as per config (build, test, deploy).

1. CircleCI would then push the image artifact to AWS ECR then notify AWS Elastic Beanstalk to pull that image and update the environment.

## CircleCI Config

Currently uses 2 orbs:

- aws-ecr
- aws-cli

Make sure to set these environment variables on your CircleCI project (or context):

### Orbs

| Variable                | Required by      | Description                                    |
| ----------------------- | ---------------- | ---------------------------------------------- |
| AWS_ACCESS_KEY_ID       | aws-ecr, aws-cli | AWS Account Access Key ID                      |
| AWS_SECRET_ACCESS_KEY   | aws-ecr, aws-cli | AWS Secret Access Key                          |
| AWS_REGION              | aws-ecr          | AWS Resources Region                           |
| AWS_ECR_REPOSITORY_NAME | aws-ecr          | AWS Elastic Container Registry Repository Name |
| AWS_ECR_ACCOUNT_URL     | aws-ecr          | AWS Elastic Container Registry Account URL     |
| AWS_DEFAULT_REGION      | aws-cli          | AWS Resources Region                           |

### Production

| Variable                   | Description                        |
| -------------------------- | ---------------------------------- |
| AWS_EB_APP_NAME_PRODUCTION | Elastic Beanstalk Application Name |
| AWS_EB_ENV_ID_PRODUCTION   | Elastic Beanstalk Environment ID   |

### Staging

| Variable                | Description                        |
| ----------------------- | ---------------------------------- |
| AWS_EB_APP_NAME_STAGING | Elastic Beanstalk Application Name |
| AWS_EB_ENV_ID_STAGING   | Elastic Beanstalk Environment ID   |

### Test

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| AWS_EB_APP_NAME_TEST | Elastic Beanstalk Application Name |
| AWS_EB_ENV_ID_TEST   | Elastic Beanstalk Environment ID   |

**Tip:** You might want to enable the `Only build pull requests` and `Auto-cancel redundant builds` on your CircleCI project settings.

## Future Plans

- Testing
- Move from TSLint to ESLint

## Pro Tips

- When resolver types are generated by GraphQL Code Generator, the type of the 1st parameter of a **field resolver** is the parent type by default. This is not always true because at runtime, what the parent resolver returns is the actual type/object that will arrive in the field resolver 1st (parent) parameter. In cases like this, you'd need to type assert the parent. See `fullName.query.ts`.

  - Another example for this is let's say we have a `pets` table and a pet has an `ownerId` but in your GraphQL Schema, what you expose is `owner` and not `ownerId`. You won't have access to the `ownerId` in your resolver because GraphQL Code Generator generated what you defined in the schema. You'll have then to type assert in your resolver the type you know you returned.

- If you want to rename a field in your GraphQL Schema:

  - **DO NOT** rename first on the GraphQL schema file (`*.graphql`).
    - Because if you do, the files that references the to-be-renamed field will break and TypeScript will fail to compile.
    - GraphQL Code Generator only generates what's defined in the schema and overwrites the generated file so the old name that was previously being referenced is now missing.
  - What you **SHOULD DO** instead is:
    - Rename first the field in the generated graphql resolver type definition file found at `types/graphql-resolvers.d.ts` then apply the new name in the GraphQL schema file.
      - Saves your time and sanity.

- When trying to auto import a GraphQL resolver to its respective index barrel (`index.ts` file), you might notice you're not getting code completion when typing the resolver name in the `export default` object. This is normal because your IDE thinks you're typing the key/property name (remember key-value pair). Assuming the resolver variable name is the same as the key/property name, a workaround is to type a dummy name (any single letter) first as the key/property then start typing your resolver name on the value to get code completion then delete the dummy name.

- Use the `paths` property in `tsconfig.json` file to group related functionalities and for [pretty imports](https://stackoverflow.com/questions/43281741/how-to-use-paths-in-tsconfig-json).

- When trying to debug async functions in VSCode and the breakpoints on the inner lines won't hit, try adding `trace: true` to `launch.json` file.

- Generated custom scalars by GraphQL Code Generator are given a type of `any`. As with TypeScript, if you can help it, give it a type/interface then map it to GraphQL Code Generator. See `Upload.scalar.ts` (the exported _type_) and `codegen.yml` (_scalars_ section) files. You can [read more here](https://graphql-code-generator.com/docs/plugins/typescript#scalars-scalarsmap). But basically:

  1. You define the type/interface in the corresponding scalar file and export it.
  2. Then map it to GraphQL Code Generator by adding scalars config in `codegen.yml` such that it points to its corresponding scalar file.
     - Format is: `<Scalar_Name_in_GQL_Schema>: <path_to_custom_type>#<name_of_type>`

## Contributing

If something is unclear, confusing, or needs to be refactored, please let me know. Pull requests are always welcome but do consider the opinionated nature of this project. Please open an issue before submitting a pull request.

## License

MIT License

Copyright (c) 2019 Cerino O. Ligutom III

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
