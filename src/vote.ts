import { _getFilter } from './util/getFilter';
import {
  ReactionEmoji,
  Emoji,
  TextChannel,
  GroupDMChannel,
  DMChannel,
} from 'discord.js';

/**
 * Prompt for a user response in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns This promise resolves to the following object:
 *  ```javascript
 *    {emojis: [{emoji: 'An emoji from choices[]', count: 0}, ...otherEmojisFromChoices]}
 *  ```
 */
export const vote = (
  channel: TextChannel | GroupDMChannel | DMChannel,
  options: {
    /** The message to be sent along with the vote. */
    question: string;
    /** The emojis to serve as voting options. */
    choices: Array<string | ReactionEmoji | Emoji>;
    /** The duration of the vote Default: `30000`. */
    timeout?: number;
    /** Should the vote message be deleted after the vote is done? Default: `false`*/
    deleteMessage?: boolean;
  },
) => {
  if (!channel) throw new Error('Missing channel');
  if (!options.choices) throw new Error('Vote prompt requires options.choices');
  if (!options.timeout) options.timeout = 30000;
  if (options.deleteMessage === undefined) options.deleteMessage = false;

  // Function to get the votes
  const getVotes = async () => {
    const msg = await channel.send(options.question);
    const message = msg instanceof Array ? msg[0] : msg;

    // React with possible choices
    for (const choice of options.choices) {
      await message.react(choice);
    }

    // Options for the collector
    const opt = {
      time: options.timeout,
    };

    // Await for the reactions
    const collected = await message.awaitReactions(
      _getFilter('vote', options),
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

  return new Promise<{
    emojis: Array<{
      emoji: string | ReactionEmoji | Emoji;
      count: number;
    }>;
    total: number;
  }>((resolve, reject) => {
    // Send confirm question
    getVotes()
      .then(emojis => resolve(emojis))
      .catch(e => reject(e));
  });
};
