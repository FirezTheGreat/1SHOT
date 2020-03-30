const { RichEmbed } = require("discord.js")
const { redlight } = require("../../colours.json");

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
        if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.owner) return bot.send("You dont have permission to use this command.");

        if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to add roles!")

        let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!mutee) return message.channel.send("Please name a user!");

        let reason = args.slice(1).join(" ");

        let muterole = message.guild.roles.find(r => r.name === "muted")
        if (!muterole) return message.channel.send("There is no mute role to remove!")

        mutee.removeRole(muterole.id).then(() => {
            mutee.send(`Hello, you have been unmuted in ${message.guild.name} for: ${reason || "**No Reason**"}`).catch(err => console.log(err))

            const sembed = new RichEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setDescription(`${mutee.user.username} was successfully unmuted.`)
            message.channel.send(sembed);
        });

        let embed = new RichEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL)
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .addField("**Moderation**", "unmute")
            .addField("**Unmuted**", mutee.user.username)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp();

        let sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)

    }
}