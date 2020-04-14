const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "ban",
        aliases: ["b", "banish"],
        category: "moderation",
        description: "Bans the user",
        usage: "[username | <reason> (optional)]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("**You Dont Have The Permissions To Ban Users!**");

        var banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!banMember) return message.channel.send("**User is not in the guild**");

        if (banMember === message.member) return message.channel.send("**You Cannot Ban Yourself**")

        var reason = args.slice(1).join(" ");
        if (!banMember.bannable) return message.channel.send("Cant Kick That User")
        if (!message.guild.me.hasPermission(["ADMINISTRATOR"])) return message.channel.send("I dont have permission to perform this command")

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

        banMember.send(`Hello, you have been banned from ${message.guild.name} for: ${reason || "No Reason"}`).then(() =>
            message.guild.members.ban(banMember, { days: 1, reason: reason })).catch(err => console.log(err))

        var sembed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${banMember.user.username}** has been banned`)
        message.channel.send(sembed)

        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("#ff0000")
            .setThumbnail(banMember.user.displayAvatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Moderation**", "ban")
            .addField("**Banned**", banMember.user.username)
            .addField("**ID**", `${banMember.id}`)
            .addField("**Banned By**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
};