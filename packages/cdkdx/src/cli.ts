import * as path from 'path';
import * as fs from 'fs-extra';
import { Cli } from 'clipanion';

import { CommandContext } from './commands/base-command';
import { BuildCommand } from './commands/build-command';
import { HelpCommand } from './commands/help-command';
import { TestCommand } from './commands/test-command';
import { LinterCommand } from './commands/linter-command';
import { BundleCommand } from './commands/bundle-command';

const { name, version } = fs.readJSONSync(path.join(__dirname, '..', 'package.json'));

const cli = new Cli<CommandContext>({
  binaryLabel: `CDKDX`,
  binaryName: name,
  binaryVersion: version,
});

cli.register(BuildCommand);
cli.register(HelpCommand);
cli.register(TestCommand);
cli.register(LinterCommand);
cli.register(BundleCommand);

cli.runExit(process.argv.slice(2), {
    cwd: process.cwd(),
    ...Cli.defaultContext,
});
