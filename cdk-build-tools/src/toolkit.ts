import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import jest from 'jest';
import { CLIEngine } from 'eslint';

import { PackageInfo } from './package-info';
import { execProgram } from './exec-program';
import { packDirectory } from './pack-directory';
import { createJestConfig } from './create-jest-config';
import { createEslintConfig } from './create-eslint-config';

export class Toolkit {
  constructor(private readonly packageInfo: PackageInfo) {}

  public async compile(): Promise<void> {
    const spinner = ora('Start compiling...').start();

    let command = '';
    const args = [];

    if (this.packageInfo.isJsii()) {
      command = require.resolve('jsii/bin/jsii');
      args.push('--project-references');
    } else {
      command = require.resolve('typescript/bin/tsc');
    }

    await execProgram(command, args);

    spinner.succeed();
  }

  public async watch(): Promise<void> {
    let command = '';
    const args = ['-w'];

    if (this.packageInfo.isJsii()) {
      command = require.resolve('jsii/bin/jsii');
      args.push('--project-references');
    } else {
      command = require.resolve('typescript/bin/tsc');
    }

    await execProgram(command, args);
  }

  public async bundleLambdas(): Promise<void> {
    const lambdaDependencies = this.packageInfo.getLambdaDependencies();

    if (lambdaDependencies) {
      const spinner = ora('Bundle lambdas...').start();

      try {
        await Promise.all(
          Object.keys(lambdaDependencies).map(
            async (lambdaPkg): Promise<void> => {
              const lambdaSrc = path.join(
                this.packageInfo.cwd,
                'node_modules',
                ...lambdaPkg.split('/')
              );
              const lambdaDest = path.join(
                this.packageInfo.cwd,
                'lambda',
                lambdaDependencies[lambdaPkg]
              );

              await packDirectory(lambdaSrc, lambdaDest);
            }
          )
        );
        spinner.succeed();
      } catch (error) {
        spinner.fail();
        throw error;
      }
    }
  }

  public async mockLambdaDependencies(): Promise<string[]> {
    const lambdaDependencies = this.packageInfo.getLambdaDependencies();
    const mocks: string[] = [];

    if (lambdaDependencies) {
      const spinner = ora('Mock lambda dependencies...').start();

      await Promise.all(
        Object.keys(lambdaDependencies).map(
          async (lambdaPkg): Promise<void> => {
            const lambdaDest = path.join(
              this.packageInfo.cwd,
              'lambda',
              lambdaDependencies[lambdaPkg]
            );

            if (!(await fs.pathExists(lambdaDest))) {
              await fs.createFile(lambdaDest);
              mocks.push(lambdaDest);
            }
          }
        )
      );
      spinner.succeed();
    }
    return mocks;
  }

  public async removeMocks(mocks: string[]): Promise<void> {
    await Promise.all(
      mocks.map(mock => {
        fs.remove(mock);
      })
    );
  }

  public async test(): Promise<void> {
    const spinner = ora('Create test runner...').start();

    process.env.NODE_ENV = 'test';

    const jestConfig = createJestConfig(
      this.packageInfo
    );

    const args: string[] = [];

    args.push(
      '--config',
      JSON.stringify({
        ...jestConfig
      })
    );

    spinner.succeed();
    console.log('\n');
    await jest.run(args);
  }

  public async lint(): Promise<void> {
    const eslintConfig = createEslintConfig();

    const cli = new CLIEngine({
      baseConfig: {
        ...eslintConfig
      }
    });

    const report = cli.executeOnFiles(['*/**/*.ts']);

    console.log(cli.getFormatter()(report.results));

    if (report.errorCount) {
      process.exit(1);
    }
  }

  public async package(): Promise<void> {
    const spinner = ora('Create package...').start();

    if (this.packageInfo.isPrivate()) {
      spinner.warn('No packaging for private modules');
      return;
    }

    const outdir = 'dist';

    if (this.packageInfo.isJsii()) {
      const command = require.resolve('jsii-pacmak/bin/jsii-pacmak');
      const args = ['-o', outdir];

      await execProgram(command, args);
    } else {
      const command = 'npm';
      const args = ['pack'];

      const tarball = (await execProgram(command, args)).trim();

      const target = path.join(outdir, 'js');

      await fs.remove(target);
      await fs.mkdirp(target);
      await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    spinner.succeed();
  }
}
