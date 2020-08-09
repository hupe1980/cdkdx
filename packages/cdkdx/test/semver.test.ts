import { Semver } from '../src/semver';

test('pinned', () => {
  const semver = Semver.pinned('1.0.0');

  expect(semver.version).toBe('1.0.0');
  expect(semver.spec).toBe('1.0.0');
});

test('caret', () => {
  const semver = Semver.caret('1.0.0');

  expect(semver.version).toBe('1.0.0');
  expect(semver.spec).toBe('^1.0.0');
});

test('tilde', () => {
  const semver = Semver.tilde('1.0.0');

  expect(semver.version).toBe('1.0.0');
  expect(semver.spec).toBe('~1.0.0');
});
