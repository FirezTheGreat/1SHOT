const fetch = require('node-fetch');

module.exports = {
  config: {
    name: "trivia",
    aliases: ['triv'],
    category: 'fun',
    description: 'Asks Questions',
    usage: ' ',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let body = await fetch('https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986')
    let data = await body.json();
    let trivia = data.results[0];
    let time = 30 * 1000;

    let answers = trivia.incorrect_answers;
    answers.push(trivia.correct_answer);
    answers = answers.map(m => { return decodeURIComponent(m); });
    answers.sort(function (a, b) { // sort the answers in abc order to prevent the correct answer from being in the same spot each time
      let answerA = a.toLowerCase();
      let answerB = b.toLowerCase();
      if (answerA < answerB) { return -1; }
      if (answerA > answerB) { return 1; }
      return 0;
    });
    let front = answers.map(m => `${answers.indexOf(m) + 1}) *${m}*`).join('\n');

    await message.channel.send({
      embed: {
        title: `${message.author.username}'s trivia question.`,
        color: "GREEN",
        description: `**${decodeURIComponent(trivia.question)}**\n*Please choose an answer within ${time / 1000}s*\n\n` + front,
        fields: [
          { name: 'Difficulty', value: `\`${decodeURIComponent(trivia.difficulty)}\``, inline: true },
          { name: 'Category', value: `\`${decodeURIComponent(trivia.category)}\``, inline: true }
        ],
        footer: { text: 'You can use the number or the word to answer!' }
      }
    });
    try {
      var choice = await message.channel.awaitMessages(message2 => message2, {
        max: 1,
        time: 30000,
        errors: ['time']
      });
      if (!choice) {
        return await message.channel.send('You did not answer in time, what the heck dude/lady (I do not judge or assume ok)');
      } else if (choice.first().content.includes(decodeURIComponent(trivia.correct_answer).toLowerCase())) {
        return await message.channel.send('**Correct Answer**');
      } else if (Number(choice.first().content) === answers.indexOf(decodeURIComponent(trivia.correct_answer)) + 1) {
        return message.channel.send('**Correct Answer**');
      } else {
        return await message.channel.send(`**The Correct Answer was \`${decodeURIComponent(trivia.correct_answer)}\`**`);
      }
    } catch (e) {
      console.error(e)
      message.channel.send("Timeout!")
    }
  }
};