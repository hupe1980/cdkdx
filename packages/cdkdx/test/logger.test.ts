import { Logger } from '../src/logger';

test('done', () => {
  const spy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => true);

  const logger = new Logger({
    stderr: process.stderr,
    stdout: process.stdout,
    disableColors: true,
  });

  logger.done('foo');

  expect(spy).toHaveBeenCalledWith(' DONE  foo\n');
});
