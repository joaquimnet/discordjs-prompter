import { _getFilter } from './util/getFilter';
import {
  TextChannel,
  DMChannel,
  Message,
  Emoji,
  ReactionEmoji,
  MessageReaction,
} from 'discord.js';

/**
 * Prompt for a user reaction in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to 'yes' if the user confirms,
 * to 'no' if the user cancels or false if the user times out.
 */
export const reaction = (
  channel: TextChannel | DMChannel,
  options: {
    /** The question to ask the user. Default: `Yes or No?` */
    question: string;
    /** The emoji for the confirm option. Default: `✅`*/
    confirm?: string | ReactionEmoji | Emoji;
    /** The emoji for the cancel option. Default: `❌` */
    cancel?: string | ReactionEmoji | Emoji;
    /** The id of the user you want to prompt, if not defined the prompt will accept an answer from anyone. */
    userId?: string;
    /** How long to wait for a response in ms. Default: 30000 */
    timeout?: number;
  } = {
    question: 'Yes or no?',
    confirm: '✅',
    cancel: '❌',
    timeout: 30000,
  },
) => {
  if (!channel) throw new Error('Missing channel');

  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.timeout) options.timeout = 30000;
  const confirm = options.confirm ? options.confirm : '✅';
  const cancel = options.cancel ? options.cancel : '❌';
  options.confirm = confirm;
  options.cancel = cancel;

  return new Promise<MessageReaction | false>(resolve => {
    // Send confirm question
    channel.send(options.question).then((msg: Message | Message[]) => {
      const message = msg instanceof Array ? msg[0] : msg;
      // Send initial reactions
      message
        .react(confirm)
        .then(() => {
          message.react(cancel);
        })
        // Catch if user responded before second reaction is dispatched
        .catch();

      // Await response
      message
        .awaitReactions(_getFilter('reaction', options), {
          max: 1,
          time: options.timeout,
          errors: ['time'],
        })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === confirm) {
            // If confirmed, delete message and resolve
            if (channel instanceof DMChannel) {
              resolve(reaction);
            } else {
              message.delete().then(() => resolve(reaction));
              return;
            }
          } else {
            // If cancelled, delete message and resolve
            if (channel instanceof DMChannel) {
              resolve(reaction);
              return;
            }
            message.delete().then(() => resolve(reaction));
          }
        })
        .catch(() => {
          // If time ran out, delete message and resolve
          if (channel instanceof DMChannel) {
            resolve(false);
            return;
          }
          message.delete().then(() => resolve(false));
        });
    });
  });
};
