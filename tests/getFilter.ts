const { _getFilter } = require('../dist/util/getFilter');

describe('Filter tests', () => {
  test('should be defined and be a function', () => {
    expect(_getFilter).toBeDefined();
    expect(typeof _getFilter).toBe('function');
  });

  test('should return a filter function', () => {
    expect(_getFilter('message', { prefix: '!', userId: '123' })).toBeTruthy();
    expect(_getFilter('reaction', { confirm: '✅', cancel: '❌' })).toBeTruthy();
  });

  test('should throw a missing filter type error', () => {
    const messageError = () => _getFilter();
    const reactionError = () => _getFilter();
    expect(messageError).toThrowError('Missing filter type');
    expect(reactionError).toThrowError('Missing filter type');
  });

  test('should throw a missing options error', () => {
    const messageError = () => _getFilter('message');
    const reactionError = () => _getFilter('reaction');
    expect(messageError).toThrowError('Missing filter options');
    expect(reactionError).toThrowError('Missing filter options');
  });

  test('should throw a unknown type error', () => {
    const typeError = () => _getFilter('newfilter', { correctOptions: true });
    expect(typeError).toThrowError('Unknown filter');
  });

  test('should throw a missing emoji error', () => {
    const emojiError = () => _getFilter('reaction', { confirm: '✅' });
    const emojiError2 = () => _getFilter('reaction', { confirm: '❌' });
    expect(emojiError).toThrowError('Missing emoji');
    expect(emojiError2).toThrowError('Missing emoji');
  });

  test('should pass the message filter', () => {
    // Correct prefix and id
    const result1 = _getFilter('message', { prefix: '!', userId: '123' })({
      content: '!hello',
      author: { id: '123' },
    });
    // Correct id no prefix
    const result2 = _getFilter('message', { userId: '123' })({
      content: 'hello',
      author: { id: '123' },
    });
    // Correct prefix no id
    const result3 = _getFilter('message', { prefix: '!' })({
      content: '!hello',
      author: { id: '123' },
    });
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result3).toBeTruthy();
  });

  test('should pass the reaction filter', () => {
    // Correct emoji no id
    const result1 = _getFilter('reaction', { confirm: '✅', cancel: '❌' })(
      {
        emoji: { name: '✅' },
      },
      { id: '123' },
    );
    // Correct emoji and id
    const result2 = _getFilter('reaction', {
      confirm: '✅',
      cancel: '❌',
      userId: '123',
    })(
      {
        emoji: { name: '✅' },
      },
      { id: '123' },
    );
    // Correct emoji no id
    const result3 = _getFilter('reaction', { confirm: '✅', cancel: '❌' })(
      {
        emoji: { name: '❌' },
      },
      { id: '123' },
    );
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result3).toBeTruthy();
  });

  test('should fail the message filter', () => {
    // Missing prefix
    const result1 = _getFilter('message', { prefix: '!', userId: '123' })({
      content: 'hello',
      author: { id: '123' },
    });
    // Wrong Id
    const result2 = _getFilter('message', { userId: '123' })({
      content: 'hello',
      author: { id: '124' },
    });
    // Missing prefix no id
    const result3 = _getFilter('message', { prefix: '!' })({
      content: 'hello',
      author: { id: '123' },
    });
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });

  test('should fail the reaction filter', () => {
    // Wrong emoji
    const result1 = _getFilter('reaction', { confirm: '✅', cancel: '❌' })(
      {
        emoji: { name: '😂' },
      },
      { id: '123' },
    );
    // Wrong Id
    const result2 = _getFilter('reaction', {
      confirm: '✅',
      cancel: '❌',
      userId: '123',
    })(
      {
        emoji: { name: '✅' },
      },
      { id: '124' },
    );
    // Wrong emoji no id
    const result3 = _getFilter('reaction', { confirm: '✅', cancel: '❌' })(
      {
        emoji: { name: '😂' },
      },
      { id: '123' },
    );
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });
});
