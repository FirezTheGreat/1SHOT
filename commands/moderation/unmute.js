const { MessageEmbed } = require("discord.js")
const { redlight } = require("../../JSON/colours.json");

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
        if (!message.member.hasPermission("ADMINISTRATOR") || !message.guild.owner) return message.channel.send("**You Dont Have The Permissions To Unmute Someone!**");

        if (!message.guild.me.hasPermission(["ADMINISTRATOR"])) return message.channel.send("**I Don't Have Permissions To Unmute Someone!**")

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return message.channel.send("Please name a user!");

        if (!mutee.roles.cache.has("muted")) return message.channel.send("**The user is not Muted!**")

        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.cache.find(r => r.name === "muted")
        if (!muterole) return message.channel.send("There is no mute role to remove!")

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
        mutee.roles.remove(muterole.id).then(() => {
            mutee.send(`Hello, you have been unmuted in ${message.guild.name} for ${reason || "**No Reason**"}`).catch(err => console.log(err))

            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} was successfully unmuted.`)
            message.channel.send(sembed);
        });

        let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL())
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unmute")
            .addField("**Unmuted**", mutee.user.username)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp();

        let sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(embed)

    }
}