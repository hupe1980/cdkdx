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
    
    const pkgJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
    
    this.constructInfo = {
      isJsii: pkgJson.jsii !== undefined,
      name: pkgJson.name,
      private: pkgJson.private,
    };
  }
}