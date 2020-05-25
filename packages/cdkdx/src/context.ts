import { BaseContext } from 'clipanion';

export type Context = BaseContext & {
  cwd: string;
  isJsii: boolean;
  private: boolean;
  name: string;
};
