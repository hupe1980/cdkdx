import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';

import { BaseProjectCommand } from '../base-command';
import { Timer } from '../timer';

export class PackageCommand extends BaseProjectCommand {
  @Command.String('-o, --outdir')
  public outDir?: string;

  @Command.Path('package')
  async execute(): Promise<number> {
    if (this.projectInfo.private) {
      this.context.logger.warn('No packaging for private modules.\n');
      return 0;
    }

    const timer = new Timer();

    const outdir = this.outDir ?? this.projectInfo.distPath;

    await fs.remove(outdir);

    if (this.projectInfo.isJsii) {
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

    timer.end();

    this.context.logger.log(''); //empty line
    this.context.logger.done(
      `${this.projectInfo.name} packed in ${timer.display()}.\n`,
    );

    return 0;
  }
}
