const { MessageEmbed } = require("discord.js");
const { redlight } = require('../../JSON/colours.json')
const db = require('quick.db');

module.exports = {
    config: {
        name: "report",
        noalias: "No Aliases",
        category: "moderation",
        description: "reports a user of the guild",
        usage: "[ user | <reason> (optional) ]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send("**You Dont Have The Permissions To Report Someone!**");

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send("**Enter A User!**").then(m => m.delete({ timeout: 15000 }))
        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;
        let reason = args.slice(1).join(" ")
        if (target.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Report This User!**')

        if (target.hasPermission("ADMINISTRATOR") || target.user.bot)
            return message.channel.send("Can\'t report that user!")

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${message.guild.name}`, message.guild.iconURL())
            .setDescription("Your report has been filed to the staff team. Thank you!")
        message.channel.send(embed)

        const sembed = new MessageEmbed()
            .setColor(redlight)
            .setTimestamp()
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "report")
            .addField("**User Reported**", `${target}`)
            .addField("**User ID**", `${target.user.id}`)
            .addField("**Reported By**", `${message.member}`)
            .addField("**Reported in**", `${message.channel}`)
            .addField("**Reason**", `**${reason || "No Reason"}**`)
            .addField("**Date**", message.createdAt.toLocaleString());

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(sembed)
    }
}
