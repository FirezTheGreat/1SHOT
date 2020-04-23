const { MessageEmbed } = require("discord.js")
const { redlight } = require("../../JSON/colours.json");
const db = require('quick.db');

module.exports = {
    config: {
        name: "unmute",
        aliases: ["um"],
        description: "Unmutes a member in the discord!",
        usage: "[user | <reason> (optional)]",
        accessableby: "Administrator",
        category: "moderation",
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("**You Dont Have The Permissions To Unmute Someone!**");

        if (!message.guild.me.hasPermission("ADMINISTRATOR") || !message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("**I Don't Have Permissions To Unmute Someone!**")

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return message.channel.send("**Enter A User!**");

        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.cache.find(r => r.name === "muted")
        if (!muterole) return message.channel.send("There is no mute role to remove!")
        if (!mutee.roles.cache.has(muterole.id)) return message.channel.send("**User is not Muted!**")

        let channel = db.fetch(`modlog_${message.guild.id}`)
        mutee.roles.remove(muterole.id).then(() => {
            mutee.send(`Hello, you have been unmuted in ${message.guild.name} for ${reason || "**No Reason**"}`).catch(err => console.log(err))
            let roleadds = db.fetch(`muteeid_${message.guild.id}_${mutee.id}`)
            mutee.roles.add(roleadds)

            if (!channel) return;
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} was successfully unmuted.`)
            message.channel.send(sembed);
        });

        let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unmute")
            .addField("**Unmuted**", mutee.user.username)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)

    }
}