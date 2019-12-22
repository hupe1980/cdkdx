import { Writable, Readable } from 'stream';

export type CommandContext = {
  cwd: string;
  //plugins: PluginConfiguration;
  quiet: boolean;
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
};
