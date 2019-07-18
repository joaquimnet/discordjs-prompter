import { getFilter } from './util/getFilter';
import { TextChannel, Collection, Snowflake, Message, DMChannel, GroupDMChannel } from 'discord.js';

export const message = (
  channel: TextChannel | DMChannel | GroupDMChannel,
  options: {
    question: string;
    prefix?: string;
    userId?: string;
    timeout?: number;
    failIfTimeout?: boolean;
    max?: number;
  }
) => {
  if (!channel) throw new Error('Missing channel');
  // Defaults
  if (!options.question) options.question = 'Yes or no?';
  if (!options.prefix) options.prefix = '';
  if (!options.timeout) options.timeout = 30000;
  if (!options.failIfTimeout) options.failIfTimeout = false;
  if (!options.max) options.max = 1;

  console.log('MESSAGE OPTIONS:', options);

  // This function will return a promise that will resolve to a collection of message or false if the time ran out
  return new Promise<Collection<Snowflake, Message> | false>(resolve => {
    channel.send(options.question).then((msg: Message | Message[]) => {
      const message = msg instanceof Array ? msg[0] : msg;
      channel
        .awaitMessages(getFilter('message', options), {
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
          message.delete().then(() => {
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
