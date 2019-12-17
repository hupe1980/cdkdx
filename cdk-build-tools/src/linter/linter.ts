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
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
      ],
      rules: {
        'import/no-unresolved': 'off',
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        'prettier/prettier': 'error',
        camelcase: 'off',
        '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
        'no-new': 'off',
        'no-new-func': 'off',
        'import/prefer-default-export': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_'
          }
        ],
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    };

    return config;
  }
}
