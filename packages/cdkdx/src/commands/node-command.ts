import * as path from 'path';
import { Command } from 'clipanion';
import { config } from 'dotenv';
import execa from 'execa';

import { TsConfig } from '../ts-config';
import { ProjectCommand } from './project-command';

export class NodeCommand extends ProjectCommand {
  @Command.String({ required: true })
  public script!: string;

  @Command.Path('node')
  async execute(): Promise<number> {
    const tsConfig = new TsConfig({
      outDir: './lib',
      include: ['src'],
      exclude: ['src/lambdas', 'src/**/__tests__'],
    });

    await tsConfig.writeJson(
      path.join(this.projectInfo.projectPath, 'tsconfig.json'),
      {
        overwriteExisting: false,
      },
    );

    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const command = require.resolve('ts-node/dist/bin');
    const args = [this.script];

    config();

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
      },
    });

    return 0;
  }
}
