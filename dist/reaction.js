"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFilter_1 = require("./util/getFilter");
const discord_js_1 = require("discord.js");
/**
 * Prompt for a user reaction in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to 'yes' if the user confirms,
 * to 'no' if the user cancels or false if the user times out.
 */
exports.reaction = (channel, options = {
    question: 'Yes or no?',
    confirm: '✅',
    cancel: '❌',
    timeout: 30000,
}) => {
    if (!channel)
        throw new Error('Missing channel');
    // Defaults
    if (!options.question)
        options.question = 'Yes or no?';
    if (!options.timeout)
        options.timeout = 30000;
    const confirm = options.confirm ? options.confirm : '✅';
    const cancel = options.cancel ? options.cancel : '❌';
    options.confirm = confirm;
    options.cancel = cancel;
    return new Promise(resolve => {
        // Send confirm question
        channel.send(options.question).then((msg) => {
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
                .awaitReactions(getFilter_1._getFilter('reaction', options), {
                max: 1,
                time: options.timeout,
                errors: ['time'],
            })
                .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === confirm) {
                    // If confirmed, delete message and resolve
                    if (channel instanceof discord_js_1.DMChannel) {
                        resolve('yes');
                    }
                    else {
                        message.delete().then(() => resolve('yes'));
                        return;
                    }
                }
                else {
                    // If cancelled, delete message and resolve
                    if (channel instanceof discord_js_1.DMChannel) {
                        resolve('no');
                        return;
                    }
                    message.delete().then(() => resolve('no'));
                }
            })
                .catch(() => {
                // If time ran out, delete message and resolve
                if (channel instanceof discord_js_1.DMChannel) {
                    resolve(false);
                    return;
                }
                message.delete().then(() => resolve(false));
            });
        });
    });
};
