# TypeScript Node Express + Apollo GraphQL Starter

A boilerplate for Node Express and Apollo GraphQL with TypeScript APIs.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [List of Packages](#list-of-packages)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Local JWT Authentication** using Email/Username and Password
- Configurable Environments
- Functionality-based project structure
- Node Express REST endpoints
- Apollo GraphQL as middleware for Node Express
- Automatic type code generation for GraphQL resolvers with GraphQL Code Generator
- GraphQL Shield as middleware for GraphQL resolvers
- Facebook Dataloader for caching and batching
- PostgreSQL Database
- Adminer for managing DB Database
- Pre-commit hook for auto formatting files with Husky and Prettier
- Logging
- Input schema validation on GraphQL resolvers via GraphQL Shield and Yup
- File Upload (single and multiple) examples
- Subscription examples

## Prerequisites

- [Docker](https://www.docker.com/)
- [NodeJS](https://nodejs.org/)
- TypeScript
- TSLint
- (Optional) Insomnia REST Client for testing file uploads
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

If docker compose have successfully bootstrapped all services successfully, you should be able to access its corresponding services:

**GraphQL Endpoint**

[http://localhost:8080/graphql](http://localhost:8080/graphql)

**Adminer endpoint**

[http://localhost:8888/](http://localhost:8888/)

Credentials:

| Field    | Value      | Notes                                                                                        |
| -------- | ---------- | -------------------------------------------------------------------------------------------- |
| System   | PostgreSQL | `docker-compose.yml` config is using Postgres as the SQL Database so we pick PostgreSQL here |
| Server   | db         | Service name in `docker-compose.yml` file for our Database service is named `db`             |
| Username | postgres   | Default username is `postgres`                                                               |
| Password | password   | As defined in the `docker-compose.yml` config                                                |
| Database | db         | As defined in the `docker-compose.yml` config                                                |

**Node Express REST Health Check endpoint**

[http://localhost:8080/api/v1/maintenance/health-check](http://localhost:8080/api/v1/maintenance/health-check)

**Node Express Status Monitor endpoint**

[http://localhost:8080/status](http://localhost:8080/status)

**Note:** If you prefer a different port, container name, or anything docker environment related. Just modify the `docker-compose.yml` file and adjust to your setup needs.

## Project Structure

| Name                                                                                            | Description                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **logs**/access.log                                                                             | HTTP access logs by the `morgan` request middleware.                                                                                                                                                                               |
| **logs**/combined.log                                                                           | All logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                                      |
| **logs**/errors.log                                                                             | Error logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                                    |
| **logs**/exceptions.log                                                                         | Unhandled exceptions logs logged by the `logger` function in `logger.util.ts`.                                                                                                                                                     |
| **src/config**/\*                                                                               | Any app level environment configs should go here.                                                                                                                                                                                  |
| **src/controllers**/`<feature-name>`/`<feature-name>`.ctrl.ts                                   | Controller files.                                                                                                                                                                                                                  |
| **src/core/\*\***/\*.ts                                                                         | Business Logic Layer files.                                                                                                                                                                                                        |
| **src/core**/enums/`<enum-name>`.enum.ts                                                        | Enum files.                                                                                                                                                                                                                        |
| **src/core**/interfaces/\*.ts                                                                   | Interfaces that are shared by many and cannot be owned by one module goes here.                                                                                                                                                    |
| **src/core**/services/`<service-name>`/`<service-name>`.service.ts                              | Business Logic services.                                                                                                                                                                                                           |
| **src/db**/helpers/\*.ts                                                                        | Migration script helpers.                                                                                                                                                                                                          |
| **src/db**/helpers/addTimeStamps.ts                                                             | Migration script for adding `createdAt` and `updatedAt` fields to a table.                                                                                                                                                         |
| **src/db**/migrations/\*.ts                                                                     | Generated migration files by KnexJS goes here as per `knexfile.ts` config.                                                                                                                                                         |
| **src/db**/models/common/BaseModel.ts                                                           | ObjectionJS Base Class model for other models to inherit.                                                                                                                                                                          |
| **src/db**/models/`<entity-name>`.model.ts                                                      | Database Entity Models.                                                                                                                                                                                                            |
| **src/db**/seeds/\*.ts                                                                          | Generated seed files by KnexJS goes here as per `knexfile.ts` config.                                                                                                                                                              |
| **src/graphql**/enums/`<enum-name>`.enum.ts                                                     | GraphQL internal Enum resolvers/values.                                                                                                                                                                                            |
| **src/graphql**/resolvers/`<feature-name>`/`<resolver-name>`.`query\|mutation\|subscription`.ts | 1 file per field/query/mutation/subscription resolver. Name your file accordingly for quick searching. Don't forget the **barrel files (index.ts)** as this is what the schema script checks to find the resolver implementations. |
| **src/graphql**/resolvers/\_dummy/\_dummy.`query\|mutation\|subscription`.ts                    | Resolver examples. 1 for each resolver type (`query`, `mutation` and `subscription`).                                                                                                                                              |
| **src/graphql**/scalars/`<scalar-name>`.scalar.ts                                               | GraphQL Enum resolvers and internal values.                                                                                                                                                                                        |
|                                                                                                 |
| **src/graphql**/typeDefs/`<feature-name>`.graphql                                               | Graphql schema files.                                                                                                                                                                                                              |
| **src/graphql**/index.ts                                                                        | Apollo GraphQL setup.                                                                                                                                                                                                              |
| **src/graphql**/schema.ts                                                                       | GraphQL Schema/Resolver builder script                                                                                                                                                                                             |
| **src/graphql-dataloaders**/`<dataloader-name>`.dataloader.ts                                   | Facebook Dataloader files                                                                                                                                                                                                          |
| **src/graphql-pubsub**/`<pubsub-name>`.pubsub.ts                                                | PubSub action creators                                                                                                                                                                                                             |
| **src/graphql-shield**/rules/\*.ts                                                              | Custom GraphQL Shield rules                                                                                                                                                                                                        |
| **src/graphql-shield**/yup-validation-schemas/`<yup-schema-name>`.schema.ts                     | Yup schema files for input validation from client                                                                                                                                                                                  |
| **src/graphql-shield**/index.ts                                                                 | GraphQL Shield middleware rules implementation.                                                                                                                                                                                    |
| **src/middleware**/`<middleware-name>`.middleware.ts                                            | Node Express Middleware files.                                                                                                                                                                                                     |
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
| .npmrc                                                                                          | `npm` config. Currently automatically saves all npm dependencies installed as `--save` if not specified.                                                                                                                           |
| .prettierrc                                                                                     | Prettier formatter configuration file.                                                                                                                                                                                             |
| apollo.config.js                                                                                | Apollo Server configuration file.                                                                                                                                                                                                  |
| codegen.yml                                                                                     | GraphQL Code Generator (file watcher) configuration file.                                                                                                                                                                          |
| docker-compose.yml                                                                              | Docker compose configuration file.                                                                                                                                                                                                 |
| Dockerfile                                                                                      | Docker configuration file.                                                                                                                                                                                                         |
| graphql.schema.json                                                                             | Introspection file generated by GraphQL Code Generator based on GraphQL Schema files defined at `src/graphql/typeDefs`.                                                                                                            |
| insomnia-file-upload-queries.json                                                               | Insomnia sample queries for file uploads. Import this to your Insomnia client.                                                                                                                                                     |
| knexfile.ts                                                                                     | KnexJS configuration file that contains database config.                                                                                                                                                                           |
| nodemon.json                                                                                    | Nodemon (file watcher) configuration file.                                                                                                                                                                                         |
| package.json                                                                                    | NPM dependencies.                                                                                                                                                                                                                  |
| package-lock.json                                                                               | Contains exact versions of NPM dependencies in package.json.                                                                                                                                                                       |
| tsconfig.json                                                                                   | Contains typescript configuration for this project.                                                                                                                                                                                |
| tslint.json                                                                                     | Rules for TSLint linter. Configured to use airbnb style guide and is integrated with prettier formatter.                                                                                                                           |

**Note:** This project structure makes use of **barrel files**, those **index.ts** you see on most of the folders. These barrel files are then used by the `paths` property in `tsconfig.json` for pretty imports. Make sure not to forget this by always exporting the newly created files to their respective **barrel files (index.ts)** if applicable!

## List of Packages

**Dependencies**

| Package                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| apollo-server-express  | Apollo GraphQL for Express.                                           |
| base64url              | Convert strings to base64 url-safe strings.                           |
| bcryptjs               | Library for hashing and salting user passwords.                       |
| compression            | NodeJS compression middleware.                                        |
| cors                   | NodeJS cors middleware.                                               |
| compression            | NodeJS compression middleware.                                        |
| dataloader             | Facebook Dataloader for batching and caching GraphQL requests.        |
| dotenv                 | Loads environment variables from `.env` file.                         |
| express                | NodeJS web framework.                                                 |
| express-status-monitor | Reports real-time server metrics for express.                         |
| graphql                | GraphQL core library.                                                 |
| graphql-depth-limit    | GraphQL depth limit middleware.                                       |
| graphql-iso-date       | GraphQL ISO Date scalars.                                             |
| graphql-middleware     | GraphQL Middlewares made easy.                                        |
| graphql-shield         | GraphQL Server permissions as another layer of abstraction.           |
| helmet                 | NodeJS helmet middleware.                                             |
| jsonwebtoken           | JWT library.                                                          |
| knex                   | SQL Query Builder.                                                    |
| lodash                 | A utility library for working with arrays, numbers, objects, strings. |
| merge-graphql-schemas  | GraphQL Schema utilities.                                             |
| morgan                 | NodeJS HTTP request logger middleware.                                |
| objection              | ObjectionJS SQL ORM.                                                  |
| pg                     | Node Postgres client.                                                 |
| ts-node                | TypeScript Node environment.                                          |
| typescript             | TypeScript compiler.                                                  |
| winston                | Logging library.                                                      |
| yup                    | Schema validator.                                                     |

**Dev Dependencies**

| Package                               | Description                                              |
| ------------------------------------- | -------------------------------------------------------- |
| @graphql-codegen/cli                  | GraphQL Code Generator CLI.                              |
| @graphql-codegen/introspection        | GraphQL Code Generator introspection plugin.             |
| @graphql-codegen/typescript           | GraphQL Code Generator typescript plugin.                |
| @graphql-codegen/typescript-resolvers | GraphQL Code typescript-resolvers plugin.                |
| concurrently                          | For running multiple commands concurrently.              |
| husky                                 | Git hooks.                                               |
| lint-staged                           | Run linters against staged git files.                    |
| nodemon                               | File watcher.                                            |
| npm-run-all                           | For running multiple commands at once.                   |
| prettier                              | File formatter.                                          |
| rimraf                                | For deleting folders and/or files.                       |
| tsconfig-paths                        | TypeScript path resolver.                                |
| tslint                                | TypeScript linter.                                       |
| tslint-config-airbnb                  | Airbnb TypeScript style guide configuration for TSLint.  |
| tslint-config-prettier                | Integration for prettier to use rules defined in TSLint. |

## Future Plans

- Testing
- CircleCI

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
