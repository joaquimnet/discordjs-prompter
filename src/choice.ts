import { _getFilter } from './util/getFilter';
import {
  TextChannel,
  DMChannel,
  GroupDMChannel,
  Emoji,
  ReactionEmoji,
  EmojiIdentifierResolvable,
} from 'discord.js';

/**
 * Prompt for a user reaction in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to the emoji the user reacts to or null if the user times out.
 * @example
 * const Prompter = require('discordjs-prompter');
 * const response = await Prompter.choice({
 *    question: 'Pick an emoji!',
 *    choices: ['✨', '❌'],
 *    userId: message.author.id
 * });
 * console.log(response); // -> ✨ or ❌ or null if user doesn't respond
 */
export const choice = (
  channel: TextChannel | DMChannel | GroupDMChannel,
  options: {
    /** The message to be sent along with the prompt. */
    question: string;
    /** The emojis to serve as choice options. */
    choices: Array<string | ReactionEmoji | Emoji>;
    /** The id of the user you want to prompt, if not defined the prompt will accept an answer from anyone. */
    userId?: string;
    /** The duration of the prompt Default: `30000`. */
    timeout?: number;
    /** Should the message be deleted after the prompt is done? Default: `true`*/
    deleteMessage?: boolean;
    /** Should the prompt wait until all reactions were sent before accepting a response?
     *  Note: this is faster but the reactions wont be sent in order. Default: `false`
     */
    acceptEarly?: boolean;
  },
) => {
  if (!channel) throw new Error('Missing channel');
  if (!options || !options.choices) {
    throw new Error('Choice prompt requires options.choices');
  }
  if (!options.timeout) options.timeout = 30000;
  if (options.deleteMessage === undefined) options.deleteMessage = true;
  if (!options.acceptEarly) options.acceptEarly = false;

  const getResponse = async () => {
    const msg = await channel.send(options.question);
    const message = msg instanceof Array ? msg[0] : msg;

    // React with possible choices
    for (const choice of options.choices) {
      if (options.acceptEarly) {
        await message.react(choice);
      } else {
        message.react(choice);
      }
    }

    // Await the response
    let collected;
    try {
      collected = await message.awaitReactions(_getFilter('choice', options), {
        time: options.timeout,
        max: 1,
        errors: ['time'],
      });
    } catch (e) {
      // If time ran out, delete message and resolve
      if (options.deleteMessage) await message.delete();
      return null;
    }

    if (options.deleteMessage) await message.delete();

    let result: EmojiIdentifierResolvable | null = null;

    for (const reaction of collected) {
      const guildEmoji = message.guild.emojis.get(reaction[0]);
      result = guildEmoji ? guildEmoji : reaction[0];
    }

    return result;
  };

  return new Promise<EmojiIdentifierResolvable | null>((resolve, reject) => {
    getResponse()
      .then(result => resolve(result))
      .catch(reject);
  });
};
