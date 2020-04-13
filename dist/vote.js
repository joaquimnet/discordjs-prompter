"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFilter_1 = require("./util/getFilter");
const discord_js_1 = require("discord.js");
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
exports.vote = (channel, options) => {
    if (!channel)
        throw new Error('Missing channel');
    if (!options || !options.choices) {
        throw new Error('Vote prompt requires options.choices');
    }
    if (!options.timeout)
        options.timeout = 30000;
    if (options.deleteMessage === undefined)
        options.deleteMessage = false;
    // Function to get the votes
    const getVotes = () => __awaiter(void 0, void 0, void 0, function* () {
        const msg = yield channel.send(options.question);
        const message = msg instanceof Array ? msg[0] : msg;
        // React with possible choices
        for (const choice of options.choices) {
            yield message.react(choice);
        }
        // Options for the collector
        const opt = {
            time: options.timeout,
        };
        // Await for the reactions
        const collected = yield message.awaitReactions(getFilter_1._getFilter('vote', options), opt);
        // Delete message after collecting
        if (options.deleteMessage && !(channel instanceof discord_js_1.DMChannel)) {
            yield message.delete();
        }
        const result = { emojis: [], total: 0 };
        for (const reaction of collected) {
            const guildEmoji = message.guild.emojis.cache.get(reaction[0]);
            let foundEmoji;
            if (guildEmoji) {
                foundEmoji = { emoji: guildEmoji, count: reaction[1].count - 1 };
            }
            else {
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
    });
    return new Promise((resolve, reject) => {
        // Send confirm question
        getVotes()
            .then(emojis => resolve(emojis))
            .catch(e => reject(e));
    });
};
