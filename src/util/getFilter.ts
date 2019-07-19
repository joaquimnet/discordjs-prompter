import Discord from 'discord.js';

/**
 * @returns A filter to be used in the discordjs's awaitMessage method
 */
export const _getFilter = (
  filterType: string,
  options: {
    confirm?: string | Discord.ReactionEmoji | Discord.Emoji;
    cancel?: string | Discord.ReactionEmoji | Discord.Emoji;
    userId?: string;
    prefix?: string;
    choices?: Array<string | Discord.ReactionEmoji | Discord.Emoji>;
  },
) => {
  if (!filterType) throw new Error('Missing filter type');
  if (!options) throw new Error('Missing filter options');

  if (filterType === 'message') {
    return function filter(m: Discord.Message) {
      const { prefix, userId } = options;
      // If prefix/userId is defined compare the prefix/id
      const rightPrefix = !prefix || m.content.startsWith(prefix);
      const rightAuthor = !userId || m.author.id === userId;
      return rightPrefix && rightAuthor;
    };
  }

  if (filterType === 'reaction') {
    if (!options.confirm || !options.cancel) throw new Error('Missing emoji');
    return function filter(
      reaction: Discord.MessageReaction,
      user: Discord.User,
    ) {
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
      return function filter(reaction: Discord.MessageReaction) {
        return (
          choices.includes(reaction.emoji.name) ||
          choices.includes(reaction.emoji)
        );
      };
    } else {
      throw new Error('Vote filter requires options.choices');
    }
  }
  throw new Error('Unknown filter');
};
