import * as path from 'path';
import { JsiiDocgen } from '../src/docgen';
import { Logger } from '../src/logger';

const logger = new Logger({
  stderr: process.stderr,
  stdout: process.stdout,
  disableColors: true,
});

test('jsii docgen without jsii throws error', () => {
  const docgen = new JsiiDocgen();

  expect(
    docgen.generate({
      logger,
      projectPath: path.join(__dirname, '__fixtures__', 'tsc-docgen'),
    }),
  ).rejects.toThrow('File .jsii is missing! Please run cdkdx build first.');
});
