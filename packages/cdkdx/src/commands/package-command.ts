import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';

import { ConstructCommand } from './construct-command';

export class PackageCommand extends ConstructCommand {
  @Command.Path('package')
  async execute(): Promise<number> {
    if (this.constructInfo.private) {
      this.context.stdout.write(
        '⚠ No packaging for private modules.\n\n'
      );
      return 0;
    }

    const outdir = 'dist';

    if (this.constructInfo.isJsii) {
      const command = require.resolve('jsii-pacmak/bin/jsii-pacmak');
      await execa(command);
    } else {
      const { stdout } = await execa('npm', ['pack']);
      const tarball = stdout.trim();
      const target = path.join(outdir, 'js');
      await fs.remove(target);
      await fs.mkdirp(target);
      await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    this.context.stdout.write(
      `✅ Construct ${this.constructInfo.name} packed.\n\n`
    );

    return 0;
  }
}
