module.exports = {
  config: {
    name: "avatar",
    aliases: ["av"],
    category: "fun",
    description: "Shows Avatar",
    usage: "[mention | id]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => { 
    
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    if (args[0]) {
      message.channel.send({
        embed: {

          title: `${user.user.username}'s Avatar`,

          color: 0xFFEFD5,

          image: {
            url: `${user.user.displayAvatarURL({dynamic: true})}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }
        }
      })
    }
    else if (!args[0]) {
      message.channel.send({
        embed: {

          title: `${user.user.username}'s Avatar`,

          color: 0xFFEFD5,

          image: {
            url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }

        }
      })
    }
  }
}