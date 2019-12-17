import yargs from 'yargs';
import chalk from 'chalk';

import { PackageInfo } from './package-info';
import { Toolkit } from './toolkit';
import { Bundler } from './bundler';

const NAME = 'cdk-build-tools';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

// eslint-disable-next-line no-console
console.log(`\n${chalk.blue(NAME)} v${version}`, '\n');

const main = async (): Promise<void> => {
  const { argv } = yargs
    .version(version)
    .scriptName(NAME)
    .help('help')
    .command('build', 'Build a package', (cargv: yargs.Argv) =>
      cargv.option('only-lambdas', {
        type: 'boolean',
        desc: 'Only build and bundle lambdas'
      })
    )
    .command('watch', ' Start compiler in watch mode')
    .command('test', ' Start test')
    .command('lint', ' Start linter')
    .command('package', 'Create package');

  const packageInfo = await PackageInfo.createInstance();

  const command = argv._[0];

  const toolkit = new Toolkit(packageInfo);
  const bundler = new Bundler(packageInfo);

  await bundler.run();

  await toolkit.excuteRunner(command);
};

main().catch(e => {
  console.error(`${e.toString()}\n`);
  process.exit(1);
});
