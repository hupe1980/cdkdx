import spawn from 'cross-spawn';
import { SpawnOptions } from 'child_process';

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
