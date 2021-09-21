/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { watch, parallel, src, dest } from 'gulp';
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
const isWindowsPlatform = os.platform() === 'win32';

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

async function tscCheck() {
  const command = 'npx tsc --noEmit';

  return run(command)();
}

async function cleanBuildDir() {
  return run('npx rimraf build')();
}

async function lint() {
  const command = 'eslint --cache ./src';

  return run(command)();
}

async function copyConfigFiles() {
  return src(PATHS.configFiles, { base: '.' }).pipe(dest(PATHS.destinationDir));
}

async function copyNonTypeScriptFiles() {
  return src(PATHS.srcNonTsFiles, { base: '.' }).pipe(dest(PATHS.destinationDir));
}

async function generateGqlTsFiles() {
  let command = 'npx graphql-codegen';

  if (isProduction) {
    command = `${command} -e`;
  }

  return run(command)();
}

async function runApp() {
  let nodeDevFlags = '--respawn';
  if (isWindowsPlatform) nodeDevFlags += ' --poll';

  // https://github.com/fgnass/node-dev#passing-arguments-to-node
  const command = `node-dev ${nodeDevFlags} -r tsconfig-paths/register --inspect=0.0.0.0:9229 ./src/app.ts`;

  run(command)();
  return;
}

// PUBLIC COMMANDS //

export async function dev(): Promise<void> {
  await generateGqlTsFiles();

  watch(PATHS.srcGraphqlFiles, { ignoreInitial: true, usePolling: isWindowsPlatform }, generateGqlTsFiles);
  watch(PATHS.srcTsFiles, { ignoreInitial: false, usePolling: isWindowsPlatform }, parallel(lint, tscCheck));

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
