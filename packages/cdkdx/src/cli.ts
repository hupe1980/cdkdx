import * as fs from 'fs-extra';
import { Cli, Command } from 'clipanion';

import {
  BuildCommand,
  TestCommand,
  LinterCommand,
  NodeCommand,
  BundleCommand,
  PackageCommand,
  BumpCommand,
  CreateCommand,
  DocgenCommand,
  ReleaseCommand,
} from './commands';
import { resolveOwn } from './utils';

const { name, version } = fs.readJSONSync(resolveOwn('package.json'));

const cli = new Cli({
  binaryLabel: name,
  binaryName: name,
  binaryVersion: version,
});

cli.register(Command.Entries.Help);
cli.register(Command.Entries.Version);
cli.register(CreateCommand);
cli.register(DocgenCommand);
cli.register(BuildCommand);
cli.register(TestCommand);
cli.register(LinterCommand);
cli.register(NodeCommand);
cli.register(BundleCommand);
cli.register(PackageCommand);
cli.register(BumpCommand);
cli.register(ReleaseCommand);

cli.runExit(process.argv.slice(2), {
  ...Cli.defaultContext,
});
