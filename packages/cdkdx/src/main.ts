import { Cli } from 'clipanion';
//import updateNotifier from 'update-notifier';

import { BuildCommand } from './commands/build-command';
import { HelpCommand } from './commands/help-command';
import { TestCommand } from './commands/test-command';
import { LinterCommand } from './commands/linter-command';
import { BundleCommand } from './commands/bundle-command';
import { PackCommand } from './commands/pack-command';

import { CommandContext } from './commands/plugin';

export async function main({
  binaryName,
  binaryVersion
}: {
  binaryName: string;
  binaryVersion: string;
}) {
  async function run(): Promise<void> {
    const cli = new Cli<CommandContext>({
      binaryLabel: `CDK-DX`,
      binaryName,
      binaryVersion
    });

    cli.register(BuildCommand);
    cli.register(HelpCommand);
    cli.register(TestCommand);
    cli.register(LinterCommand);
    cli.register(BundleCommand);
    cli.register(PackCommand);

    try {
      await exec(cli);
    } catch (error) {
      process.stdout.write(cli.error(error));
      process.exitCode = 1;
    }
  }

  async function exec(cli: Cli<CommandContext>): Promise<void> {
    const command = cli.process(process.argv.slice(2));

    cli.runExit(command, {
      cwd: process.cwd(),
      quiet: false,
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    });
  }

  return run().catch(error => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}
