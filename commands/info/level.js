const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    config: {
        name: "level",
        aliases: ["xp"],
        category: "info",
        description: "Shows Your Experience Level",
        usage: "[mention | id](optional)",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let messagefetch = db.fetch(`messages_${message.guild.id}_${member.id}`)
        let levelfetch = db.fetch(`level_${message.guild.id}_${member.id}`)

        if (messagefetch == null) messagefetch = '0';
        if (levelfetch == null) levelfetch = '0';

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${member}, You Are Level: \`${levelfetch}\` & Have Sent: \`${messagefetch}\` Messages`)

        message.channel.send(embed)

    }
}