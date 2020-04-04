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

        if (!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("You dont have permission to perform this command!")

        if (isNaN(args[0])) return message.channel.send("You need to provide an ID.")
        let bannedMember = await bot.users.fetch(args[0])
        if (!bannedMember) return message.channel.send("Please provide a user id to unban someone!")

        let reason = args.slice(1).join(" ")

        if (!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permission to perform this command!")
        try {
            message.guild.members.unban(bannedMember, reason)
            var sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${bannedMember.tag} has been unbanned`)
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