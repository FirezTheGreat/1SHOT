const { MessageEmbed } = require("discord.js")
const db = require('quick.db');

module.exports = {
    config: {
        name: "unban",
        description: "Unban a user from the guild!",
        usage: "[ ID ]",
        category: "moderation",
        accessableby: "Administrator",
        aliases: ["ub", "unbanish"],
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("**You Dont Have The Permissions To Unban Someone!**")

        if (isNaN(args[0])) return message.channel.send("**You Need To Provide An ID!**")
        let bannedMember = await bot.users.fetch(args[0])
        if (!bannedMember) return message.channel.send("**Please Provide A User ID To Unban Someone!**")
        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;
        let reason = args.slice(1).join(" ")

        if (!message.guild.me.hasPermission("ADMINISTRATOR") || !message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("**I Don't Have Permissions To Unban Someone!**")
        try {
            message.guild.members.unban(bannedMember, reason)
            var sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${bannedMember.tag} has been unbanned**`)
            message.channel.send(sembed)
        } catch (e) {
            console.log(e.message)
        }

        let embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(bannedMember.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unban")
            .addField("**Unbanned**", `${bannedMember.username}`)
            .addField("**ID**", `${bannedMember.id}`)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", `${reason}` || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    }
}