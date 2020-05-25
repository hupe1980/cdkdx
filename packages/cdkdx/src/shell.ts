import spawn from 'cross-spawn';

export async function shell(command: string[]): Promise<string> {
  const child = spawn(command[0], command.slice(1), {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<Uint8Array>();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    child.stdout!.on('data', (chunk) => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    child.stderr!.on('data', (chunk) => {
      process.stderr.write(chunk.toString());
    });

    child.once('error', reject);

    child.once('exit', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`${command} exited with error code ${code}`));
      }
    });
  });
}
