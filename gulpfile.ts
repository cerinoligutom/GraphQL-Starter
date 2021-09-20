/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { watch, parallel, series, src, dest } from 'gulp';
// Read Gulp@4 support: https://www.npmjs.com/package/gulp-run-command#faq
import run from 'gulp-run-command';
import os from 'os';

const PATHS = {
  srcTsFiles: [
    'src/**/*.ts',
    // Ignore auto generated files by other tooling
    '!src/generated/**/*',
  ],
  srcGraphqlFiles: ['src/**/*.graphql'],
  srcNonTsFiles: ['src/**', '!src/**/*.ts'],
  configFiles: ['package*.json', '.env*', 'LICENSE'],
  destinationDir: 'build',
};

const isProduction = process.argv.includes('--prod');

async function compileTsFiles() {
  console.info('Compiling TypeScript...');
  let command = 'npx tsc';

  if (!isProduction) {
    command = `${command} --sourceMap --incremental`;
  }

  return run(command)();
}

async function compileTsPaths() {
  return run('npx tsc-alias')();
}

async function cleanBuildDir() {
  return run('npx rimraf build')();
}

async function lint() {
  return run('npm run lint')();
}

async function copyConfigFiles() {
  return src(PATHS.configFiles, { base: '.' }).pipe(dest(PATHS.destinationDir));
}

async function copyNonTypeScriptFiles() {
  return src(PATHS.srcNonTsFiles, { base: '.' }).pipe(dest(PATHS.destinationDir));
}

async function generateGqlTsFiles() {
  let command = 'npm run generate:gql-types';

  if (isProduction) {
    command = `${command} -- -e`;
  }

  return run(command)();
}

async function runApp() {
  let nodeDevFlags = '';
  if (os.platform() === 'win32') nodeDevFlags += ' --poll';

  // https://github.com/fgnass/node-dev#passing-arguments-to-node
  const command = `node-dev ${nodeDevFlags} -r ts-node/register -r tsconfig-paths/register --inspect=0.0.0.0:9229 ./src/app.ts`;

  run(command)();
  return;
}

// PUBLIC COMMANDS //

export async function dev(): Promise<void> {
  await generateGqlTsFiles();

  // NOTE: when using windows, add usePolling: true
  watch(PATHS.srcGraphqlFiles, { ignoreInitial: true }, generateGqlTsFiles);
  watch(PATHS.srcTsFiles, { ignoreInitial: false }, lint);

  runApp();
}
export default dev;

export async function build() {
  await cleanBuildDir();
  await copyConfigFiles();

  await lint();
  await generateGqlTsFiles();
  await compileTsFiles();
  await compileTsPaths();
  await copyNonTypeScriptFiles();
}
