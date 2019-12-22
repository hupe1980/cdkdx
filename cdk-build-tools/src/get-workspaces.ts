import fs from 'fs-extra';
import path from 'path';
import globby from 'globby';
import findWorkspaceRoot from 'find-workspace-root';

export interface Options {
    cwd?: string;
}

export const getWorkspaces = async (options?: Options) => {
    const { cwd } = {
        cwd: process.cwd(),
        ...options
    }

    const rootDir = await findWorkspaceRoot(cwd);

    if(!rootDir) {
        return null;
    }

    const { workspaces } = await fs.readJSON(
      path.join(rootDir, 'package.json')
    );

    if (!workspaces) {
        return null;
    }

     const folders = await globby(workspaces, {
       cwd: rootDir,
       onlyDirectories: true,
       absolute: true,
       expandDirectories: false
     });

     console.log(folders);

     folders.forEach(folder => console.log(path.relative(rootDir, folder)))

     return null;
}