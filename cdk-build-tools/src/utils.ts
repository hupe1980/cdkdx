import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import spawn from 'cross-spawn';
import { SpawnOptions } from 'child_process';

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

export const execProgram = async (
  command: string,
  args: ReadonlyArray<string>,
  options?: SpawnOptions
): Promise<string> => {
  const proc = spawn(command, args, options);

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    proc.stdout!.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    proc.stderr!.on('data', chunk => {
      process.stderr.write(chunk.toString());
    });

    proc.once('error', reject);

    proc.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${code}`));
      }
    });
  });
};
