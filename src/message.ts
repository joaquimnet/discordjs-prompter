import { _getFilter } from './util/getFilter';
import {
  TextChannel,
  Collection,
  Snowflake,
  Message,
  DMChannel,
} from 'discord.js';

/**
 * Prompt for a user response in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to a collection of messages (or false if you set failIfTimeout to true).
 */
export const message = (
  channel: TextChannel | DMChannel,
  options: {
    /** The question to be asked. */
    question: string;
    /** If this is set, the prompt will only accept messages starting with this prefix. */
    prefix?: string;
    /** The id of the user you want to prompt, if not defined the prompt will accept an answer from anyone. */
    userId?: string;
    /** How long to wait for a response in ms. Default: 30000 */
    timeout?: number;
    /**
     * By default, the promise will resolve with a list of messages regardless
     * of reaching or not the max criteria.
     * If this is set to true, the promise will resolve to `false`. */
    failIfTimeout?: boolean;
    /**
     * How many messages to wait for.
     * Default: 1
     */
    max?: number;
  },
) => {
  if (!channel) throw new Error('Missing channel');
  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.prefix) options.prefix = '';
  if (!options.timeout) options.timeout = 30000;
  if (!options.failIfTimeout) options.failIfTimeout = false;
  if (!options.max) options.max = 1;

  // This function will return a promise that will resolve to a collection of message or false if the time ran out
  return new Promise<Collection<Snowflake, Message> | false>(resolve => {
    channel.send(options.question).then((msg: Message | Message[]) => {
      const message = msg instanceof Array ? msg[0] : msg;
      channel
        .awaitMessages(_getFilter('message', options), {
          max: options.max,
          time: options.timeout,
          errors: ['time'],
        })
        .then(collected => {
          // Clear the prompt and resolve with the result
          message.delete().then(() => resolve(collected));
        })
        .catch(collected => {
          // Clear the prompt and resolve with the result
          if(!channel instanceof DMChannel) {
            message.delete().then(() => {
              if (options.failIfTimeout) {
                resolve(false);
              } else {
                resolve(collected);
              }
            });
          }

          // just resolve with the result
          // no clear prompt because message.delete()
          // is not allowed in DMChannel
          if (options.failIfTimeout) {
            resolve(false);
          } else {
            resolve(collected);
          }
        });
    });
  });
};
