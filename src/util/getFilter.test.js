const getFilter = require('./getFilter');

test('should return a filter function', () => {
  expect(getFilter('message', { prefix: '!', userId: '123' })).toBeTruthy();
  expect(getFilter('reaction', { confirm: '✅', cancel: '❌' })).toBeTruthy();
});

test('should throw a missing filter type error', () => {
  const messageError = () => getFilter();
  const reactionError = () => getFilter();
  expect(messageError).toThrowError('Missing filter type');
  expect(reactionError).toThrowError('Missing filter type');
});

test('should throw a missing options error', () => {
  const messageError = () => getFilter('message');
  const reactionError = () => getFilter('reaction');
  expect(messageError).toThrowError('Missing filter options');
  expect(reactionError).toThrowError('Missing filter options');
});

test('should throw a unknown type error', () => {
  const typeError = () => getFilter('newfilter', { correctOptions: true });
  expect(typeError).toThrowError('Unknown filter');
});

test('should throw a missing emoji error', () => {
  const emojiError = () => getFilter('reaction', { confirm: '✅' });
  const emojiError2 = () => getFilter('reaction', { confirm: '❌' });
  expect(emojiError).toThrowError('Missing emoji');
  expect(emojiError2).toThrowError('Missing emoji');
});

test('should pass the message filter', () => {
  // Correct prefix and id
  const result1 = getFilter('message', { prefix: '!', userId: '123' })({
    content: '!hello',
    author: { id: '123' },
  });
  // Correct id no prefix
  const result2 = getFilter('message', { userId: '123' })({
    content: 'hello',
    author: { id: '123' },
  });
  // Correct prefix no id
  const result3 = getFilter('message', { prefix: '!' })({
    content: '!hello',
    author: { id: '123' },
  });
  expect(result1).toBeTruthy();
  expect(result2).toBeTruthy();
  expect(result3).toBeTruthy();
});

test('should pass the reaction filter', () => {
  // Correct emoji no id
  const result1 = getFilter('reaction', { confirm: '✅', cancel: '❌' })(
    {
      emoji: { name: '✅' },
    },
    { id: '123' }
  );
  // Correct emoji and id
  const result2 = getFilter('reaction', {
    confirm: '✅',
    cancel: '❌',
    userId: '123',
  })(
    {
      emoji: { name: '✅' },
    },
    { id: '123' }
  );
  // Correct emoji no id
  const result3 = getFilter('reaction', { confirm: '✅', cancel: '❌' })(
    {
      emoji: { name: '❌' },
    },
    { id: '123' }
  );
  expect(result1).toBeTruthy();
  expect(result2).toBeTruthy();
  expect(result3).toBeTruthy();
});

test('should fail the message filter', () => {
  // Missing prefix
  const result1 = getFilter('message', { prefix: '!', userId: '123' })({
    content: 'hello',
    author: { id: '123' },
  });
  // Wrong Id
  const result2 = getFilter('message', { userId: '123' })({
    content: 'hello',
    author: { id: '124' },
  });
  // Missing prefix no id
  const result3 = getFilter('message', { prefix: '!' })({
    content: 'hello',
    author: { id: '123' },
  });
  expect(result1).toBeFalsy();
  expect(result2).toBeFalsy();
  expect(result3).toBeFalsy();
});

test('should fail the reaction filter', () => {
  // Wrong emoji
  const result1 = getFilter('reaction', { confirm: '✅', cancel: '❌' })(
    {
      emoji: { name: '😂' },
    },
    { id: '123' }
  );
  // Wrong Id
  const result2 = getFilter('reaction', {
    confirm: '✅',
    cancel: '❌',
    userId: '123',
  })(
    {
      emoji: { name: '✅' },
    },
    { id: '124' }
  );
  // Wrong emoji no id
  const result3 = getFilter('reaction', { confirm: '✅', cancel: '❌' })(
    {
      emoji: { name: '😂' },
    },
    { id: '123' }
  );
  expect(result1).toBeFalsy();
  expect(result2).toBeFalsy();
  expect(result3).toBeFalsy();
});
