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

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Dont Have The Permissions To Add Roles To Users!**");
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send("**I Dont Have The Permissions To Add Roles To Users!**");
        var rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!rMember) return message.channel.send("**Please Enter A User Name!**");
        var role = args.slice(1).join(' ');
        if (!role) return message.channel.send("**Please Enter A Role!**");
        
        var gRole = message.guild.roles.cache.find(element => element.name === role);
        if (!gRole)
        return message.channel.send("Couldn't find that role");
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