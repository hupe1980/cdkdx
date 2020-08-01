import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import latestVersion from 'latest-version';
import { PackageJson } from 'type-fest';

import { Semver } from '../semver';
import { resolveProject } from '../utils';
import { ProjectCommand } from './project-command';

export class UpgradeCdkCommand extends ProjectCommand {
  static usage = Command.Usage({
    description: 'Upgrade aws cdk',
    details: ``,
  });

  @Command.Boolean('--dry-run')
  public dryRun = false;

  @Command.String('--mode')
  public mode?: 'pinned' | 'caret' | 'tilde';

  @Command.String('--version')
  public version?: string;

  @Command.Boolean('--skip-dependencies')
  public skipDependencies = false;

  @Command.Boolean('--skip-dev-dependencies')
  public skipDevDependencies = false;

  @Command.Boolean('--skip-peer-dependencies')
  public skipPeerDependencies = false;

  @Command.Path('upgrade-cdk')
  async execute(): Promise<number> {
    const pkgJson: PackageJson = await fs.readJSON(
      resolveProject('package.json'),
    );

    const cdkVersion = this.version ?? (await latestVersion('@aws-cdk/core'));
    const versionSpec = Semver[this.mode ?? 'caret'](cdkVersion).spec;

    if (!this.skipDependencies) {
      this.context.stdout.write('\nUpgrade dependencies:\n');
      this.upgradeCdk(pkgJson.dependencies, versionSpec);
    }

    if (!this.skipDevDependencies) {
      this.context.stdout.write('\nUpgrade devDependencies:\n');
      this.upgradeCdk(pkgJson.devDependencies, versionSpec);
    }

    if (!this.skipPeerDependencies) {
      this.context.stdout.write('\nUpgrade peerDependencies:\n');
      this.upgradeCdk(pkgJson.peerDependencies, versionSpec);
    }

    if (!this.dryRun) {
      await fs.writeJSON(resolveProject('package.json'), pkgJson, {
        spaces: 2,
      });
    }

    return 0;
  }

  private upgradeCdk(
    dependencies: PackageJson.Dependency | undefined,
    versionSpec: string,
  ): void {
    if (!dependencies) return;

    Object.keys(dependencies).forEach((key) => {
      if (key.startsWith('@aws-cdk/') || key === 'aws-cdk') {
        this.context.stdout.write(
          `${key}:${dependencies[key]} => ${versionSpec}\n`,
        );
        dependencies[key] = versionSpec;
      }
    });
  }
}
