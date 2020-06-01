import { BaseContext } from 'clipanion';

export type Context = BaseContext & {
  version: string;
  cwd: string;
};
