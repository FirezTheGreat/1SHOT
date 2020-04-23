const { MessageEmbed } = require("discord.js");
const { redlight } = require("../../JSON/colours.json");
const db = require('quick.db');

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
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("**You Dont Have Permmissions To Mute Someone!**");

        if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("**I Don't Have Permissions To Mute Someone!**")

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!mutee) return message.channel.send("**Please Enter A User To Be Muted!**");
        if (mutee === message.member) return message.channel.send("**You Cannot Mute Yourself!**")
        if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Mute This User!**')
        let reason = args.slice(1).join(" ");
        if (mutee.user.bot) return message.channel.send("**Cannot Mute Bots!**");
        const userRoles = mutee.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r.id)
        let muterole = message.guild.roles.cache.find(r => r.name === "muted")
        if (mutee.roles.cache.has(muterole.id)) return message.channel.send("User is Already Muted!")
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
        };
        
        db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
        mutee.roles.set([muterole.id]).then(() => {
            mutee.send(`Hello, you have been muted in ${message.guild.name} for ${reason || "No Reason"}`).catch(err => console.log(err))
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} was successfully muted.`)
            message.channel.send(sembed);
        })
        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;
     
        let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("Moderation:", "mute")
            .addField("Mutee:", mutee.user.username)
            .addField("Moderator:", message.author.username)
            .addField("Reason:", reason || "No Reason")
            .addField("Date:", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    }
}