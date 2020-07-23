import * as fs from 'fs-extra';
import { Cli, Command } from 'clipanion';

import * as commands from './commands';
import { resolveOwn } from './utils';

const { name, version } = fs.readJSONSync(resolveOwn('package.json'));

const cli = new Cli({
  binaryLabel: name,
  binaryName: name,
  binaryVersion: version,
});

cli.register(Command.Entries.Help);
cli.register(Command.Entries.Version);

Object.values(commands).forEach((command) => cli.register(command));

cli.runExit(process.argv.slice(2), {
  ...Cli.defaultContext,
});
