const reaction = require('../src/reaction');

describe('Vote tests', () => {
  test('should be defined', () => {
    expect(reaction).toBeDefined();
  });

  test('should throw a missing channel error', () => {
    const typeError = () => reaction();
    expect(typeError).toThrowError('Missing channel');
  });
});