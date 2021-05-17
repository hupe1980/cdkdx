import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';

export class Layers {
  public readonly entries = new Array<string>();
  public readonly warnings = new Array<string>();

  constructor(srcPath: string) {
    if (fs.existsSync(srcPath)) {
      fs.readdirSync(srcPath).forEach((name) => {
        const layerPath = path.join(srcPath, name);

        if (!fs.statSync(layerPath).isDirectory()) return;

        const entry = path.join(layerPath, 'Dockerfile');

        if (fs.existsSync(entry)) {
          this.entries.push(name);
        } else {
          this.warnings.push(entry);
        }
      });
    }
  }

  public hasEntries(): boolean {
    return Object.keys(this.entries).length > 0;
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
}

export class Docker {
  constructor(
    private readonly cwd: string,
    private readonly tag: string,
    private readonly assetName = 'lambda.zip',
  ) {
    execa.sync('docker', ['version'], {
      stdio: 'ignore',
    });
  }

  public async build(): Promise<void> {
    await execa(
      'docker',
      [
        'build',
        '--build-arg',
        `asset_name=${this.assetName}`,
        '-t',
        this.tag,
        '.',
      ],
      {
        cwd: this.cwd,
        stdio: ['ignore', 'inherit', 'inherit'],
      },
    );
  }

  public async run(): Promise<string> {
    const { stdout: container } = await execa(
      'docker',
      ['run', '-d', this.tag, 'false'],
      {
        cwd: this.cwd,
      },
    );

    return container;
  }

  public async copy(container: string, destPath: string): Promise<void> {
    await execa(
      'docker',
      [
        'cp',
        `${container}:/${this.assetName}`,
        `${destPath}/${this.assetName}`,
      ],
      {
        cwd: this.cwd,
        stdio: 'ignore',
      },
    );
  }

  public async remove(container: string): Promise<void> {
    await execa('docker', ['rm', '-f', container], {
      cwd: this.cwd,
      stdio: 'ignore',
    });
  }
}
