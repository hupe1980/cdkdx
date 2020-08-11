import type { PackageJson } from 'type-fest';
import { Command } from 'clipanion';
import latestVersion from 'latest-version';

import { Semver } from '../semver';
import { BaseProjectCommand } from '../base-command';

export class UpgradeCdkCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Upgrade aws cdk to the latest version',
    details: `
            This command will upgrade the aws dependencies in the package.json to the latest version.
        `,
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
    const cdkVersion = this.version ?? (await latestVersion('@aws-cdk/core'));
    const versionSpec = Semver[this.mode ?? 'caret'](cdkVersion).spec;

    if (!this.skipDependencies) {
      this.context.stdout.write('\nUpgrade dependencies:\n');
      this.upgradeCdk(this.projectInfo.dependencies, versionSpec);
    }

    if (!this.skipDevDependencies) {
      this.context.stdout.write('\nUpgrade devDependencies:\n');
      this.upgradeCdk(this.projectInfo.devDependencies, versionSpec);
    }

    if (!this.skipPeerDependencies) {
      this.context.stdout.write('\nUpgrade peerDependencies:\n');
      this.upgradeCdk(this.projectInfo.peerDependencies, versionSpec);
    }

    if (!this.dryRun) {
      await this.projectInfo.syncPkgJson();

      this.context.logger.done(`Cdk versions upgraded to ${versionSpec}.\n`);
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
