module.exports.message = (
  channel,
  options = {
    question: 'Yes or no?',
    prefix: '',
    userId: 'some_id',
    timeout: 60000,
    failIfTimeout: false,
    max: 1,
  }
) => {
  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.timeout) options.timeout = 60000;
  if (!options.max) options.max = 1;

  // Filter out messages with the wrong prefix/author
  const filter = m => {
    const rightPrefix = !options.prefix || m.content.startsWith(options.prefix);
    const rightAuthor = !options.userId || m.author.id === options.userId;
    return rightPrefix && rightAuthor;
  };

  // This function will return a promise that will resolve to a collection of message or false if the time ran out
  return new Promise((resolve, reject) => {
    channel.send(options.question).then(msg => {
      channel
        .awaitMessages(filter, {
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
          msg.delete()
          .then(() => {
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

module.exports.reaction = (
  channel,
  options = {
    question: 'Yes or no?',
    userId: 'some_id',
    confirm: '✅',
    cancel: '❌',
    timeout: 60000,
  }
) => {
  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.confirm) options.confirm = '✅';
  if (!options.cancel) options.cancel = '❌';
  if (!options.timeout) options.timeout = 60000;

  // Filter for the reactions collector
  const filter = (reaction, user) => {
    const correctEmoji = [options.confirm, options.cancel].includes(reaction.emoji.name);
    const correctUser = !options.userId || user.id === options.userId;
    return correctEmoji && correctUser;
  };

  return new Promise((resolve, reject) => {
    // Send confirm question
    channel.send(options.question).then(msg => {
      // Send initial reactions
      msg.react(options.confirm).then(() => msg.react(options.cancel))
      // Catch if user responded before second reaction is dispatched
      .catch();

      // Await response
      msg
        .awaitReactions(filter, {
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
