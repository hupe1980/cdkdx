import { CLIEngine } from 'eslint';

export const createEslintConfig = (): CLIEngine.Options['baseConfig'] => {
    const config = {
      extends: [
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended'
      ]
    };

    return config;
}