import { CLIEngine } from 'eslint';

import { Runner } from '../runner';
import { PackageInfo } from '../package-info';

export class Linter implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {
  }

  public async run() {
    const eslintConfig = this.createEslintConfig();

    const cli = new CLIEngine({
      baseConfig: {
        ...eslintConfig,
        ...this.packageInfo.eslint
      }
    });

    const report = cli.executeOnFiles(['*/**/*.ts']);

    console.log(cli.getFormatter()(report.results));

    if (report.errorCount) {
      process.exit(1);
    }
  }

  private createEslintConfig(): CLIEngine.Options['baseConfig'] {
    const config = {
      extends: [
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        camelcase: 'off',
        '@typescript-eslint/camelcase': ['error', { properties: 'never' }]
      }
    };

    return config;
  }
}
