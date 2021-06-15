const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    config: {
        name: "cumsluts",
        noalias: [''],
        category: "nsfw",
        description: "Shows random cumsluts image",
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
   if (!message.channel.nsfw) {
        message.react('💢');
        return message.channel.send({embed: {
                color: 16734039,
                description: "You can use this command in an NSFW Channel!"
            }})
    }
    superagent.get('https://nekos.life/api/v2/img/cumsluts')
        .end((err, response) => {
      const embed = new MessageEmbed()
      .setTitle(":smirk: Cumsluts")
      .setImage(response.body.url)
      .setColor(`RANDOM`)
      .setFooter(`Tags: cumsluts`)
      .setURL(response.body.url);
  message.channel.send(embed);
    })
  }
}