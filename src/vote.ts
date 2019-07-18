import { getFilter } from './util/getFilter';
import { ReactionEmoji, Emoji, TextChannel, GroupDMChannel, DMChannel } from 'discord.js';

export const vote = (
  channel: TextChannel|GroupDMChannel|DMChannel,
  options: {
    question: string;
    choices: Array<string | ReactionEmoji | Emoji>;
    max?: number;
    timeout?: number;
    deleteMessage?: boolean;
  } = {
    question: 'Cast your vote!',
    choices: ['❤', '💛', '💙', '💚', '💜', '🖤'],
    max: 50,
    timeout: 30000,
    deleteMessage: false,
  },
) => {
  if (!channel) throw new Error('Missing channel');
  if (options && !options.choices) throw new Error('Vote prompt requires options.choices');
  if (!options.timeout) options.timeout = 30000;

  // Function to get the votes
  const getVotes = async () => {
    const msg = await channel.send(options.question);
    const message = msg instanceof Array ? msg[0] : msg;

    // React with possible choices
    for (const choice of options.choices) {
      message.react(choice);
    }

    // Options for the collector
    const opt = {
      time: options.timeout,
    };

    // Await for the reactions
    const collected = await message.awaitReactions(
      getFilter('vote', options),
      opt,
    );

    // Delete message after collecting
    if (options.deleteMessage) {
      await message.delete();
    }

    const result: {
      emojis: Array<{
        emoji: string | ReactionEmoji | Emoji;
        count: number;
      }>;
      total: number;
    } = { emojis: [], total: 0 };

    for (const reaction of collected) {
      const guildEmoji = message.guild.emojis.get(reaction[0]);
      let foundEmoji;
      if (guildEmoji) {
        foundEmoji = { emoji: guildEmoji, count: reaction[1].count - 1 };
      } else {
        foundEmoji = {
          emoji: reaction[0],
          count: reaction[1].count - 1,
        };
      }
      result.emojis.push(foundEmoji);
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

  // Returned promise of vote()
  return new Promise<{
    emojis: Array<{
      emoji: string | ReactionEmoji | Emoji;
      count: number;
    }>;
    total: number;
  }>((resolve, reject) => {
    // Send confirm question
    getVotes()
      .then(res => resolve(res))
      .catch(e => reject(e));
  });
};
