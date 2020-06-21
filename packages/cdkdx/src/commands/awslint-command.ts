import { Command } from 'clipanion';
import execa from 'execa';

import { ConstructCommand } from './construct-command';

export class AwslintCommand extends ConstructCommand {
  @Command.Proxy()
  public awslintArgv: string[];

  @Command.Path('awslint')
  async execute(): Promise<number> {
    const command = require.resolve('awslint/bin/awslint');

    let awslintErrorCode = 0;

    try {
      await execa(command, this.awslintArgv, {
        stdio: ['ignore', 'inherit', 'inherit'],
      });
    } catch (error) {
      awslintErrorCode = error.exitCode;
    }

    return awslintErrorCode;
  }
}
