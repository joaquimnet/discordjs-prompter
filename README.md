<h1  align="center">discordjs-prompt 👋</h1>

<p align="center">
<a href="https://npmjs.com/package/discordjs-prompter">
<img  src="https://img.shields.io/npm/v/discordjs-prompter.svg"  />
</a>
<a href="https://github.com/joaquimnet/discordjs-prompter#readme" target="_blank">
<img src="https://img.shields.io/github/package-json/v/joaquimnet/discordjs-prompter/master.svg?color=yellow" alt="Version@Master" />
</a>
<a  href="https://joaquimnet.github.io/discordjs-prompter">
<img  alt="Documentation"  src="https://img.shields.io/badge/documentation-yes-green.svg"  target="_blank"  />
</a>
<a  href="https://github.com/joaquimnet/discordjs-prompter/blob/master/LICENSE">
<img  alt="License: MIT"  src="https://img.shields.io/badge/License-MIT-green.svg"  target="_blank"  />
</a>
</p>

Prompt for a user response using reactions or a message.

## Features
- Message prompt -> Get text
- Reaction prompt -> Accept or cancel
- Vote prompt **(new)** -> Collect votes
- Choice prompt **(new)** -> An emoji reaction

## Examples

Message Prompt:

```javascript
const prompter = require('discordjs-prompter');

client.on('message', msg => {
  // Listen for a message starting with !foo

  if (msg.content.startsWith('!foo')) {
    // Prompts the user if wether they like bacon or not

    prompter
      .message(msg.channel, {
        question: 'Do you like bacon?',
        userId: msg.author.id,
        max: 1,
        timeout: 10000,
      })
      .then(responses => {
        // If no responses, the time ran out
        if (!responses.size) {
          return msg.channel.send(`No time for questions? I see.`);
        }
        // Gets the first message in the collection
        const response = responses.first();

        // Respond
        msg.channel.send(`**${response}** Is that so?`);
      });
  }
});
```

![alt text](https://i.imgur.com/nNfBXYi.gif "Answering to the bot's question.")

* * *

Reaction Prompt:

```javascript
const prompter = require('discordjs-prompter');

client.on('message', msg => {
  // Listen for a message starting with !bar
  if (msg.content.startsWith('!bar')) {
    // Asks if user is sure
    prompter
      .reaction(msg.channel, {
        question: 'Are you sure?',
        userId: msg.author.id,
      })
      .then(response => {
        // Response is false if time runs out
        if (!response) return msg.reply('you took too long!');
        // Returns 'yes' if user confirms and 'no' if ser cancels.
        if (response === 'yes') return msg.channel.send('You chose yes!');
        if (response === 'no') return msg.channel.send('You chose no!');
      });
  }
});
```

![alt text](https://i.imgur.com/Uhko2lY.gif "Reacting to the bot's message")

* * *

Vote prompt:

```javascript
  // ...other discordjs logic
  Prompter.vote(message.channel, {
    question: 'Cast your vote!',
    choices: ['🔥', '💙'],
    timeout: 3000,
  }).then((response) => {
    const winner = response.emojis[0];
    message.channel.send(winner.emoji + ' won!!');
  });
  // other discordjs logic...
```

![alt text](https://i.imgur.com/jdNkRhi.gif "Voting on the message")

* * *

Choice prompt:

```javascript
  // ...other discordjs logic
  const response = await Prompter.choice(message.channel, {
    question: 'Pick an emoji!',
    choices: ['✨', '❌'],
    userId: message.author.id
  });
  console.log(response); // -> ✨ or ❌ or null if user doesn't respond
  // other discordjs logic...
```

* * *

## Documentation

[Go to documentation](https://joaquimnet.github.io/discordjs-prompter)