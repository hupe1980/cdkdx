import * as path from 'path';
import { Command } from 'clipanion';
import * as jest from 'jest';

//import { TsConfig } from '../ts-config';
import { ProjectCommand } from './project-command';

export class TestCommand extends ProjectCommand {
  static usage = Command.Usage({
    description: 'Run jest test runner',
    details: `
            All flags are passed through directly to jest.
        `,
    examples: [
      ['Run jest', 'cdkdx test'],
      ['Run jest in watch mode', 'cdkdx test -w'],
    ],
  });

  @Command.Proxy()
  public jestArgv!: string[];

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';

    //const tsConfig = TsConfig.fromLambdaTemplate();

    // const jestConfig = {
    //   projects: [
    //     {
    //       displayName: 'cdk',
    //       rootDir: this.projectInfo.projectPath,
    //       transform: {
    //         '^.+\\.ts$': require.resolve('ts-jest/dist'),
    //         '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
    //       },
    //       moduleFileExtensions: ['ts', 'js', 'json', 'html'],
    //       collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
    //       testMatch: ['<rootDir>/**/*.(spec|test).ts'],
    //       watchPlugins: [
    //         require.resolve('jest-watch-typeahead/filename'),
    //         require.resolve('jest-watch-typeahead/testname'),
    //       ],
    //       testEnvironment: 'node',
    //       globals: {
    //         'ts-jest': {
    //           tsConfig: tsConfig.getCompilerOptions(),
    //         },
    //       },
    //     },
    //     // {
    //     //   displayName: 'lambdas',
    //     //   transform: {
    //     //     '^.+\\.ts$': require.resolve('ts-jest/dist'),
    //     //     '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
    //     //   },
    //     //   moduleFileExtensions: ['ts', 'js', 'json', 'html'],
    //     //   collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
    //     //   testMatch: ['<rootDir>/**/*.(spec|test).ts'],
    //     //   watchPlugins: [
    //     //     require.resolve('jest-watch-typeahead/filename'),
    //     //     require.resolve('jest-watch-typeahead/testname'),
    //     //   ],
    //     //   testEnvironment: 'node',
    //     //   globals: {
    //     //     'ts-jest': {
    //     //       tsConfig: tsConfig.getCompilerOptions(),
    //     //     },
    //     //   },
    //     // },
    //   ],
    // };

    const argv: string[] = [];

    const jestConfigFile = require.resolve(
      path.join(__dirname, '..', 'configs', 'jest-config'),
    );

    //console.log(jestConfigFile);
    //argv.push('--config', JSON.stringify(jestConfig));
    argv.push('--config', jestConfigFile);

    //argv.push('--projects');

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }
}
