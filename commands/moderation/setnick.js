const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "setnick",
        aliases: ["sn"],
        category: "moderation",
        description: "Sets Or Changes Nickname Of An User",
        usage: "[mention | ID] <nickname>",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        let perms = "ADMINISTRATOR" || "MANAGE_GUILD" || "MANAGE_MESSAGES" || "MANAGE_ROLES"
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Dont Have Permissions To Change Nickname!**");

        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("**I Dont Have Permissions To Change Nickname!**");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!member) return message.channel.send("**Please Enter A Username!**");

        if (member.hasPermission(perms)) return message.channel.send("**Cannot Change Nickname Of That User!**")

        if (!args[1]) return message.channel.send("**Please Enter A Nickname**");

        let nick = args.slice(1).join(' ');

        member.setNickname(nick)
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**Changed Nickname of ${member.displayName} to ${nick}**`)
            .setAuthor(message.guild.name, message.guild.iconURL())
        message.channel.send(embed)

        let createChannel = message.guild.channels.cache.find(r => r.name === "modlogs")
        if (!createChannel) {
            createChannel = await message.guild.channels.create('modlogs', {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            })
        }

        const sembed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("#ff0000")
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Moderation**", "setnick")
            .addField("**Nick Changed Of**", member.user.username)
            .addField("**Nick Changed By**", message.author.username)
            .addField("**Nick Changed To**", args[1])
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(sembed)

    }
}