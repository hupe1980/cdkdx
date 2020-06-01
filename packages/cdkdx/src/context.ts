import { BaseContext } from 'clipanion';

export type Context = BaseContext & {
  cdkdxVersion: string;
  cwd: string;
  isJsii: boolean;
  private: boolean;
  name: string;
};
