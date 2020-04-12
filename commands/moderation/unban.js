const { MessageEmbed } = require("discord.js")

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

        if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("**You Dont Have The Permissions To Unban Someone!**")

        if (isNaN(args[0])) return message.channel.send("**You Need To Provide An ID!**")
        let bannedMember = await bot.users.fetch(args[0])
        if (!bannedMember) return message.channel.send("**Please Provide A User ID To Unban Someone!**")

        let reason = args.slice(1).join(" ")

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

        if (!message.guild.me.hasPermission(["ADMINISTRATOR"])) return message.channel.send("**I Don't Have Permissions To Unban Someone!**")
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
            .setThumbnail(bannedMember.displayAvatarURL())
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unban")
            .addField("**Unbanned**", `${bannedMember.username}`)
            .addField("**ID**", `${bannedMember.id}`)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", `${reason}` || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp();

        let sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(embed)

    }
}