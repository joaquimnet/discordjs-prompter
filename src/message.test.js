const message = require('./message');

test('should be truthy', () => {
  expect(message).toBeTruthy();
});

test('should throw a missing channel error', () => {
  const typeError = () => message();
  expect(typeError).toThrowError('Missing channel');
});