import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';

export const clearConsole = (): void => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
};

export const appDirectory = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath);

export const zipFiles = (
  files: string[],
  source: string,
  outputFile: string
): Promise<void> => {
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
