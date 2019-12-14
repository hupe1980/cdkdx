import path from 'path';
import archiver from 'archiver';
import fs from 'fs-extra';
import packlist from 'npm-packlist';

function zipFiles(
  files: string[],
  source: string,
  outputFile: string
): Promise<void> {
  return new Promise((resolve, reject): void => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip');

    files.forEach((file): void => {
      const filePath = path.join(source, file);
      archive.file(filePath, { name: file });
    });

    archive.pipe(output);
    archive.finalize();

    archive.on('warning', reject);
    archive.on('error', reject);

    output.once('close', (): void => resolve());
  });
}

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
