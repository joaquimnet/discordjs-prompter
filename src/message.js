const getFilter = require('./util/getFilter');

module.exports = (
  channel,
  options = {
    question: 'Yes or no?',
    prefix: '',
    userId: 'some_id',
    timeout: 30000,
    failIfTimeout: false,
    max: 1,
  }
) => {
  if (!channel) throw new Error('Missing channel');

  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.timeout) options.timeout = 30000;
  if (!options.failIfTimeout) options.failIfTimeout = false;
  if (!options.max) options.max = 1;

  // This function will return a promise that will resolve to a collection of message or false if the time ran out
  return new Promise((resolve, reject) => {
    channel.send(options.question).then(msg => {
      channel
        .awaitMessages(getFilter('message', options), {
          max: options.max,
          time: options.timeout,
          errors: ['time'],
        })
        .then(collected => {
          // Clear the prompt and resolve with the result
          msg.delete().then(() => resolve(collected));
        })
        .catch(collected => {
          // Clear the prompt and resolve with the result
          msg.delete().then(() => {
            if (options.failIfTimeout) {
              resolve(false);
            } else {
              resolve(collected);
            }
          });
        });
    });
  });
};
