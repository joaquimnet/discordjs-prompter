"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @returns A filter to be used in the discordjs's awaitMessage method
 */
exports._getFilter = (filterType, options) => {
    if (!filterType)
        throw new Error('Missing filter type');
    if (!options)
        throw new Error('Missing filter options');
    if (filterType === 'message') {
        return function filter(m) {
            const { prefix, userId } = options;
            // If prefix/userId is defined compare the prefix/id
            const rightPrefix = !prefix || m.content.startsWith(prefix);
            const rightAuthor = !userId || m.author.id === userId;
            return rightPrefix && rightAuthor;
        };
    }
    if (filterType === 'reaction') {
        if (!options.confirm || !options.cancel)
            throw new Error('Missing emoji');
        return function filter(reaction, user) {
            const { confirm, cancel, userId } = options;
            // check if reaction if either confirm or cancel
            const correctEmoji = [confirm, cancel].includes(reaction.emoji.name);
            // If options.userId is defined campare the ids
            const correctUser = (!userId || user.id === userId) && !user.bot;
            return correctEmoji && correctUser;
        };
    }
    if (filterType === 'vote') {
        if (options.choices) {
            const choices = options.choices;
            return function filter(reaction) {
                return (choices.includes(reaction.emoji.name) ||
                    choices.includes(reaction.emoji));
            };
        }
        else {
            throw new Error('Choice filter requires options.choices');
        }
    }
    if (filterType === 'choice') {
        if (options.choices) {
            const { choices, userId } = options;
            return function filter(reaction, user) {
                const correctUser = (!userId || user.id === userId) && !user.bot;
                return (correctUser &&
                    (choices.includes(reaction.emoji.name) ||
                        choices.includes(reaction.emoji)));
            };
        }
        else {
            throw new Error('Vote filter requires options.choices');
        }
    }
    throw new Error('Unknown filter');
};
