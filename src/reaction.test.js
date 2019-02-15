const reaction = require('./reaction');

test('should be truthy', () => {
  expect(reaction).toBeDefined();
});

test('should throw a missing channel error', () => {
  const typeError = () => reaction();
  expect(typeError).toThrowError('Missing channel');
});