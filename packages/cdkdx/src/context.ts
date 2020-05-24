import { BaseContext } from 'clipanion';

export type Context = BaseContext & {
  cwd: string;
  isJsii: boolean;
  construct: string;
};
