import { Command } from 'clipanion';
import { config } from 'dotenv';
import execa from 'execa';

import { ProjectCommand } from './project-command';

export class NodeCommand extends ProjectCommand {
  @Command.String({ required: true })
  public script!: string;

  @Command.Path('node')
  async execute(): Promise<number> {
    config();

    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const command = require.resolve('ts-node/dist/bin');
    const args = [this.script];

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
      },
    });
   
    return 0;
  }
}
