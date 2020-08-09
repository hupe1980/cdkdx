import * as path from 'path';
import { Command } from 'clipanion';
import * as jest from 'jest';

import { BaseProjectCommand } from '../base-command';

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

    const argv: string[] = [];

    const jestConfigFile = require.resolve(
      path.join(__dirname, '..', 'jest-config'),
    );

    // https://github.com/facebook/jest/issues/7415
    //argv.push('--config', JSON.stringify(jestConfig));
    argv.push('--config', jestConfigFile);

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }
}
