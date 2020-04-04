const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: 'roleinfo',
        category: "info",
        aliases: ["rinfo"],
        description: "shows stats of the mentioned role",
        usage: "[role name]",
        accessableby: 'everyone'
    },
    run: async (bot, message, args) => {
    let role = args.join(` `)
    if(!role) return message.channel.send("Which role!");
    let gRole = message.guild.roles.cache.find(r => r.name === role)
    if(!gRole) return message.channel.send("Couldn't find that role.");

    const status = {
        false: "No",
        true: "Yes"
      }

    let roleembed = new MessageEmbed()
    .setColor("#00ff00")
    .setAuthor("Role Info")
    .setThumbnail(message.guild.iconURL())
    .addField("ID", `\`${gRole.id}\``, true )
    .addField("Name", gRole.name, true)
    .addField("Hex", gRole.hexColor)
    .addField("Members", gRole.members.size)
    .addField("Position", gRole.position)
    .addField("Mentionable", status[gRole.mentionable])
    .setTimestamp()
    
    message.channel.send(roleembed);

    }
}