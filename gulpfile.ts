/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { watch, parallel, series, src, dest } from 'gulp';
// Read Gulp@4 support: https://www.npmjs.com/package/gulp-run-command#faq
import run from 'gulp-run-command';
import { ChildProcess, spawn } from 'child_process';

const PATHS = {
  srcTsFiles: [
    'src/**/*.ts',
    // Ignore auto generated files by other tooling
    '!src/generated/**/*',
  ],
  srcGraphqlFiles: ['src/**/*.graphql'],
  srcNonTsFiles: ['src/**/*', '!src/**/*.ts'],
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

// https://gist.github.com/webdesserts/5632955
let nodeProcess: ChildProcess | null;
async function runApp() {
  nodeProcess?.kill();
  nodeProcess = spawn('node', ['--inspect=0.0.0.0:9229', './src/app.js'], {
    cwd: './build',
    stdio: 'inherit',
  });
  nodeProcess.on('close', function (code) {
    if (code !== null) {
      console.info(`[gulp] Node process closed with exit code ${code}`);
    }
  });
}

// Cleanup
process.on('exit', () => {
  nodeProcess?.kill();
});

// PUBLIC COMMANDS //

export async function dev(): Promise<void> {
  await cleanBuildDir();

  watch(PATHS.configFiles, { ignoreInitial: false }, copyConfigFiles);
  watch(PATHS.srcNonTsFiles, { ignoreInitial: false }, copyNonTypeScriptFiles);
  watch(PATHS.srcGraphqlFiles, { ignoreInitial: false }, generateGqlTsFiles);
  watch(PATHS.srcTsFiles, { ignoreInitial: false }, parallel(lint, series(compileTsFiles, compileTsPaths, runApp)));
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
