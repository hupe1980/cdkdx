import { Command } from 'clipanion';
import execa from 'execa';

import { ConstructCommand } from './construct-command';

export class NodeCommand extends ConstructCommand {
  @Command.String({ required: true })
  public script!: string;

  @Command.Path('node')
  async execute(): Promise<number> {
    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const command = require.resolve('ts-node/dist/bin');
    const args = [this.script];

    await execa(command, args);
   
    return 0;
  }
}
