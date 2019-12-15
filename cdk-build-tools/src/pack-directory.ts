import fs from 'fs-extra';
import packlist from 'npm-packlist';

import { zipFiles } from './utils';

export async function packDirectory(
  sourcePath: string,
  outputFile: string
): Promise<void> {
  const files = await packlist({ path: sourcePath });

  if (!(await fs.pathExists(outputFile))) {
    await fs.createFile(outputFile);
  }

  return zipFiles(files, sourcePath, outputFile);
}
