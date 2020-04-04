const { MessageEmbed } = require("discord.js");
const { formatDate } = require("../../functions.js");

module.exports = {
    config: {
        name: "whois",
        category: "info",
        aliases: ["who", "user", "userinfo"],
        description: "Returns user information",
        usage: "[id | mention]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]);
      
        if(!member)
          return undefined;
      
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setTitle("User Info")
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor("GREEN")
            .addField("**User information**", `${member.displayName}`)
            .addField("**ID**", `${member.user.id}`)
            .addField("**Username**",`${member.user.username}`)
            .addField("**Tag**", `${member.user.tag}`)
            .addField("**Created at**", `${created}`)
            .addField("**Joined at**", `${joined}`)
            .addField("**Roles**", `${roles}`, true)
            .setTimestamp()

        if (member.user.presence.game)
            embed.addField('Currently playing',`\n**${member.user.presence.game.name}**`);

        message.channel.send(embed);
    }
}