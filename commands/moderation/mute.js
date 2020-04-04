const { MessageEmbed } = require("discord.js")
const { redlight } = require("../../colours.json");

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
        if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");

        if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return message.channel.send("Please supply a user to be muted!");

        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.cache.find(r => r.name === "muted")
        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({
                    data: {
                        name: "muted",
                        color: "#514f48",
                        permissions: []
                    },
                })
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.permissionOverwrites(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false,
                        CONNECT: false,
                    })
                })
            } catch (e) {
                console.log(e.stack);
            }
        }
        mutee.roles.set([])
        mutee.roles.add(muterole.id).then(() => {
            mutee.send(`Hello, you have been in ${message.guild.name} for ${reason || "No Reason"}`).catch(err => console.log(err))
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} was successfully muted.`)
            message.channel.send(sembed);
        })

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