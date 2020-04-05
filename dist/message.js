"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFilter_1 = require("./util/getFilter");
const discord_js_1 = require("discord.js");
/**
 * Prompt for a user response in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to a collection of messages (or false if you set failIfTimeout to true).
 */
exports.message = (channel, options) => {
    if (!channel)
        throw new Error('Missing channel');
    // Defaults
    if (!options.question)
        options.question = 'Yes or no?';
    if (!options.prefix)
        options.prefix = '';
    if (!options.timeout)
        options.timeout = 30000;
    if (!options.failIfTimeout)
        options.failIfTimeout = false;
    if (!options.max)
        options.max = 1;
    // This function will return a promise that will resolve to a collection of message or false if the time ran out
    return new Promise(resolve => {
        channel.send(options.question).then((msg) => {
            const message = msg instanceof Array ? msg[0] : msg;
            channel
                .awaitMessages(getFilter_1._getFilter('message', options), {
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
                if (!(channel instanceof discord_js_1.DMChannel)) {
                    message.delete().then(() => {
                        if (options.failIfTimeout) {
                            resolve(false);
                        }
                        else {
                            resolve(collected);
                        }
                    });
                }
                // just resolve with the result
                // no clear prompt because message.delete()
                // is not allowed in DMChannel
                if (options.failIfTimeout) {
                    resolve(false);
                }
                else {
                    resolve(collected);
                }
            });
        });
    });
};
