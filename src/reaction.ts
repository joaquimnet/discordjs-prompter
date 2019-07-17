const getFilter = require('./util/getFilter');

module.exports = (
  channel,
  options = {
    question: 'Yes or no?',
    userId: 'some_id',
    confirm: '✅',
    cancel: '❌',
    timeout: 30000,
  }
) => {
  if (!channel) throw new Error('Missing channel');

  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.confirm) options.confirm = '✅';
  if (!options.cancel) options.cancel = '❌';
  if (!options.timeout) options.timeout = 30000;

  return new Promise((resolve, reject) => {
    // Send confirm question
    channel.send(options.question).then(msg => {
      // Send initial reactions
      msg
        .react(options.confirm)
        .then(() => msg.react(options.cancel))
        // Catch if user responded before second reaction is dispatched
        .catch();

      // Await response
      msg
        .awaitReactions(getFilter('reaction', options), {
          max: 1,
          time: options.timeout,
          errors: ['time'],
        })
        .then(collected => {
          const reaction = collected.first();

          if (reaction.emoji.name === options.confirm) {
            // If confirmed, delete message and resolve
            msg.delete().then(() => resolve('yes'));
          } else {
            // If cancelled, delete message and resolve
            msg.delete().then(() => resolve('no'));
          }
        })
        .catch(() => {
          // If time ran out, delete message and resolve
          msg.delete().then(() => resolve(false));
        });
    });
  });
};
