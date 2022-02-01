import * as path from 'path';
import { ProjectInfo } from '../src/project-info';

test('workspace project infos', async () => {
  expect.assertions(4);

  const info = new ProjectInfo(path.join(__dirname, '__fixtures__', 'ws'));

  const wsInfos = await info.getWorkspaceProjectInfos();

  expect(wsInfos.length).toBe(3);

  const names = [wsInfos[0].name, wsInfos[1].name, wsInfos[2].name];

  expect(names).toContain('p1');
  expect(names).toContain('p2');
  expect(names).toContain('p3');
});
