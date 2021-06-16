const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    config: {
        name: "pussy",
        noalias: [''],
        category: "nsfw",
        description: "Shows random pussy image",
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
    superagent.get('https://nekos.life/api/v2/img/pussy')
        .end((err, response) => {
      const embed = new MessageEmbed()
      .setTitle(":smirk: Pussy")
      .setImage(response.body.url)
      .setColor(`RANDOM`)
      .setFooter(`Tags: pussy`)
      .setURL(response.body.url);
  message.channel.send(embed);
    })
  }
}