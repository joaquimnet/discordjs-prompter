const getFilter = (type, options) => {
  if (!type) throw new Error('Missing filter type');
  if (!options) throw new Error('Missing filter options');
  if (type === 'message') {
    return m => {
      const { prefix, userId } = options;
      // If prefix/userId is defined compare the prefix/id
      const rightPrefix = !prefix || m.content.startsWith(prefix);
      const rightAuthor = !userId || m.author.id === userId;
      return rightPrefix && rightAuthor;
    };
  }
  if (type === 'reaction') {
    if (!options.confirm || !options.cancel) throw new Error('Missing emoji');
    return (reaction, user) => {
      const { confirm, cancel, userId } = options;
      // check if reaction if either confirm or cancel
      const correctEmoji = [confirm, cancel].includes(reaction.emoji.name);
      // If options.userId is defined campare the ids
      const correctUser = !userId || user.id === userId;
      return correctEmoji && correctUser;
    };
  }
  throw new Error('Unknown filter');
};

module.exports = getFilter;