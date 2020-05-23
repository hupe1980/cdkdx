import { Cli } from 'clipanion';

import { CommandContext } from './commands/base-command';
import { BuildCommand } from './commands/build-command';
import { HelpCommand } from './commands/help-command';
import { TestCommand } from './commands/test-command';
import { LinterCommand } from './commands/linter-command';
import { BundleCommand } from './commands/bundle-command';

export async function main({
  binaryName,
  binaryVersion
}: {
  binaryName: string;
  binaryVersion: string;
}) {
    const cli = new Cli<CommandContext>({
      binaryLabel: `CDKDX`,
      binaryName,
      binaryVersion
    });

    cli.register(BuildCommand);
    cli.register(HelpCommand);
    cli.register(TestCommand);
    cli.register(LinterCommand);
    cli.register(BundleCommand);

    try {
      await cli.runExit(process.argv.slice(2), {
        cwd: process.cwd(),
        ...Cli.defaultContext
      });
    } catch (error) {
      process.stdout.write(cli.error(error));
      process.exitCode = 1;
    }
}

