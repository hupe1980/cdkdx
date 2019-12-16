import yargs from 'yargs';
import chalk from 'chalk';

import { PackageInfo } from './package-info';
import { Toolkit } from './toolkit';

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

  const toolkit = new Toolkit(packageInfo);

  const command = argv._[0];

  switch (command) {
    case 'build': {
      console.log(
        `Building ${chalk.bold.green(
          packageInfo.name
        )} version ${chalk.bold.green(packageInfo.version)}...`,
        '\n'
      );

      await toolkit.bundleLambdas();

      if (argv.onlyLambdas) {
        return;
      }

      await toolkit.compile();

      break;
    }

    case 'watch': {
      await toolkit.watch();
      break;
    }

    case 'test': {
      console.log(
        `Testing ${chalk.bold.green(
          packageInfo.name
        )} version ${chalk.bold.green(packageInfo.version)}...`,
        '\n'
      );

      //const mocks = await toolkit.mockLambdaDependencies();

      try {
        await toolkit.test();
      } catch (error) {
        console.error(error);
      } finally {
        //await toolkit.removeMocks(mocks);
      }

      break;
    }

    case 'lint': {
      console.log(
        `Linting ${chalk.bold.green(
          packageInfo.name
        )} version ${chalk.bold.green(packageInfo.version)}...`,
        '\n'
      );

      await toolkit.lint();
    }

    case 'package': {
      console.log(
        `Create package for ${chalk.bold.green(
          packageInfo.name
        )} version ${chalk.bold.green(packageInfo.version)}...`,
        '\n'
      );

      await toolkit.package();

      break;

    }

    default: {
      throw new Error(`Unknown command: ${command}`);
    }
  }
};

main().catch(e => {
  console.error(`${e.toString()}\n`);
  process.exit(1);
});
