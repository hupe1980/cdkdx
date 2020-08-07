import type { PackageJson as TypeFestPackageJson } from 'type-fest';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { resolveProject } from '../utils';

export interface PackageJson extends TypeFestPackageJson {
  externals?: string[];
}

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

    const pkgJson: PackageJson = fs.readJsonSync(
      resolveProject('package.json'),
    );

    if (!pkgJson.name) {
      throw new Error('Property "name" is missing in package.json');
    }

    let workspacePackages: string[] | undefined = undefined;
    if (pkgJson.workspaces) {
      workspacePackages = Array.isArray(pkgJson.workspaces)
        ? pkgJson.workspaces
        : pkgJson.workspaces.packages;
    }

    this.projectInfo = {
      isJsii: pkgJson.jsii !== undefined,
      name: pkgJson.name,
      private: pkgJson.private || false,
      workspaces: workspacePackages,
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
