const { MessageEmbed } = require('discord.js');
const roasts = require('../../JSON/roast.json');

module.exports = {
    config: {
        name: "roast",
        category: "fun",
        noalias: [''],
        description: "Roasts people",
        usage: "[ mention | id ]",
        accesableby: "everyone"
    },
    run: async (bot, message, args) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        let roast = roasts.roast[Math.floor((Math.random() * roasts.roast.length))];

        if(!args[0]) {
            const sembed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor("GREEN")
                .setDescription("**Do You Really Want To Roast Yourself?**")
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp()
            message.channel.send(sembed);
        }
        else if (args[0]) {
            const embed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor("GREEN")
                .setDescription(`${roast} - ${message.author}`)
                .setFooter(member.displayName, member.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send(embed);
        }
    }
}