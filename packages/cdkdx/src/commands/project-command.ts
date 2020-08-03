import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { resolveProject } from '../utils';

export interface ProjectInfo {
  name: string;
  isJsii: boolean;
  private: boolean;
  workspaces?: string[];
  externals?: string[];
  projectPath: string;
  lambdasSrcPath: string;
  lambdasOutPath: string;
  distPath: string;
  libPath: string;
  typescriptExcludes: string[];
}

export abstract class ProjectCommand extends Command {
  protected projectInfo: ProjectInfo;

  constructor() {
    super();

    const pkgJson = fs.readJsonSync(resolveProject('package.json'));

    this.projectInfo = {
      isJsii: pkgJson.jsii !== undefined,
      name: pkgJson.name,
      private: pkgJson.private,
      workspaces: pkgJson.workspaces,
      externals: pkgJson.externals,
      projectPath: resolveProject('.'),
      lambdasSrcPath: resolveProject(path.join('src', 'lambdas')),
      lambdasOutPath: resolveProject(path.join('lib', 'lambdas')),
      libPath: resolveProject('lib'),
      distPath: resolveProject('dist'),
      typescriptExcludes: ['src/lambdas', 'src/**/__tests__'],
    };
  }
}
