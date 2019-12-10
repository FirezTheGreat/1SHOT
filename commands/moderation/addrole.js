const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "addrole",
        aliases: ["ar"],
        description: "Adds role to a user",
        category: "moderation",
        usage: ", ar [username , id | role ]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_CHANNELS", "MANAGE_ROLES")) return message.reply("You dont have the permission to do so.");
        var rMember = message.guild.member(message.mentions.users.first()) || bot.users.get(args[0])
        if (!rMember) return message.channel.send("Name a user");
        var role = args.slice(1).join(' ');
        if (!role) return message.reply("Specify a role!");

        var gRole = message.guild.roles.find(element => element.name === role);
        if (!gRole)
            return message.reply("Couldn't find that role");

        if (!rMember.roles.has(gRole.id)) await rMember.addRole(gRole.id);
        var sembed = new RichEmbed()
            .setColor("GREEN")
            .setDescription(`Role has been added to ${rMember.user.username}`)
        message.channel.send(sembed);
        const embed = new RichEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .setColor("#ff0000")
            .setThumbnail(rMember.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .addField("Moderation:", "addrole")
            .addField("Added Role to:", rMember.user.username)
            .addField("Added By:", message.author.username)
            .addField("Date:", message.createdAt.toLocaleString());

        var sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
}