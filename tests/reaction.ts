const { reaction } = require('../dist/reaction');

describe('Reaction >>', () => {
  test('should be defined', () => {
    expect(reaction).toBeDefined();
  });

  test('should return a promise', () => {
    expect(reaction({}).catch(() => {})).toBeInstanceOf(Promise);
  });

  test('should throw a missing channel error if no arguments are passed', () => {
    const typeError = () => reaction();
    expect(typeError).toThrowError('Missing channel');
  });
});
