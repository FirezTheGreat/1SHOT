const { MessageEmbed } = require("discord.js");
const { redlight } = require('../../JSON/colours.json')
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

        if (!message.member.hasPermission("ADMINISTRATOR") || !message.guild.owner)
            return message.channel.send("**You Dont Have The Permissions To Report Someone!**");

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send("Please provide a valid user").then(m => m.delete({ timeout: 15000 }))

        let reason = args.slice(1).join(" ")

        if (target.hasPermission("ADMINISTRATOR") || target.user.bot)
            return message.channel.send("Can\'t report that user!").then(m => m.delete({ timeout: 5000 }))

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${message.guild.name}`, message.guild.iconURL())
            .setDescription("Your report has been filed to the staff team. Thank you!")
        message.channel.send(embed)

        let sChannel = message.guild.channels.cache.find(x => x.name === "modlogs")
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
        const sembed = new MessageEmbed()
            .setColor(redlight)
            .setTimestamp()
            .setThumbnail(target.user.displayAvatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "report")
            .addField("**User Reported**", `${target}`)
            .addField("**User ID**", `${target.user.id}`)
            .addField("**Reported By**", `${message.member}`)
            .addField("**Reported in**", `${message.channel}`)
            .addField("**Reason**", `**${reason || "No Reason"}**`)
            .addField("**Date**", message.createdAt.toLocaleString());

        sChannel.send(sembed);
    }
}
