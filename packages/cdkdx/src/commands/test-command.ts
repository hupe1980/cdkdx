import { Command } from 'clipanion';
import * as jest from 'jest';
import tsjPreset from 'ts-jest/presets';

import { BaseProjectCommand } from '../base-command';
import { TsConfig } from '../ts-config';
export class TestCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Run jest test runner',
    details: `
            All flags are passed through directly to jest.
        `,
    examples: [
      ['Run jest', 'cdkdx test'],
      ['Run jest in watch mode', 'cdkdx test --watch'],
    ],
  });

  @Command.Proxy()
  public jestArgv!: string[];

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';
    process.env.LAMBDAS = this.projectInfo.lambdasSrcPath;

    const argv: string[] = [];

    const jestConfig = {
      collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
        require.resolve('jest-watch-select-projects'),
      ],
      projects: [
        {
          displayName: 'cdk',
          rootDir: this.context.cwd,
          transform: {
            ...tsjPreset.defaults.transform,
            '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
          },
          moduleFileExtensions: ['ts', 'js', 'json', 'html'],
          testMatch: ['<rootDir>/**/*.(spec|test).ts'],
          testPathIgnorePatterns: ['/src/lambdas/'],
          testEnvironment: 'node',
          globals: {
            'ts-jest': {
              tsconfig: TsConfig.fromJsiiTemplate().getCompilerOptions(),
            },
          },
        },
        {
          displayName: 'lambda',
          rootDir: this.context.cwd,
          transform: {
            ...tsjPreset.defaults.transform,
            '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
          },
          moduleFileExtensions: ['ts', 'js', 'json', 'html'],
          testMatch: ['<rootDir>/**/src/lambdas/**/*.(spec|test).ts'],
          testEnvironment: 'node',
          globals: {
            'ts-jest': {
              tsconfig: TsConfig.fromLambdaTemplate().getCompilerOptions(),
            },
          },
        },
      ],
    };

    argv.push('--config', JSON.stringify(jestConfig));

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }
}
