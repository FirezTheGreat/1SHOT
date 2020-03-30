const { RichEmbed } = require("discord.js")
const { redlight } = require("../../colours.json");

module.exports = {
    config: {
        name: "mute",
        noalias: "",
        description: "Mutes a member in the discord!",
        usage: "[user | <reason> (optional)]",
        category: "moderation",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");

        if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")

        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!mutee) return message.channel.send("Please supply a user to be muted!");

        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.find(r => r.name === "muted")
        if (!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: "muted",
                    color: "#979797",
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false
                    })
                })
            } catch (e) {
                console.log(e.stack);
            }
        }

        mutee.addRole(muterole.id).then(() => {
            mutee.send(`Hello, you have been muted in ${message.guild.name} for: ${reason || "**No Reason**"}`).catch(err => console.log(err))


            let sembed = new RichEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setDescription(`${mutee.user.username} was successfully muted.`)
            message.channel.send(sembed);
        })

        let embed = new RichEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL)
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .addField("**Moderation**", "mute")
            .addField("**Muted**", mutee.user.username)
            .addField("**Muted By**", message.author.username)
            .addField("**Reason**", reason || "No Reason")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();

        let sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
}