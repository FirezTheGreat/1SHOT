const { RichEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "removerole",
        category: "moderation",
        aliases: ["rr"],
        description: "Removes role from the user",
        accessableby: "Administrator",
        usage: ", rr [username , id | role]",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you cant do that");
        var rMember = message.guild.member(message.mentions.users.first()) || bot.users.get(args[0]);
        if (!rMember) return message.reply("Couldn't find that user");
        var role = args.slice(1).join(' ');
        if (!role) return message.reply("Specify a role!");

        var gRole = message.guild.roles.find(element => element.name === role);
        if (!gRole) return message.reply("Couldn't find that role");

        if (rMember.roles.has(gRole.id)) await (rMember.removeRole(gRole.id));

        const sembed = new RichEmbed()
            .setColor("GREEN")
            .setDescription(`Role has been removed from ${rMember.user.username}`)
        message.channel.send(sembed);

        const embed = new RichEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
            .setColor("#ff0000")
            .setThumbnail(rMember.user.displayAvatarURL)
            .setFooter(message.guild.name, message.guild.iconURL)
            .addField("Moderation:", "removerole")
            .addField("Removed Role from:", rMember.user.username)
            .addField("Removed By:", message.author.username)
            .addField("Date:", message.createdAt.toLocaleString())
            .setTimestamp();
    
        var sChannel = message.guild.channels.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
}