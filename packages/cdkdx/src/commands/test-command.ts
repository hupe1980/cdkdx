import { Command } from 'clipanion';
import jest from 'jest';

import { BaseCommand } from './base-command';

export class TestCommand extends BaseCommand {
  @Command.Proxy()
  public jestArgv!: string[];
  
  @Command.Path(`test`)
  async execute() {
    process.env.NODE_ENV = 'test';

    const jestConfig = this.createJestConfig();

    const argv: string[] = [];

    argv.push(
      '--config',
      JSON.stringify({
        ...jestConfig
      })
    );

    argv.push(...this.jestArgv);

    await jest.run(argv);
  }

  private createJestConfig() {
    const config = {
      transform: {
        '.(ts|tsx)': require.resolve('ts-jest/dist')
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      collectCoverageFrom: ['src/**/*.{ts,tsx}'],
      testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
      rootDir: this.context.cwd,
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname')
      ]
    };

    return config;
  }
}
