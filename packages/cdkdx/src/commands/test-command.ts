import { Command } from 'clipanion';
import * as jest from 'jest';

import { TsConfig } from '../ts-config';
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

    const tsConfig = new TsConfig();

    const jestConfig = {
      transform: {
        '^.+\\.ts$': require.resolve('ts-jest/dist'),
        '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'html'],
      collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
      testMatch: ['<rootDir>/**/*.(spec|test).ts'],
      rootDir: this.projectInfo.projectPath,
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsConfig: tsConfig.getCompilerOptions(),
        },
      },
    };

    const argv: string[] = [];

    argv.push('--config', JSON.stringify(jestConfig));

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }
}
