  const { RichEmbed } = require("discord.js");
  const { stripIndents } = require("common-tags");
  const { getMember, formatDate } = require("../../functions.js");

  module.exports = {
      config: {
          name: "whois",
          category: "info",
          aliases: ["who", "user", "userinfo"],
          description: "Returns user information",
          usage: "[username | id | mention]",
      },
      run: async (bot, message, args) => {
          const member = getMember(message, args.join(" "));

          const joined = formatDate(member.joinedAt);
          const roles = member.roles
              .filter(r => r.id !== message.guild.id)
              .map(r => r).join(", ") || 'none';

          const created = formatDate(member.user.createdAt);

          const embed = new RichEmbed()
              .setFooter(member.displayName, member.user.displayAvatarURL)
              .setThumbnail(member.user.displayAvatarURL)
              .setColor("RANDOM")

              .addField('User information', stripIndents `${member.displayName}
            **> ID** ${member.user.id}
            **> Username** ${member.user.username}
            **> Tag** ${member.user.tag}
            **> Created at** ${created}
            **> Joined at** ${joined}
            **> Roles** ${roles}`, true)

              .setTimestamp()

          if (member.user.presence.game)
              embed.addField('Currently playing', stripIndents `**> ${member.user.presence.game.name}**`);

          message.channel.send(embed);
      }
  }
