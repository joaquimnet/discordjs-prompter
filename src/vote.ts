const getFilter = require('./util/getFilter');

module.exports = (
  channel,
  options = {
    question: 'Cast your vote!',
    choices: ['❤', '🧡', '💛', '💙', '💚', '💜', '🖤'],
    max: 50,
    timeout: 30000,
    deleteMessage: false,
  }
) => {
  if (!channel) throw new Error('Missing channel');
  const getVotes = async () => {
    const msg = await channel.send(options.question);

    // React with possible choices
    for (const choice of options.choices) {
      msg.react(choice);
    }

    // Options for the collector
    const opt = {
      time: options.timeout,
    };

    // Await for the reactions
    const collected = await msg.awaitReactions(getFilter('vote', options), opt);

    // Delete message after collecting
    if (options.deleteMessage) {
      await msg.delete();
    }

    const result = { emojis: [], total: 0 };

    for (const reaction of collected) {
      const guildEmoji = msg.guild.emojis.get(reaction[0]);
      if (guildEmoji) {
        result.emojis.push({ emoji: guildEmoji, count: reaction[1].count - 1 });
      } else {
        result.emojis.push({ emoji: reaction[0], count: reaction[1].count - 1 });
      }
      result.total += reaction[1].count - 1;
    }

    options.choices.forEach(emoji => {
      if (!result.emojis.find(i => i.emoji === emoji)) {
        result.emojis.push({ emoji: emoji, count: 0 });
      }
    });

    result.emojis.sort((a, b) => b.count - a.count);

    return result;
  };

  return new Promise((resolve, reject) => {
    // Send confirm question
    getVotes()
      .then(res => resolve(res))
      .catch(e => reject(e));
  });
};
