const { message } = require('../dist/message');

describe('Message >>', () => {
  test('should be defined', () => {
    expect(message).toBeTruthy();
  });

  test('should return a promise', () => {
    expect(message({}, { question: 'a' }).catch(() => {})).toBeInstanceOf(Promise);
  });

  test('should throw a missing channel error if no arguments are passed', () => {
    const typeError = () => message();
    expect(typeError).toThrowError('Missing channel');
  });
});
