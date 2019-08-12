const { choice } = require('../dist/choice');

describe('Choice >>', () => {
  test('should be defined', () => {
    expect(choice).toBeDefined();
  });

  test('should return a promise', () => {
    expect(choice({}, { choices: [''] }).catch(() => {})).toBeInstanceOf(
      Promise,
    );
  });

  test('should throw a missing channel error if no arguments are passed', () => {
    const typeError = () => choice();
    expect(typeError).toThrowError('Missing channel');
  });

  test('should throw a choices required error if no options are passed', () => {
    const typeError = () => choice({});
    expect(typeError).toThrowError('Choice prompt requires options.choices');
  });
});
