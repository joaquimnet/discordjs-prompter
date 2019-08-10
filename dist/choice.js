"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFilter_1 = require("./util/getFilter");
/**
 * Prompt for a user reaction in a certain channel.
 *
 * @param channel The channel to send the prompt to.
 * @param options The configuration for the prompt.
 * @returns A promise that resolves to the emoji the user reacts to or null if the user times out.
 */
exports.choice = (channel, options) => {
    if (!channel)
        throw new Error('Missing channel');
    if (!options || !options.choices) {
        throw new Error('Choice prompt requires options.choices');
    }
    if (!options.timeout)
        options.timeout = 30000;
    if (options.deleteMessage === undefined)
        options.deleteMessage = true;
    const getResponse = () => __awaiter(this, void 0, void 0, function* () {
        const msg = yield channel.send(options.question);
        const message = msg instanceof Array ? msg[0] : msg;
        // React with possible choices
        for (const choice of options.choices) {
            yield message.react(choice);
        }
        // Await the response
        let collected;
        try {
            collected = yield message.awaitReactions(getFilter_1._getFilter('vote', options), {
                time: options.timeout,
                max: 1,
                errors: ['time'],
            });
        }
        catch (e) {
            // If time ran out, delete message and resolve
            if (options.deleteMessage)
                yield message.delete();
            return null;
        }
        if (options.deleteMessage)
            yield message.delete();
        let result = null;
        for (const reaction of collected) {
            const guildEmoji = message.guild.emojis.get(reaction[0]);
            result = guildEmoji ? guildEmoji : reaction[0];
        }
        return result;
    });
    return new Promise((resolve, reject) => {
        getResponse()
            .then(result => resolve(result))
            .catch(reject);
    });
};
