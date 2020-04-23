const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    config: {
        name: "kick",
        category: "moderation",
        description: "Kicks the user",
        accessableby: "Administrator",
        usage: "[id | mention]",
        aliases: ["k"],
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**You do not have permissions to kick members!**");

        var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!kickMember) return message.channel.send("**ID mentioned is not in guild**");
        if (!kickMember.kickable) return message.channel.send("**Cannot Kick This User!**")
        if (kickMember.user.bot) return message.channel.send("**Cannot Kick Bot!**")
        var reason = args.slice(1).join(" ") || "No Reason!";

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send("**I do not have permissions to kick members!**");

        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;

        const sembed2 = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Hello, you have been kicked from ${message.guild.name} for: ${reason || "No Reason!"}`)
            .setFooter(message.guild.name, message.guild.iconURL())
        kickMember.send(sembed2).then(() =>
            kickMember.kick()).catch(() => null)
       
        var sembed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**${kickMember.user.username}** has been kicked`)
        message.channel.send(sembed);

        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("#ff0000")
            .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Moderation**", "kick")
            .addField("**User Kicked**", kickMember.user.username)
            .addField("**Kicked By**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
        
    }
}