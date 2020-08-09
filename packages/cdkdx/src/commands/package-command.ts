import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';

import { BaseProjectCommand } from '../base-command';

export class PackageCommand extends BaseProjectCommand {
  @Command.String('-o, --outdir')
  public outDir?: string;

  @Command.Path('package')
  async execute(): Promise<number> {
    if (this.projectInfo.private) {
      this.context.stdout.write('⚠ No packaging for private modules.\n\n');
      return 0;
    }

    const outdir = this.outDir ?? this.projectInfo.distPath;

    await fs.remove(outdir);

    if (this.projectInfo.jsii) {
      const command = require.resolve('jsii-pacmak/bin/jsii-pacmak');
      await execa(command, ['--outdir', outdir, '--no-npmignore']);
    } else {
      const { stdout } = await execa('npm', ['pack']);
      const tarball = stdout.trim();
      const target = path.join(outdir, 'js');
      await fs.remove(target);
      await fs.mkdirp(target);
      await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    this.context.log(''); //empty line
    this.context.done(`${this.projectInfo.name} packed.\n`);

    return 0;
  }
}
