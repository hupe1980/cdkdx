import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { Context } from '../context';
import { shell } from '../shell';

export class PackageCommand extends Command<Context> {
  @Command.Path(`package`)
  async execute() {
    const outdir = 'dist';

    if (this.context.isJsii) {
      const command = [require.resolve('jsii-pacmak/bin/jsii-pacmak')];
      await shell(command);
    } else {
       const command = ['npm', 'pack'];
       const tarball = (await shell(command)).trim();
       const target = path.join(outdir, 'js');
       await fs.remove(target);
       await fs.mkdirp(target);
       await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    this.context.stdout.write(
      `✅ Construct ${this.context.construct} packed.\n\n`
    );

    return 0;
  }
}
