import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { Context } from '../context';

export interface ConstructInfo {
  name: string;
  isJsii: boolean;
  private: boolean;
}

export abstract class ConstructCommand extends Command<Context> {
  protected constructInfo: ConstructInfo;

  constructor() {
    super();
    this.constructInfo = this.getConstructInfo();
  }

  private getConstructInfo() {
    const pkgJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));

    return {
      isJsii: pkgJson.jsii !== undefined,
      name: pkgJson.name,
      private: pkgJson.private,
    };
  }
}