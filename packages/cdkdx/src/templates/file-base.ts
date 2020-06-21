import * as fs from 'fs-extra';
import * as path from 'path';
import { Construct, ISynthesisSession } from 'constructs';

import { Project } from './project';

export abstract class FileBase extends Construct {
  public readonly path: string;

  constructor(project: Project, filePath: string) {
    super(project, filePath);
    this.path = filePath;
  }

  protected abstract get data(): string;

  public onSynthesize(session: ISynthesisSession): void {
    const filePath = path.join(session.outdir, this.path);

    fs.mkdirpSync(path.dirname(filePath));

    fs.writeFileSync(filePath, this.data);
  }
}
