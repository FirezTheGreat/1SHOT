  
const { RichEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "serverinfo",
        description: "Pulls the serverinfo of the guild!",
        usage: ", !sinfo",
        category: "info",
        accessableby: "everyone",
        aliases: ["sinfo"]
    },
    run: async (guild, message, args) => {
        let embed = new RichEmbed()
            .setColor("RANDOM")
            .setTitle("Server Info")
            .setThumbnail(message.guild.iconURL)
            .setAuthor(`${message.guild.name} Info`, message.guild.iconURL)
            .addField("**Guild Name:**", `${message.guild.name}`, true)
            .addField("**Guild Owner:**", `${message.guild.owner.user.tag}`, true)
            .addField("**ID:**", `${message.guild.id}`)
            .addField("**Created At:**", `${message.guild.createdAt}`)
            .addField("**Text Channels:**", `${message.guild.channels.filter(r => r.type === "text").size}`)
            .addField("**Voice Channels:**", `${message.guild.channels.filter(c => c.type === "voice").size}`)
            .addField("**Members:**", `${message.guild.memberCount}`, true)
            .addField("**Roles:**", `${message.guild.roles.size}`, true)
        message.channel.send(embed);
    }
}
