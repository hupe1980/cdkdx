import * as fs from 'fs-extra';
import * as path from 'path';
import { Construct, ISynthesisSession } from 'constructs';

import { Project } from './project';

export class Directory extends Construct {
  public readonly path: string;

  constructor(project: Project, dirPath: string) {
    super(project, dirPath);
    this.path = dirPath;
  }

  public onSynthesize(session: ISynthesisSession): void {
    const dirPath = path.join(session.outdir, this.path);
    fs.mkdirpSync(dirPath);
  }
}
