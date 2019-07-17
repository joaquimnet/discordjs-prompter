const message = require('../src/message');

describe('Message tests', () => {
  test('should be defined', () => {
    expect(message).toBeTruthy();
  });

  test('should throw a missing channel error', () => {
    const typeError = () => message();
    expect(typeError).toThrowError('Missing channel');
  });
});
