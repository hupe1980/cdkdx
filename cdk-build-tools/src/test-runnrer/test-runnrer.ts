import jest from 'jest';
import glob from 'glob';

import { Runner } from '../runner';
import { PackageInfo } from '../package-info';

export class TestRunner implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {
  }

  public async run() {
    process.env.NODE_ENV = 'test';

    const jestConfig = await this.createJestConfig(this.packageInfo);

    const args: string[] = [];

    args.push(
      '--config',
      JSON.stringify({
        ...jestConfig
      })
    );

    await jest.run(args);
  }

  private async globWorkspaces() {
    return new Promise((resolve, reject) => {
      glob('./packages/*', (err, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(
          files.map(p => p.replace(/^\./, '<rootDir>')).map(p => `${p}`)
        );
      });
    });
  }

  private async createJestConfig(packageInfo: PackageInfo) {
    const config = {
      roots: packageInfo.isRoot() ? await this.globWorkspaces() : undefined,
      transform: {
        '.(ts|tsx)': require.resolve('ts-jest/dist')
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      collectCoverageFrom: ['src/**/*.{ts,tsx}'],
      testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx}'],
      rootDir: packageInfo.cwd,
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname')
      ]
    };

    return config;
  }
}
