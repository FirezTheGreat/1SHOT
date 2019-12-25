const { RichEmbed } = require("discord.js");

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

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("❌ You do not have permissions to kick members!");

        var kickMember = message.mentions.members.first() || bot.users.get(args[0]);
        if (!kickMember) return message.reply("Please provide a name to kick");

        var reason = args.slice(1).join(" ");

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("❌ I do not have permissions to kick members!");
      
        var sembed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`**${kickMember.user.username}** has been kicked`)
        message.channel.send(sembed);

        const embed = new RichEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .setColor("#ff0000")
            .setThumbnail(kickMember.user.displayAvatarURL)
            .setFooter(message.guild.name, message.guild.iconURL)
            .addField("Moderation:", "kick")
            .addField("User Kicked:", kickMember.user.username)
            .addField("Kicked By:", message.author.username)
            .addField("**Reason:**", reason || "**No Reason**")
            .addField("Date:", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)

    }
}