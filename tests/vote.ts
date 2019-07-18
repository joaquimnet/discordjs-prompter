const { vote } = require('../dist/vote');

describe('Vote >>', () => {
  test('should be defined', () => {
    expect(vote).toBeDefined();
  });

  test('should return a promise', () => {
    expect(vote({}).catch(() => {})).toBeInstanceOf(Promise);
  });

  test('should throw a missing channel error if no arguments are passed', () => {
    const typeError = () => vote();
    expect(typeError).toThrowError('Missing channel');
  });
});
