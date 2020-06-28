import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { Context } from '../context';

export interface ProjectInfo {
  name: string;
  isJsii: boolean;
  private: boolean;
}

export abstract class ProjectCommand extends Command<Context> {
  protected projectInfo: ProjectInfo;

  constructor() {
    super();
    
    const pkgJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
    
    this.projectInfo = {
      isJsii: pkgJson.jsii !== undefined,
      name: pkgJson.name,
      private: pkgJson.private,
    };
  }
}