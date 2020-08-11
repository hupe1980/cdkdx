import * as path from 'path';
import { Command } from 'clipanion';
import { config } from 'dotenv';
import execa from 'execa';

import { TsConfig } from '../ts-config';
import { BaseProjectCommand } from '../base-command';

export class NodeCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Execute cdk apps',
    details: `
      This command bundles the lambdas, compiles the app and adds support for .env files to the cdk app.
      It is usually specified in the cdk.json file:
      
      // cdk.json

      {

        "app": "cdkdx node src/your-app.ts",

        "context": ...
        
      }
    `,
  });

  @Command.String({ required: true })
  public script!: string;

  @Command.Path('node')
  async execute(): Promise<number> {
    const tsConfig = TsConfig.fromJsiiTemplate({
      outDir: './lib',
      include: ['src'],
      exclude: ['src/lambdas', 'src/**/__tests__'],
    });

    await tsConfig.writeJson(path.join(this.context.cwd, 'tsconfig.json'), {
      overwriteExisting: false,
    });

    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const command = require.resolve('ts-node/dist/bin');
    const args = [this.script];

    config(); //.env

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
      },
    });

    return 0;
  }
}
