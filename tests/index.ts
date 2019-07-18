const Prompter = require('../dist/index.js');

describe('Prompter >>', () => {
  test('message() should be defined and be a function', () => {
    expect(Prompter.message).toBeDefined();
    expect(typeof Prompter.message).toBe('function');
  });

  test('reaction() should be defined and be a function', () => {
    expect(Prompter.reaction).toBeDefined();
    expect(typeof Prompter.reaction).toBe('function');
  });

  test('vote() should be defined and be a function', () => {
    expect(Prompter.vote).toBeDefined();
    expect(typeof Prompter.vote).toBe('function');
  });
});
