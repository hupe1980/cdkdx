import path from 'path';
import fs from 'fs-extra';

import { Runner } from '../runner';
import { PackageInfo } from '../package-info';
import { execProgram } from '../utils';

export class Packager  implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {
  }

  public async run() {
    if (this.packageInfo.isPrivate()) {
      console.log('No packaging for private modules');
      return;
    }

    const outdir = 'dist';

    if (this.packageInfo.isJsii()) {
      const command = require.resolve('jsii-pacmak/bin/jsii-pacmak');
      const args = ['-o', outdir];

      await execProgram(command, args);
    } else {
      const command = 'npm';
      const args = ['pack'];

      const tarball = (await execProgram(command, args)).trim();

      const target = path.join(outdir, 'js');

      await fs.remove(target);
      await fs.mkdirp(target);
      await fs.move(tarball, path.join(target, path.basename(tarball)));
    }
  }
}
