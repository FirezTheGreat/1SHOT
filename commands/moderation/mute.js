const { MessageEmbed } = require("discord.js")
const { redlight } = require("../../JSON/colours.json");

module.exports = {
    config: {
        name: "mute",
        description: "Mutes a member in the discord!",
        usage: "[ user | <reason> (optional)]",
        category: "moderation",
        accessableby: "everyone",
        noalias: "No Aliases"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR") || !message.guild.owner) return message.channel.send("**You Dont Have Permmissions To Mute Someone!**");

        if (!message.guild.me.hasPermission(["ADMINISTRATOR"])) return message.channel.send("**I Don't Have Permissions To Mute Someone!**")

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return message.channel.send("**Please Enter A User To Be Muted!**");
        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.cache.find(r => r.name === "muted")
        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({
                    data: {
                        name: "muted",
                        color: "#514f48",
                        permissions: []
                    }
                })
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false,
                        CONNECT: false,
                    })
                })
            } catch (e) {
                console.log(e);
            }
        }
        mutee.roles.set([])
        mutee.roles.add(muterole.id).then(() => {
            mutee.send(`Hello, you have been muted in ${message.guild.name} for ${reason || "No Reason"}`).catch(err => console.log(err))
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} was successfully muted.`)
            message.channel.send(sembed);
        })

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

        let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL())
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("Moderation:", "mute")
            .addField("Mutee:", mutee.user.username)
            .addField("Moderator:", message.author.username)
            .addField("Reason:", reason || "No Reason")
            .addField("Date:", message.createdAt.toLocaleString())

        let sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
}