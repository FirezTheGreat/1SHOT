const { RichEmbed } = require("discord.js");
const { redlight } = require('../../colours.json')
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

        if (!message.member.hasPermission("MANAGE_GUILD", "ADMINISTRATOR") || !message.guild.owner) 
        return message.channel.send("You dont have permission to use this command.");

        let target = message.mentions.members.first() || message.guild.members.get(args[0])
        if (!target) return message.channel.send("Please provide a valid user").then(m => m.delete(15000))

        let reason = args.slice(1).join(" ")

        if(target.hasPermission("ADMINISTRATOR") || target.user.bot)
        return message.channel.send("Can\'t report that user!").then(m => m.delete(5000))

        const embed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`${message.guild.name}`, message.guild.iconURL)
            .setDescription("Your report has been filed to the staff team. Thank you!")
        message.channel.send(embed)

        let sChannel = message.guild.channels.find(x => x.name === "modlogs")

        const sembed = new RichEmbed()
            .setColor(redlight)
            .setTimestamp()
            .setThumbnail(target.user.displayAvatarURL)
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .addField("Moderation", "report")
            .addField("**User Reported:**", `${target}`)
            .addField("**User ID:**", `${target.user.id}`)
            .addField("**Reported By:**", `${message.member}`)
            .addField("**Reported in:**", `${message.channel}`)
            .addField("**Reason:**", `**${reason || "No Reason"}**`)
            .addField("Date:", message.createdAt.toLocaleString());

        sChannel.send(sembed);
    }
}
