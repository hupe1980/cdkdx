import glob from 'glob';
import { Command } from 'clipanion';
import findWorkspaceRoot from 'find-workspace-root';
import * as jest from 'jest';

import { ProjectCommand } from './project-command';

export class TestCommand extends ProjectCommand {
  @Command.String('--globPattern')
  public globPattern: string;

  @Command.Boolean('--watch')
  @Command.Boolean('-w')
  public watch = false;

  @Command.Boolean('--updateSnapshot')
  @Command.Boolean('-u')
  public updateSnapshot = false;

  @Command.Boolean('--coverage')
  @Command.Boolean('--collectCoverage')
  public coverage = false;

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';

    const jestConfig = await this.createJestConfig();

    const argv: string[] = [];

    argv.push(
      '--config',
      JSON.stringify({
        ...jestConfig,
      })
    );

    if (this.watch) {
      argv.push('--watch');
    }
    
    if (this.updateSnapshot) {
      argv.push('--updateSnapshot');
    }

    if (this.coverage) {
      argv.push('--coverage')
    }

    await jest.run(argv);

    return 0;
  }

  private async createJestConfig() {
    const roots = await (async () => {
      const workspaceRoot = await findWorkspaceRoot();

      if(workspaceRoot) {
        const pattern = this.globPattern ?? 'packages/*';

        return new Promise((resolve, reject) => {
          glob(`${workspaceRoot}/${pattern}`, (err, matches) => {
            if(err) {
              reject(err);
            }
            resolve(matches);
          })
        });
      }

      return [this.context.cwd]
    })();

    const config = {
      transform: {
        '.ts': require.resolve('ts-jest/dist'),
      },
      moduleFileExtensions: ['ts', 'js'],
      collectCoverageFrom: ['src/**/*.ts'],
      //testMatch: ['<rootDir>/**/*.(spec|test).ts'],
      roots,
      testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
      //rootDir: this.context.cwd,
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
      testEnvironment: 'node',
    };

    return config;
  }
}
