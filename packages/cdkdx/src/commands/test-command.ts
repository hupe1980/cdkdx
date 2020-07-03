import { Command } from 'clipanion';
import * as jest from 'jest';

import { TsConfig } from '../ts-config';
import { ProjectCommand } from './project-command';

export class TestCommand extends ProjectCommand {
  @Command.Proxy()
  public jestArgv!: string[];

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';

    const tsConfig = new TsConfig();

    const jestConfig = {
      transform: {
        '^.+\\.ts$': require.resolve('ts-jest/dist'),
      },
      moduleFileExtensions: ['ts', 'js'],
      collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
      testMatch: ['<rootDir>/**/*.(spec|test).ts'],
      rootDir: this.context.cwd,
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

    argv.push(
      '--config',
      JSON.stringify(jestConfig),
    );

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }
}
