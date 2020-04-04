const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "addrole",
        aliases: ["ar"],
        description: "Adds role to a user",
        category: "moderation",
        usage: "[username , id | role ]",
        accessableby: "Administrator",
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_CHANNELS", "MANAGE_ROLES")) return message.channel.send("You dont have the permission to do so.");
        var rMember = message.guild.member(message.mentions.users.first()) || bot.users.cache.get(args[0])
        if (!rMember) return message.channel.send("Name a user");
        var role = args.slice(1).join(' ');
        if (!role) return message.channel.send("Specify a role!");
        
        var gRole = message.guild.roles.cache.find(element => element.name === role);
        if (!gRole)
        return message.channel.send("Couldn't find that role");

        if (!rMember.roles.cache.has(gRole.id)) await rMember.roles.add(gRole.id);
        var sembed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`Role has been added to ${rMember.user.username}`)
        message.channel.send(sembed)
      
        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("#ff0000")
            .setThumbnail(rMember.user.displayAvatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Moderation**", "addrole")
            .addField("**Added Role to**", rMember.user.username)
            .addField("**Added By**", message.author.username)
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.find(c => c.name === "modlogs")
        sChannel.send(embed)
    }
};