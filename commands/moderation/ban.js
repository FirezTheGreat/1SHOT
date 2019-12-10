const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "ban",
        aliases: ["b", "banish", "remove"],
        category: "moderation",
        description: "Bans the user",
        usage: ", b [username | <reason> (optional)]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permissions to perform this task!");


        var banMember = message.mentions.members.first() || bot.users.get(args[0])
        if (!banMember) return message.channel.send("Please provide a user to ban!");

        var reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason given!"

        if (!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I dont have permission to perform this command")


        banMember.send(`Hello, you have been banned from ${message.guild.name} for ${reason}`).then(() =>
            message.guild.ban(banMember, { days: 1, reason: reason })).catch(err => console.log(err))

        var sembed = new RichEmbed()
            .setColor("GREEN")
            .setDescription(`**${banMember.user.username}** has been banned`)
        message.channel.send(sembed)

        const embed = new RichEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .setColor("#ff0000")
            .setThumbnail(banMember.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .addField("Moderation:", "ban")
            .addField("Banned:", banMember.user.username)
            .addField("Banned By:", message.author.username)
            .addField("Reason:", reason)
            .addField("Date:", message.createdAt.toLocaleString());

        var sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
};