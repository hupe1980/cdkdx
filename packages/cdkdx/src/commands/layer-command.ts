import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { BaseProjectCommand } from '../base-command';
import { Docker, Layers } from '../docker';

export class LayerCommand extends BaseProjectCommand {
  @Command.Path('layer')
  async execute(): Promise<number> {
    const layers = new Layers(this.projectInfo.layersSrcPath);

    layers.warnings.forEach((warning) => {
      this.context.logger.warn(`File ${warning} not found!\n`);
    });

    // Return 0 if no layers were found
    if (!layers.hasEntries()) {
      this.context.logger.log(``);
      this.context.logger.info('No layers were found to build.\n');
      return 0;
    }

    for (const entry of layers.entries) {
      const srcPath = path.join(this.projectInfo.layersSrcPath, entry);
      const destPath = path.join(this.projectInfo.layersOutPath, entry);
      await fs.mkdirp(destPath);

      this.context.logger.info(
        `Start building layer ${entry}. It may take some time!\n`,
      );

      const docker = new Docker(srcPath, `${entry}-lambda-layer`);
      await docker.build();

      const container = await docker.run();
      await docker.copy(container, destPath);
      await docker.remove(container);

      await fs.copyFile(
        path.join(srcPath, 'Dockerfile'),
        path.join(destPath, 'Dockerfile'),
      );

      this.context.logger.done(`Layer ${entry} builded.\n`);
    }

    return 0;
  }
}
