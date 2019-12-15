const { RichEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "report",
        noalias: "",
        category: "moderation",
        description: "reports a user of the guild",
        usage: "<user> <reason>",
        accessableby: "Moderator and Administrators",
    },
    run: async (bot, message, args) => {
        message.delete()

        if (!message.member.hasPermission("MANAGE_SERVER", "ADMINISTRATOR") || !message.guild.owner) 
        return message.channel.send("You dont have permission to use this command.");

        let target = message.mentions.members.first() || message.guild.members.get(args[0])
        if (!target) return message.channel.send("Please provide a valid user").then(m => m.delete(15000))

        let reason = args.slice(1).join(" ")
        if (!reason) return message.channel.send(`Please provide a reason for reporting **${target.user.tag}**`).then(m => m.delete(15000))

        if(target.hasPermission("ADMINISTRATOR") || target.user.bot)
        return message.channel.send("Can\'t report that user!").then(m => m.delete(5000))

        let sChannel = message.guild.channels.find(x => x.name === "modlogs")

        const sembed = new RichEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setThumbnail(target.user.displayAvatarURL)
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .addField("Moderation", "report")
            .addField("**User Reported:**", `${target}`)
            .addField("**User ID:**", `${target.user.id}`)
            .addField("**Reported By:**", `${message.member}`)
            .addField("**Reported in:**", `${message.channel}`)
            .addField("**Reason:**", `**${reason}**`);

        sChannel.send(sembed);
    }
}
