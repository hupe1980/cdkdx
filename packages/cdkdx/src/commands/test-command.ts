import { Command } from 'clipanion';
import * as jest from 'jest';

import { ConstructCommand } from './construct-command';

export class TestCommand extends ConstructCommand {
  @Command.Proxy()
  public jestArgv!: string[];

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';

    const jestConfig = this.createJestConfig();

    const argv: string[] = [];

    argv.push(
      '--config',
      JSON.stringify({
        ...jestConfig,
      })
    );

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }

  private createJestConfig() {
    const config = {
      transform: {
        '.(ts|tsx)': require.resolve('ts-jest/dist'),
      },
      moduleFileExtensions: ['ts', 'js'],
      collectCoverageFrom: ['src/**/*.{ts,tsx}'],
      testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
      rootDir: this.context.cwd,
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
    };

    return config;
  }
}
