import type { PackageJson } from 'type-fest';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Cli } from 'clipanion';

import { CommandContext } from './base-command';
import * as commands from './commands';
import { Logger } from './logger';

/**
 * Register commands in `commands/`
 * @param cli the Clipanion instance.
 */
function registerCommands(cli: Cli<CommandContext>) {
  Object.values(commands).forEach((command) => cli.register(command));
}

async function main() {
  const cwd = process.cwd();

  const { name, version } = (await fs.readJSON(
    path.join(cwd, 'package.json'),
  )) as PackageJson;

  async function run(): Promise<void> {
    const cli = new Cli<CommandContext>({
      binaryLabel: name,
      binaryName: name,
      binaryVersion: version,
    });

    registerCommands(cli);

    try {
      await exec(cli);
    } catch (error) {
      process.stdout.write(cli.error(error));
      process.exitCode = 1;
    }
  }

  async function exec(cli: Cli<CommandContext>): Promise<void> {
    const command = cli.process(process.argv.slice(2));

    const logger = new Logger({
      stdout: process.stdout,
      stderr: process.stderr,
    });

    cli.runExit(command, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      cwd,
      version: version as string,
      log: logger.log,
      done: logger.done,
    });
  }

  return run().catch((error) => {
    process.stdout.write(error.stack || error.message);
    process.exitCode = 1;
  });
}

main();
